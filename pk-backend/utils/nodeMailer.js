import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email mein logo ka URL PUBLIC hona chahiye (localhost email client mein nahi khulta).
// .env mein LOGO_URL=https://www.pkjewels.world/pk-logo.png jaisa set karo.
const LOGO_URL = process.env.LOGO_URL || "https://www.pkjewels.world/pk-logo.png";
const SITE_URL = process.env.SITE_URL || "https://www.pkjewels.world";

// OTP kitne minute valid hai -- yeh apne backend ki expiry se match karo.
const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES) || 1;
const expiryText = `${OTP_EXPIRY_MINUTES} minute${OTP_EXPIRY_MINUTES > 1 ? "s" : ""}`;

const MAROON = "#5a0209";
const GOLD = "#d4a64a";

const buildOtpHtml = (otp, { label, heading, message, ignoreNote }) => {
  const digitCells = String(otp)
    .split("")
    .map(
      (d) => `
        <td style="padding:0 4px;">
          <div style="width:44px;height:54px;line-height:54px;text-align:center;font-size:26px;font-weight:700;color:${MAROON};background:#fffaf0;border:2px solid ${GOLD};border-radius:10px;font-family:Arial,Helvetica,sans-serif;">
            ${d}
          </div>
        </td>`,
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#fbf6ea;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fbf6ea;padding:30px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid #e8d9b5;border-radius:18px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">

            <!-- Header -->
            <tr>
              <td align="center" style="background:${MAROON};padding:32px 20px 26px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="background:#ffffff;border:3px solid ${GOLD};border-radius:50%;width:78px;height:78px;">
                      <img src="${LOGO_URL}" alt="PK Jewels" width="58" height="58" style="display:block;margin:0 auto;object-fit:contain;" />
                    </td>
                  </tr>
                </table>
                <h1 style="margin:18px 0 4px;font-size:22px;letter-spacing:1px;color:#ffffff;font-weight:600;">PK Jewels</h1>
                <p style="margin:0;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:${GOLD};">${label}</p>
              </td>
            </tr>

            <!-- Gold line -->
            <tr>
              <td style="height:3px;background:linear-gradient(90deg,#f0cf85,${GOLD},#f0cf85);font-size:0;line-height:0;">&nbsp;</td>
            </tr>

            <!-- Body -->
            <tr>
              <td align="center" style="padding:30px 28px 10px;">
                <h2 style="margin:0 0 10px;font-size:20px;color:${MAROON};">${heading}</h2>
                <p style="margin:0;font-size:14px;line-height:22px;color:#5b4a42;">
                  ${message}
                </p>
              </td>
            </tr>

            <!-- OTP -->
            <tr>
              <td align="center" style="padding:22px 20px 8px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>${digitCells}</tr>
                </table>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:14px 28px 6px;">
                <p style="margin:0;font-size:13px;color:#8a1c1c;font-weight:600;">
                  This code is valid for ${expiryText}.
                </p>
              </td>
            </tr>

            <!-- Security note -->
            <tr>
              <td style="padding:20px 28px 28px;">
                <div style="background:#fff8e6;border:1px solid #f0dfae;border-radius:10px;padding:14px 16px;">
                  <p style="margin:0;font-size:12.5px;line-height:20px;color:#5b4a42;">
                    <strong style="color:${MAROON};">Security tip:</strong>
                    Please do not share this OTP with anyone. PK Jewels will never ask for your OTP by phone or message.
                    ${ignoreNote}
                  </p>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background:${MAROON};padding:20px;">
                <p style="margin:0 0 6px;font-size:13px;color:#ffffff;">
                  PK Jewels &ndash; a collection of your favourite jewellery designs.
                </p>
                <a href="${SITE_URL}" style="font-size:12px;color:${GOLD};text-decoration:none;">${SITE_URL.replace(/^https?:\/\//, "")}</a>
              </td>
            </tr>

          </table>

          <p style="margin:14px 0 0;font-size:11px;color:#a09080;font-family:Arial,Helvetica,sans-serif;">
            This is an automated email. Please do not reply.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

// Dono functions yahi common sender use karte hain
const sendMail = async ({ email, subject, text, html }) => {
  try {
    await transporter.sendMail({
      from: `"PK Jewels" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      text, // plain-text fallback
      html,
    });
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

// 1) Signup / email verification OTP
const sendOTPEmail = async (email, otp) =>
  sendMail({
    email,
    subject: "Email Verification - PK Jewels",
    text: `Your PK Jewels verification OTP is ${otp}. It is valid for ${expiryText}. Please do not share this OTP with anyone.`,
    html: buildOtpHtml(otp, {
      label: "Email Verification",
      heading: "Verify your email address",
      message:
        "Thank you for choosing PK Jewels. Use the verification code below to complete your registration.",
      ignoreNote:
        "If you did not request this code, you can safely ignore this email.",
    }),
  });

// 2) Forgot password OTP
const sendOTPForForgetEmail = async (email, otp) =>
  sendMail({
    email,
    subject: "Reset Your Password - PK Jewels",
    text: `Your PK Jewels password reset OTP is ${otp}. It is valid for ${expiryText}. Please do not share this OTP with anyone.`,
    html: buildOtpHtml(otp, {
      label: "Password Reset",
      heading: "Reset your password",
      message:
        "We received a request to reset your PK Jewels account password. Use the code below to continue.",
      ignoreNote:
        "If you did not request a password reset, you can safely ignore this email &ndash; your password will remain unchanged.",
    }),
  });

export { sendOTPEmail, sendOTPForForgetEmail };
