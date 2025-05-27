
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customer, addons, pricing } = await req.json();
    
    const discordWebhookUrl = Deno.env.get("DISCORD_WEBHOOK_URL");
    if (!discordWebhookUrl) {
      throw new Error("Discord webhook URL not configured");
    }

    // Create a rich embed for Discord
    const embed = {
      title: "🎮 New CraftNet Server Order",
      color: 0x10b981, // Green color
      fields: [
        {
          name: "👤 Customer",
          value: `**Name:** ${customer.name}\n**Email:** ${customer.email}${customer.discord ? `\n**Discord:** ${customer.discord}` : ''}`,
          inline: false
        },
        {
          name: "🖥️ Server Details",
          value: `**Name:** ${customer.serverName || 'Not specified'}\n**Players:** ${customer.playerCount}`,
          inline: true
        },
        {
          name: "💰 Pricing",
          value: `**Monthly:** €${pricing.totalMonthly}${pricing.totalSetup > 0 ? `\n**Setup:** €${pricing.totalSetup}` : ''}`,
          inline: true
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "CraftNet Hosting"
      }
    };

    // Add addons field if any are selected
    if (addons && addons.length > 0) {
      const addonsList = addons.map((addon: any) => `• ${addon.title}`).join('\n');
      embed.fields.push({
        name: "🔧 Selected Add-ons",
        value: addonsList,
        inline: false
      });
    }

    const discordPayload = {
      content: "@here New customer order received!",
      embeds: [embed]
    };

    const response = await fetch(discordWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discordPayload),
    });

    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.status}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error sending Discord notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
