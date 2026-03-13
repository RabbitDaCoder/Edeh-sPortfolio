const http = require("http");
const nodemailer = require("nodemailer");

/* ─── Config (lazy — read at request time so dotenv has loaded) ─── */
function getConfig() {
  return {
    API_KEY: process.env.EMAIL_API_KEY || "dev-secret-key",
    SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
    SMTP_PORT: Number(process.env.SMTP_PORT) || 465,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM || process.env.SMTP_USER,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
  };
}

let _transporter = null;
function getTransporter() {
  if (_transporter) return _transporter;
  const cfg = getConfig();
  _transporter = nodemailer.createTransport({
    host: cfg.SMTP_HOST,
    port: cfg.SMTP_PORT,
    secure: cfg.SMTP_PORT === 465,
    auth: { user: cfg.SMTP_USER, pass: cfg.SMTP_PASS },
  });
  return _transporter;
}

/* ─── HTML Helpers ───────────────────────────────────────────────── */
function esc(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function detailCard(icon, label, value) {
  return `
    <td style="padding:0 6px;width:50%;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;">
            <span style="font-size:16px;line-height:1;">${icon}</span>
            <span style="display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#94a3b8;margin:6px 0 2px;">${label}</span>
            <span style="display:block;font-size:14px;font-weight:600;color:#1e293b;">${value}</span>
          </td>
        </tr>
      </table>
    </td>`;
}

/* ─── Email Templates ────────────────────────────────────────────── */
function buildProposalHtml(data) {
  const cards = [];
  if (data.company)
    cards.push(detailCard("&#x1f3e2;", "Company", esc(data.company)));
  if (data.projectType)
    cards.push(detailCard("&#x1f4cb;", "Project", esc(data.projectType)));
  if (data.budget)
    cards.push(detailCard("&#x1f4b0;", "Budget", esc(data.budget)));
  if (data.timeline)
    cards.push(detailCard("&#x23f0;", "Timeline", esc(data.timeline)));

  // Build card grid rows (2 per row)
  let cardGrid = "";
  for (let i = 0; i < cards.length; i += 2) {
    cardGrid += `<tr>${cards[i]}${cards[i + 1] || '<td style="padding:0 6px;width:50%;"></td>'}</tr>
    <tr><td colspan="2" style="height:10px;"></td></tr>`;
  }

  const subject = data.projectType
    ? `New Proposal: ${data.projectType}`
    : "New Contact Form Submission";

  const firstName = esc(data.name).split(" ")[0];

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

        <!-- Logo / Brand Bar -->
        <tr>
          <td style="padding:0 0 24px;text-align:center;">
            <span style="font-size:28px;font-weight:800;color:#0f172a;letter-spacing:-1px;">ECD</span>
            <span style="display:block;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:2px;margin-top:2px;">Portfolio</span>
          </td>
        </tr>

        <!-- Main Card -->
        <tr>
          <td style="background:#ffffff;border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,0.08);overflow:hidden;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

              <!-- Gradient Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#334155 100%);padding:36px 40px 32px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <span style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:20px;padding:5px 14px;font-size:11px;font-weight:600;color:#e2e8f0;text-transform:uppercase;letter-spacing:1px;">&#x2728; New Proposal</span>
                        <h1 style="margin:14px 0 0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px;line-height:1.3;">
                          ${firstName} wants to<br>work with you
                        </h1>
                      </td>
                      <td style="vertical-align:top;text-align:right;width:60px;">
                        <div style="width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,0.12);text-align:center;line-height:52px;font-size:24px;">&#x1f4e9;</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Sender Info Strip -->
              <tr>
                <td style="background:#f8fafc;border-bottom:1px solid #e2e8f0;padding:16px 40px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:middle;width:36px;">
                        <div style="width:36px;height:36px;border-radius:50%;background:#0f172a;color:#ffffff;text-align:center;line-height:36px;font-size:14px;font-weight:700;">${firstName.charAt(0).toUpperCase()}</div>
                      </td>
                      <td style="padding-left:12px;vertical-align:middle;">
                        <span style="display:block;font-size:14px;font-weight:700;color:#0f172a;">${esc(data.name)}</span>
                        <span style="display:block;font-size:12px;color:#64748b;">${esc(data.email)}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Detail Cards Grid -->
              ${
                cardGrid
                  ? `
              <tr>
                <td style="padding:24px 34px 14px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    ${cardGrid}
                  </table>
                </td>
              </tr>`
                  : ""
              }

              <!-- Message -->
              <tr>
                <td style="padding:${cardGrid ? "10px" : "28px"} 40px 28px;">
                  <p style="margin:0 0 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#94a3b8;">Message</p>
                  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:3px solid #0f172a;border-radius:0 10px 10px 0;padding:20px 24px;font-size:14px;line-height:1.8;color:#334155;">
                    ${esc(data.message).replace(/\n/g, "<br>")}
                  </div>
                </td>
              </tr>

              <!-- CTA Button -->
              <tr>
                <td style="padding:4px 40px 36px;text-align:center;">
                  <a href="mailto:${esc(data.email)}?subject=Re: ${encodeURIComponent(subject)}"
                     style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:14px;font-weight:700;letter-spacing:0.3px;">
                    &#x21a9;&#xfe0f; Reply to ${firstName}
                  </a>
                  <p style="margin:12px 0 0;font-size:12px;color:#94a3b8;">or forward to your team</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:28px 20px 0;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
              Sent from your portfolio contact form<br>
              <span style="color:#cbd5e1;">&mdash; Edeh Chinedu Daniel &mdash;</span>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

function buildWelcomeHtml(data) {
  const email = data && data.email ? esc(data.email) : "";

  return {
    subject: "Welcome to the community!",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Welcome!</title></head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

        <!-- Logo / Brand Bar -->
        <tr>
          <td style="padding:0 0 24px;text-align:center;">
            <span style="font-size:28px;font-weight:800;color:#0f172a;letter-spacing:-1px;">ECD</span>
            <span style="display:block;font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:2px;margin-top:2px;">Portfolio</span>
          </td>
        </tr>

        <!-- Main Card -->
        <tr>
          <td style="background:#ffffff;border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,0.08);overflow:hidden;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#334155 100%);padding:40px 40px 36px;text-align:center;">
                  <div style="width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,0.12);text-align:center;line-height:64px;font-size:32px;margin:0 auto 16px;">&#x1f389;</div>
                  <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">You're in!</h1>
                  <p style="margin:10px 0 0;color:#94a3b8;font-size:14px;">Welcome to the community</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:36px 40px;">
                  <p style="margin:0 0 20px;color:#334155;font-size:15px;line-height:1.8;">
                    Thanks for subscribing! You'll be the first to know about:
                  </p>

                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:12px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px 10px 0 0;">
                        <span style="font-size:16px;vertical-align:middle;">&#x1f4dd;</span>
                        <span style="font-size:14px;color:#334155;font-weight:500;vertical-align:middle;padding-left:8px;">New blog posts &amp; articles</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:12px 16px;background:#ffffff;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
                        <span style="font-size:16px;vertical-align:middle;">&#x1f680;</span>
                        <span style="font-size:14px;color:#334155;font-weight:500;vertical-align:middle;padding-left:8px;">Project launches &amp; case studies</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:12px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:0 0 10px 10px;">
                        <span style="font-size:16px;vertical-align:middle;">&#x1f4a1;</span>
                        <span style="font-size:14px;color:#334155;font-weight:500;vertical-align:middle;padding-left:8px;">Tech insights &amp; resources</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- CTA -->
              <tr>
                <td style="padding:0 40px 36px;text-align:center;">
                  <a href="https://edehchinedu.com"
                     style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:14px;font-weight:700;letter-spacing:0.3px;">
                    &#x1f30d; Visit Portfolio
                  </a>
                </td>
              </tr>

            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:28px 20px 0;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
              You're receiving this because you subscribed to updates.<br>
              <span style="color:#cbd5e1;">&mdash; Edeh Chinedu Daniel &mdash;</span>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}

/* ─── Send Email ─────────────────────────────────────────────────── */
async function sendEmail({ to, subject, html, replyTo }) {
  const cfg = getConfig();
  const info = await getTransporter().sendMail({
    from: cfg.SMTP_FROM,
    to,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
  });
  return { messageId: info.messageId };
}

/* ─── Request Handler ────────────────────────────────────────────── */
async function handleRequest(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check
  if (req.method === "GET" && (req.url === "/" || req.url === "/api/health")) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", service: "email-service" }));
    return;
  }

  // Only POST /api/send
  if (req.method !== "POST" || !req.url.startsWith("/api/send")) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  // Auth check
  const apiKey = req.headers["x-api-key"];
  const cfg = getConfig();
  if (apiKey !== cfg.API_KEY) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Unauthorized" }));
    return;
  }

  // Parse body
  let body = "";
  for await (const chunk of req) body += chunk;

  let data;
  try {
    data = JSON.parse(body);
  } catch {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid JSON" }));
    return;
  }

  try {
    const { type } = data;
    let result;

    if (type === "proposal" || type === "contact") {
      const { subject, html } = buildProposalHtml(data);
      result = await sendEmail({
        to: data.to || cfg.ADMIN_EMAIL,
        subject,
        html,
        replyTo: data.email,
      });
    } else if (type === "welcome") {
      const { subject, html } = buildWelcomeHtml(data);
      result = await sendEmail({
        to: data.email,
        subject,
        html,
      });
    } else {
      // Generic email — must provide to, subject, html
      if (!data.to || !data.subject || !data.html) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Missing required fields: to, subject, html",
          }),
        );
        return;
      }
      result = await sendEmail({
        to: data.to,
        subject: data.subject,
        html: data.html,
        replyTo: data.replyTo,
      });
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, ...result }));
  } catch (err) {
    console.error("Email send error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ error: "Failed to send email", details: err.message }),
    );
  }
}

/* ─── Vercel Serverless Export ───────────────────────────────────── */
module.exports = handleRequest;

/* ─── Standalone Server ──────────────────────────────────────────── */
if (require.main === module) {
  require("dotenv").config();

  // Re-read env after dotenv loads
  const PORT = process.env.PORT || 3002;
  const server = http.createServer(handleRequest);
  server.listen(PORT, () => {
    console.log(`Email service running on http://localhost:${PORT}`);
  });
}
