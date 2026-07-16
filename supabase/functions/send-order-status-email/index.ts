import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SENDER_EMAIL = "support@managewise.app";
const SENDER_NAME = "IGS Rooflights";

interface StatusNotificationPayload {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  newStatus: string;
}

const STATUS_MESSAGES: Record<string, { subject: string; headline: string; body: string }> = {
  processing: {
    subject: "Your order is being processed",
    headline: "Order Processing",
    body: "Your order has been received and is now being processed by our team. We'll update you once production begins.",
  },
  manufacturing: {
    subject: "Your order is now in production",
    headline: "Order in Manufacturing",
    body: "Good news! Your rooflight order has moved into our manufacturing facility and is being built to your specifications.",
  },
  dispatched: {
    subject: "Your order has been dispatched",
    headline: "Order Dispatched",
    body: "Your order has been dispatched and is on its way to you. Please ensure someone is available to receive the delivery.",
  },
  delivered: {
    subject: "Your order has been delivered",
    headline: "Order Delivered",
    body: "Your order has been marked as delivered. Thank you for choosing IGS Rooflights. If you have any questions, please contact our team.",
  },
  cancelled: {
    subject: "Your order has been cancelled",
    headline: "Order Cancelled",
    body: "Your order has been cancelled. If you believe this is an error or have questions, please contact our team on 01895 762 795.",
  },
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const payload: StatusNotificationPayload = await req.json();

    if (!payload.orderNumber || !payload.customerEmail || !payload.newStatus) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    if (!brevoApiKey) {
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const msg = STATUS_MESSAGES[payload.newStatus];
    if (!msg) {
      return new Response(
        JSON.stringify({ error: "No email template for this status" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const htmlBody = buildEmailHtml(payload, msg);
    const textBody = buildEmailText(payload, msg);

    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        sender: { email: SENDER_EMAIL, name: SENDER_NAME },
        to: [{ email: payload.customerEmail, name: payload.customerName }],
        replyTo: { email: SENDER_EMAIL, name: SENDER_NAME },
        subject: `${msg.subject} — ${payload.orderNumber}`,
        htmlContent: htmlBody,
        textContent: textBody,
      }),
    });

    if (!brevoResponse.ok) {
      const errorText = await brevoResponse.text();
      console.error("Brevo API error:", brevoResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to send email", detail: errorText, status: brevoResponse.status }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildEmailHtml(p: StatusNotificationPayload, msg: { subject: string; headline: string; body: string }): string {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#fafaf8;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <p style="font-family:sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#265954;font-weight:600;margin:0 0 8px 0;">${escapeHtml(msg.headline)}</p>
    <h1 style="font-family:sans-serif;font-size:28px;color:#050505;margin:0 0 24px 0;">${escapeHtml(msg.subject)}</h1>
    <p style="font-family:sans-serif;font-size:15px;color:#111;line-height:1.6;margin:0 0 24px 0;">${escapeHtml(msg.body)}</p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <tr><td style="padding:8px 0;font-family:sans-serif;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.1em;width:180px;vertical-align:top;">Order Number</td><td style="padding:8px 0;font-family:sans-serif;font-size:15px;color:#111;font-weight:600;vertical-align:top;">${escapeHtml(p.orderNumber)}</td></tr>
      <tr><td style="padding:8px 0;font-family:sans-serif;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.1em;vertical-align:top;">Customer</td><td style="padding:8px 0;font-family:sans-serif;font-size:15px;color:#111;vertical-align:top;">${escapeHtml(p.customerName)}</td></tr>
    </table>
    <div style="padding:20px;background:#fff;border:1px solid #dedede;border-radius:8px;margin-bottom:24px;">
      <p style="font-family:sans-serif;font-size:13px;color:#555;line-height:1.6;margin:0;">Need help? Contact our team at <a href="mailto:support@managewise.app" style="color:#265954;">support@managewise.app</a> or call <strong>01895 762 795</strong>.</p>
    </div>
    <p style="font-family:sans-serif;font-size:12px;color:#999;margin:32px 0 0 0;">This is an automated update from IGS Rooflights. Order reference: ${escapeHtml(p.orderNumber)}</p>
  </div></body></html>`;
}

function buildEmailText(p: StatusNotificationPayload, msg: { subject: string; headline: string; body: string }): string {
  return [
    msg.headline.toUpperCase(),
    "==================",
    "",
    msg.subject,
    "",
    msg.body,
    "",
    `Order Number: ${p.orderNumber}`,
    `Customer:     ${p.customerName}`,
    "",
    "Need help? Contact us at support@managewise.app or call 01895 762 795.",
    "",
    "-- IGS Rooflights automated update",
  ].join("\n");
}
