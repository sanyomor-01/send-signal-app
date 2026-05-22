import nodemailer from 'nodemailer'

interface SendMailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendMailOptions) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SMTP environment variables are required in production')
    }
    console.log(`SMTP not configured; skipped email to ${to} with subject: ${subject}`)
    return
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT),
    secure: parseInt(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from: SMTP_FROM || '"Send Signal" <noreply@sendsignal.app>',
    to,
    subject,
    html,
  })
}

export function generatePasswordResetEmailHtml(resetLink: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; color: #333333;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h2 style="color: #ff5b04; margin: 0;">Send Signal</h2>
      </div>
      <div style="background-color: #f9fafb; padding: 32px; border-radius: 8px;">
        <h3 style="margin-top: 0; font-size: 20px;">Password Reset Request</h3>
        <p style="font-size: 16px; line-height: 1.5; color: #4b5563;">
          We received a request to reset your password. Click the button below to choose a new password:
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetLink}" style="background-color: #ff5b04; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">
          If you didn't request a password reset, you can safely ignore this email. This link will expire in 1 hour.
        </p>
      </div>
      <div style="text-align: center; margin-top: 32px; font-size: 12px; color: #9ca3af;">
        &copy; ${new Date().getFullYear()} Send Signal. All rights reserved.
      </div>
    </div>
  `
}
