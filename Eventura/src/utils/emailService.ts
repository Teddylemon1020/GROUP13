import nodemailer from "nodemailer";

// Create reusable transporter
const createTransporter = () => {
  // For development/testing, you can use services like:
  // - Gmail (requires app-specific password)
  // - Ethereal Email (for testing only)
  // - SendGrid, AWS SES, etc. for production

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

interface SendInvitationEmailParams {
  to: string;
  projectName: string;
  inviterName: string;
  inviteLink: string;
  expiresInDays: number;
}

export const sendInvitationEmail = async ({
  to,
  projectName,
  inviterName,
  inviteLink,
  expiresInDays,
}: SendInvitationEmailParams) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Eventura" <${process.env.SMTP_USER}>`,
    to,
    subject: `You're invited to join "${projectName}" on Eventura`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 30px; background-color: black; color: black; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Project Invitation</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p><strong>${inviterName}</strong> has invited you to join the project <strong>"${projectName}"</strong> on Eventura.</p>
              <p>Click the button below to accept the invitation and start collaborating:</p>
              <div style="text-align: center;">
                <a href="${inviteLink}" class="button">Accept Invitation</a>
              </div>
              <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #4f46e5;">${inviteLink}</p>
              <p style="margin-top: 30px; color: #ef4444; font-size: 14px;">
                This invitation will expire in ${expiresInDays} days.
              </p>
            </div>
            <div class="footer">
              <p>If you didn't expect this invitation, you can safely ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      You're invited to join "${projectName}"

      ${inviterName} has invited you to join the project "${projectName}" on Eventura.

      Click this link to accept the invitation:
      ${inviteLink}

      This invitation will expire in ${expiresInDays} days.

      If you didn't expect this invitation, you can safely ignore this email.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};
