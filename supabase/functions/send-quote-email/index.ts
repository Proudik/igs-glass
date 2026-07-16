import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RECIPIENT_EMAIL = "support@managewise.app";
const SENDER_EMAIL = "support@managewise.app";
const SENDER_NAME = "IGS Website";

interface QuotePayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectLocation?: string;
  productInterest: string;
  dimensions?: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const payload: QuotePayload = await req.json();

    if (!payload.name || !payload.email || !payload.productInterest || !payload.message) {
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

    const htmlBody = buildEmailHtml(payload);
    const textBody = buildEmailText(payload);

    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        sender: { email: SENDER_EMAIL, name: SENDER_NAME },
        to: [{ email: RECIPIENT_EMAIL }],
        replyTo: { email: payload.email, name: payload.name },
        subject: `New Quote Enquiry — ${payload.productInterest}`,
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

function buildEmailHtml(p: QuotePayload): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px 0;font-family:sans-serif;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.1em;width:180px;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 0;font-family:sans-serif;font-size:15px;color:#111;vertical-align:top;">${escapeHtml(value)}</td></tr>`;

  const rows = [
    row("Name", p.name),
    row("Email", p.email),
    p.phone ? row("Phone", p.phone) : "",
    p.company ? row("Company", p.company) : "",
    p.projectLocation ? row("Project Location", p.projectLocation) : "",
    row("Product Interest", p.productInterest),
    p.dimensions ? row("Dimensions / Spec", p.dimensions) : "",
  ].filter(Boolean).join("");

  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#fafaf8;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <p style="font-family:sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#265954;font-weight:600;margin:0 0 8px 0;">New Quote Enquiry</p>
    <h1 style="font-family:sans-serif;font-size:28px;color:#050505;margin:0 0 24px 0;">Quote Request from Website</h1>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">${rows}</table>
    <p style="font-family:sans-serif;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#999;margin:0 0 8px 0;">Message</p>
    <div style="font-family:sans-serif;font-size:15px;color:#111;line-height:1.6;padding:16px;background:#fff;border:1px solid #dedede;border-radius:8px;">${escapeHtml(p.message).replace(/\n/g, "<br>")}</div>
    <p style="font-family:sans-serif;font-size:12px;color:#999;margin:32px 0 0 0;">This enquiry was submitted via the IGS website quote form.</p>
  </div></body></html>`;
}

function buildEmailText(p: QuotePayload): string {
  const lines = [
    "NEW QUOTE ENQUIRY",
    "=================",
    "",
    `Name:             ${p.name}`,
    `Email:            ${p.email}`,
  ];
  if (p.phone) lines.push(`Phone:            ${p.phone}`);
  if (p.company) lines.push(`Company:          ${p.company}`);
  if (p.projectLocation) lines.push(`Project Location: ${p.projectLocation}`);
  lines.push(`Product Interest: ${p.productInterest}`);
  if (p.dimensions) lines.push(`Dimensions/Spec:  ${p.dimensions}`);
  lines.push("", "Message:", "--------", p.message, "", "-- Sent from the IGS website quote form");
  return lines.join("\n");
}
