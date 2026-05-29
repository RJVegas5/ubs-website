import { Resend } from "resend";

// ── Resend client (lazy-initialised so missing key = graceful fallback) ────────

let _resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

// ── Config ────────────────────────────────────────────────────────────────────

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://ubscleaningservices.com"
  ) as string;
}

const FROM_EMAIL = process.env.EMAIL_FROM ?? "UBS Ultimate Building Services <noreply@ubscleaningservices.com>";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Generate a human-friendly temporary password like UBS-K7X2-M9Q4 */
export function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I confusion
  const rand = (n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `UBS-${rand(4)}-${rand(4)}`;
}

// ── Portal welcome email ──────────────────────────────────────────────────────

export interface PortalWelcomeData {
  contactName:  string | null;
  companyName:  string | null;
  portalEmail:  string;
  tempPassword: string;
}

export async function sendPortalWelcomeEmail(data: PortalWelcomeData): Promise<{ sent: boolean; error?: string }> {
  const resend = getResend();
  const portalUrl = `${siteUrl()}/portal`;
  const loginUrl  = `${siteUrl()}/portal/login`;

  const greeting = data.contactName
    ? `Hi ${data.contactName.split(" ")[0]}`
    : data.companyName
    ? `Hi ${data.companyName} Team`
    : "Hello";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Your UBS Client Portal</title>
</head>
<body style="margin:0;padding:0;background:#070915;font-family:'Helvetica Neue',Arial,sans-serif;color:#ffffff;">

  <!-- Container -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#070915;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header bar -->
          <tr>
            <td style="background:#F5C518;padding:4px 0;border-radius:4px 4px 0 0;"></td>
          </tr>

          <!-- Logo / brand -->
          <tr>
            <td style="background:#0D0F1E;padding:32px 40px 24px;border-left:1px solid rgba(245,197,24,0.15);border-right:1px solid rgba(245,197,24,0.15);">
              <div style="font-size:26px;font-weight:900;letter-spacing:3px;color:#F5C518;text-transform:uppercase;">UBS</div>
              <div style="font-size:11px;color:#475569;letter-spacing:3px;text-transform:uppercase;margin-top:2px;">Ultimate Building Services</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#0D0F1E;padding:0 40px 32px;border-left:1px solid rgba(245,197,24,0.15);border-right:1px solid rgba(245,197,24,0.15);">

              <p style="font-size:22px;font-weight:700;color:#ffffff;margin:0 0 8px;">${greeting} 👋</p>
              <p style="font-size:15px;color:#94A3B8;line-height:1.6;margin:0 0 28px;">
                Your account has been approved and your private <strong style="color:#ffffff;">UBS Client Portal</strong> is ready.
                This is your dedicated transparency hub — see exactly what's happening with your property, in real time.
              </p>

              <!-- What's inside -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:rgba(59,79,200,0.12);border:1px solid rgba(59,79,200,0.25);border-radius:8px;padding:20px 24px;">
                    <div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#93A3F8;text-transform:uppercase;margin-bottom:14px;">Inside your portal</div>
                    ${[
                      ["📸", "Photo Timeline", "Before & after photos from every service visit"],
                      ["📋", "Job Updates",    "Real-time notes posted by our team on-site"],
                      ["💬", "Messages",       "Direct line to your UBS account manager"],
                      ["📄", "Documents",      "Estimates, invoices, and service records"],
                    ].map(([, title, desc]) => `
                    <table cellpadding="0" cellspacing="0" style="margin-bottom:12px;width:100%;">
                      <tr>
                        <td style="width:8px;vertical-align:top;padding-top:2px;">
                          <div style="width:6px;height:6px;background:#F5C518;border-radius:50%;"></div>
                        </td>
                        <td style="padding-left:10px;">
                          <span style="font-size:13px;font-weight:600;color:#ffffff;">${title}</span>
                          <span style="font-size:13px;color:#64748B;"> — ${desc}</span>
                        </td>
                      </tr>
                    </table>`).join("")}
                  </td>
                </tr>
              </table>

              <!-- Credentials box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:rgba(245,197,24,0.06);border:1px solid rgba(245,197,24,0.25);border-radius:8px;padding:20px 24px;">
                    <div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#F5C518;text-transform:uppercase;margin-bottom:16px;">Your Login Details</div>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:12px;color:#475569;padding-bottom:4px;">Portal URL</td>
                      </tr>
                      <tr>
                        <td style="font-size:14px;color:#93A3F8;font-family:monospace;padding-bottom:14px;">${portalUrl}</td>
                      </tr>
                      <tr>
                        <td style="font-size:12px;color:#475569;padding-bottom:4px;">Email</td>
                      </tr>
                      <tr>
                        <td style="font-size:14px;color:#ffffff;font-family:monospace;padding-bottom:14px;">${data.portalEmail}</td>
                      </tr>
                      <tr>
                        <td style="font-size:12px;color:#475569;padding-bottom:4px;">Temporary Password</td>
                      </tr>
                      <tr>
                        <td style="font-size:18px;color:#F5C518;font-family:monospace;font-weight:700;letter-spacing:2px;">${data.tempPassword}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a href="${loginUrl}" style="display:inline-block;background:#F5C518;color:#0D0F1E;text-decoration:none;font-size:13px;font-weight:800;letter-spacing:2px;text-transform:uppercase;padding:14px 40px;border-radius:4px;">
                      Access My Portal →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:13px;color:#475569;line-height:1.6;margin:0;">
                We recommend changing your password after first login. If you have any questions, reply to this email or message us directly through the portal.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#070915;border:1px solid rgba(255,255,255,0.05);border-top:none;padding:24px 40px;border-radius:0 0 4px 4px;">
              <p style="font-size:12px;color:#334155;margin:0;line-height:1.6;">
                UBS Ultimate Building Services &nbsp;·&nbsp; Las Vegas, NV<br />
                This email was sent because your account was approved. Do not share your password.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();

  const text = `
${greeting},

Your UBS Client Portal is ready!

PORTAL URL: ${portalUrl}
EMAIL: ${data.portalEmail}
TEMPORARY PASSWORD: ${data.tempPassword}

Log in at: ${loginUrl}

Inside your portal:
- Photo Timeline — Before & after photos from every service visit
- Job Updates — Real-time notes from our team on-site
- Messages — Direct line to your UBS account manager
- Documents — Estimates, invoices, and service records

We recommend changing your password after first login.

UBS Ultimate Building Services
Las Vegas, NV
  `.trim();

  // ── If no API key, log to console (dev / missing config) ──────────────────
  if (!resend) {
    console.log("📧 [email] RESEND_API_KEY not set — would have sent portal welcome:");
    console.log(`   To:       ${data.portalEmail}`);
    console.log(`   Password: ${data.tempPassword}`);
    console.log(`   Portal:   ${portalUrl}`);
    return { sent: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const result = await resend.emails.send({
      from:    FROM_EMAIL,
      to:      [data.portalEmail],
      subject: `Your UBS Client Portal is Ready — ${data.companyName ?? "Welcome"}`,
      html,
      text,
    });

    if (result.error) {
      console.error("[email] Resend error:", result.error);
      return { sent: false, error: String(result.error) };
    }

    console.log(`[email] Portal welcome sent to ${data.portalEmail} (id: ${result.data?.id})`);
    return { sent: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[email] sendPortalWelcomeEmail threw:", msg);
    return { sent: false, error: msg };
  }
}
