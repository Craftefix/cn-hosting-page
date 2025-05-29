
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const logStep = (step: string, details?: any) => {
  console.log(`[WEBHOOK] ${step}`, details ? JSON.stringify(details) : '');
};

serve(async (req) => {
  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!stripeKey || !webhookSecret) {
      throw new Error("Missing Stripe configuration");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    if (!signature) throw new Error("No signature provided");

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    logStep("Webhook event received", { type: event.type, id: event.id });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session, supabase, stripe);
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice, supabase);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice, supabase);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription, supabase);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription, supabase);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
    });
  }
});

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, supabase: any, stripe: Stripe) {
  logStep("Processing checkout completion", { sessionId: session.id });

  const metadata = session.metadata;
  if (!metadata) return;

  const { user_id, player_count, billing_day, selected_addons } = metadata;
  
  // Get the subscription from Stripe
  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
  
  // Create subscription record
  const subscriptionData = {
    user_id,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer as string,
    player_count: parseInt(player_count),
    billing_day: parseInt(billing_day),
    base_charge: 0, // Will be calculated
    player_charge: 0, // Will be calculated
    total_monthly: subscription.items.data[0].price.unit_amount! / 100,
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
  };

  const { data: subData, error: subError } = await supabase
    .from("subscriptions")
    .insert(subscriptionData)
    .select()
    .single();

  if (subError) {
    logStep("Error creating subscription", { error: subError });
    return;
  }

  // Create add-on records
  if (selected_addons) {
    const addons = selected_addons.split(",");
    const availableAddons = {
      website: { title: "Website", setupPrice: 12, monthlyPrice: 6, setupRefundDays: 2, monthlyRefundDays: 7 },
      ranks: { title: "In-Game Ranks & Economy", setupPrice: 12, monthlyPrice: 6, setupRefundDays: 2, monthlyRefundDays: 7 },
      antiCheat: { title: "Anti-Cheat Setup", setupPrice: 12, monthlyPrice: 6, setupRefundDays: 2, monthlyRefundDays: 7 },
      antixray: { title: "Anti-Xray", setupPrice: 12, monthlyPrice: 6, setupRefundDays: 2, monthlyRefundDays: 7 },
      webstore: { title: "Webstore", setupPrice: 12, monthlyPrice: 6, setupRefundDays: 2, monthlyRefundDays: 7 },
      analytics: { title: "Player Analytics Dashboard", setupPrice: 8, monthlyPrice: 4, setupRefundDays: 2, monthlyRefundDays: 7 }
    };

    for (const addonId of addons) {
      const addon = availableAddons[addonId as keyof typeof availableAddons];
      if (addon) {
        await supabase.from("subscription_addons").insert({
          subscription_id: subData.id,
          addon_type: addonId,
          title: addon.title,
          setup_fee: addon.setupPrice,
          monthly_fee: addon.monthlyPrice,
          setup_refund_days: addon.setupRefundDays,
          monthly_refund_days: addon.monthlyRefundDays,
          setup_charged_at: new Date().toISOString()
        });
      }
    }
  }

  // Create user profile if doesn't exist
  await supabase.from("user_profiles").upsert({
    id: user_id,
    email: session.customer_email,
    billing_day: parseInt(billing_day)
  });

  logStep("Checkout processing completed", { subscriptionId: subData.id });
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
  logStep("Processing successful payment", { invoiceId: invoice.id });

  // Find user by customer ID
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", invoice.customer)
    .single();

  if (!subscription) return;

  // Record billing history
  await supabase.from("billing_history").insert({
    user_id: subscription.user_id,
    stripe_invoice_id: invoice.id,
    stripe_payment_intent_id: invoice.payment_intent,
    amount: invoice.amount_paid / 100,
    currency: invoice.currency,
    description: invoice.description || "Subscription payment",
    charge_type: "subscription",
    charged_at: new Date(invoice.created * 1000).toISOString()
  });
}

async function handlePaymentFailed(invoice: Stripe.Invoice, supabase: any) {
  logStep("Processing failed payment", { invoiceId: invoice.id });
  // Handle failed payment logic here
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any) {
  logStep("Processing subscription update", { subscriptionId: subscription.id });

  await supabase
    .from("subscriptions")
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq("stripe_subscription_id", subscription.id);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, supabase: any) {
  logStep("Processing subscription deletion", { subscriptionId: subscription.id });

  await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      updated_at: new Date().toISOString()
    })
    .eq("stripe_subscription_id", subscription.id);
}
