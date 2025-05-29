import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RefundRequest {
  billingHistoryId: string;
  reason?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const { billingHistoryId, reason }: RefundRequest = await req.json();

    // Get billing history record
    const { data: billingRecord, error: billingError } = await supabase
      .from("billing_history")
      .select("*")
      .eq("id", billingHistoryId)
      .eq("user_id", userData.user.id)
      .single();

    if (billingError || !billingRecord) {
      throw new Error("Billing record not found");
    }

    // Check if already refunded
    if (billingRecord.refunded_at) {
      throw new Error("This payment has already been refunded");
    }

    // Check refund eligibility based on charge type and timing
    const chargedAt = new Date(billingRecord.charged_at);
    const now = new Date();
    const daysSinceCharge = Math.floor((now.getTime() - chargedAt.getTime()) / (1000 * 60 * 60 * 24));

    let refundWindowDays = 0;
    switch (billingRecord.charge_type) {
      case "subscription":
        refundWindowDays = 14; // Players subscription refundable within 14 days
        break;
      case "addon_setup":
        refundWindowDays = 2; // Website setup refundable within 2 days
        break;
      case "addon_monthly":
        refundWindowDays = 7; // Website monthly fee refundable within 7 days
        break;
    }

    if (daysSinceCharge > refundWindowDays) {
      throw new Error(`Refund window has expired. This charge is only refundable within ${refundWindowDays} days.`);
    }

    // Create refund request
    const { data: refundRequest, error: refundError } = await supabase
      .from("refund_requests")
      .insert({
        user_id: userData.user.id,
        billing_history_id: billingHistoryId,
        amount: billingRecord.amount,
        reason: reason || "Customer requested refund",
        status: "pending"
      })
      .select()
      .single();

    if (refundError) {
      throw new Error("Failed to create refund request");
    }

    // For automatic processing, we could process the refund immediately
    // For now, we'll just create the request for manual review
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    try {
      // Process refund automatically for eligible requests
      const refund = await stripe.refunds.create({
        payment_intent: billingRecord.stripe_payment_intent_id,
        amount: Math.round(billingRecord.amount * 100), // Convert to cents
        reason: "requested_by_customer",
        metadata: {
          refund_request_id: refundRequest.id,
          user_id: userData.user.id
        }
      });

      // Update refund request and billing history
      await supabase.from("refund_requests").update({
        status: "processed",
        stripe_refund_id: refund.id,
        processed_at: new Date().toISOString()
      }).eq("id", refundRequest.id);

      await supabase.from("billing_history").update({
        refunded_at: new Date().toISOString(),
        refund_amount: billingRecord.amount
      }).eq("id", billingHistoryId);

      return new Response(JSON.stringify({
        success: true,
        message: "Refund processed successfully",
        refundId: refund.id,
        amount: billingRecord.amount
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } catch (stripeError) {
      // If automatic refund fails, keep request as pending for manual review
      return new Response(JSON.stringify({
        success: true,
        message: "Refund request submitted for review",
        requestId: refundRequest.id
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
