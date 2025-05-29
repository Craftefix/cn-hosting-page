
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CheckoutRequest {
  playerCount: number;
  selectedAddons: string[];
  billingDay?: number;
}

const logStep = (step: string, details?: any) => {
  console.log(`[CHECKOUT] ${step}`, details ? JSON.stringify(details) : '');
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Starting checkout process");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Authentication failed");

    const user = userData.user;
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Parse request body
    const { playerCount, selectedAddons, billingDay = 1 }: CheckoutRequest = await req.json();
    logStep("Request data", { playerCount, selectedAddons, billingDay });

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Get or create Stripe customer
    const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
    let customerId: string;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    } else {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { user_id: user.id }
      });
      customerId = customer.id;
      logStep("Created new customer", { customerId });
    }

    // Calculate base server cost and player cost
    const getBaseServerCharge = (players: number) => {
      if (players <= 5) return 6;
      if (players <= 10) return 7;
      if (players <= 15) return 8;
      if (players <= 20) return 10;
      if (players <= 25) return 11;
      if (players <= 30) return 12;
      if (players <= 50) return 15;
      if (players <= 75) return 19;
      if (players <= 100) return 23;
      if (players <= 150) return 27;
      return 32;
    };

    const baseCharge = getBaseServerCharge(playerCount);
    const playerCost = playerCount * 0.85;
    const totalMonthlyBase = baseCharge + playerCost;

    logStep("Calculated base costs", { baseCharge, playerCost, totalMonthlyBase });

    // Define available add-ons with pricing
    const availableAddons = {
      website: { title: "Website", setupPrice: 12, monthlyPrice: 6, setupRefundDays: 2, monthlyRefundDays: 7 },
      ranks: { title: "In-Game Ranks & Economy", setupPrice: 12, monthlyPrice: 6, setupRefundDays: 2, monthlyRefundDays: 7 },
      antiCheat: { title: "Anti-Cheat Setup", setupPrice: 12, monthlyPrice: 6, setupRefundDays: 2, monthlyRefundDays: 7 },
      antixray: { title: "Anti-Xray", setupPrice: 12, monthlyPrice: 6, setupRefundDays: 2, monthlyRefundDays: 7 },
      webstore: { title: "Webstore", setupPrice: 12, monthlyPrice: 6, setupRefundDays: 2, monthlyRefundDays: 7 },
      analytics: { title: "Player Analytics Dashboard", setupPrice: 8, monthlyPrice: 4, setupRefundDays: 2, monthlyRefundDays: 7 }
    };

    // Calculate add-on costs and determine billing timing
    const currentDate = new Date();
    const nextBillingDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, billingDay);
    const daysDifference = Math.ceil((nextBillingDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    const shouldChargeImmediately = daysDifference > 5;

    logStep("Billing timing calculation", { 
      currentDate: currentDate.toISOString(),
      nextBillingDate: nextBillingDate.toISOString(),
      daysDifference,
      shouldChargeImmediately 
    });

    // Build line items for checkout
    const lineItems: any[] = [];

    // Main subscription (base + players)
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: `Minecraft Server Hosting - ${playerCount} Players`,
          description: `Base server (€${baseCharge}) + ${playerCount} players (€${playerCost.toFixed(2)})`
        },
        unit_amount: Math.round(totalMonthlyBase * 100),
        recurring: { interval: "month" }
      },
      quantity: 1
    });

    // Add-ons
    let immediateAddonCost = 0;
    for (const addonId of selectedAddons) {
      const addon = availableAddons[addonId as keyof typeof availableAddons];
      if (!addon) continue;

      // Monthly recurring for add-on
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: `${addon.title} - Monthly`,
            description: `Monthly fee for ${addon.title}`
          },
          unit_amount: addon.monthlyPrice * 100,
          recurring: { interval: "month" }
        },
        quantity: 1
      });

      // Setup fee handling based on billing timing
      if (shouldChargeImmediately && addon.setupPrice > 0) {
        lineItems.push({
          price_data: {
            currency: "eur",
            product_data: {
              name: `${addon.title} - Setup Fee`,
              description: `One-time setup fee for ${addon.title}`
            },
            unit_amount: addon.setupPrice * 100
          },
          quantity: 1
        });
        immediateAddonCost += addon.setupPrice;
      }
    }

    logStep("Generated line items", { lineItemsCount: lineItems.length, immediateAddonCost });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/dash?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/dash?canceled=true`,
      metadata: {
        user_id: user.id,
        player_count: playerCount.toString(),
        billing_day: billingDay.toString(),
        selected_addons: selectedAddons.join(","),
        immediate_addon_cost: immediateAddonCost.toString()
      }
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ 
      url: session.url,
      sessionId: session.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
