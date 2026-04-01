const { Resend } = require('resend');

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error('⚠️ RESEND_API_KEY is not set! Email verification will not work.');
}
const resend = new Resend(apiKey);

const sendVerificationEmail = async (to, code) => {
  try {
    if (!apiKey) {
      console.error('❌ Cannot send email: RESEND_API_KEY is missing');
      return false;
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    console.log(`📧 Sending OTP to ${to} from ${fromEmail}...`);

    const { data, error } = await resend.emails.send({
      from: `BiralStore <${fromEmail}>`,
      to: [to],
      subject: `${code} — BiralStore təsdiq kodu`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #1e293b; font-size: 24px; margin: 0;">🛍️ BiralStore</h1>
            <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Praktik Məhsullar Mağazası</p>
          </div>
          <div style="background: white; border-radius: 12px; padding: 32px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <p style="color: #475569; font-size: 15px; margin: 0 0 20px;">Təsdiq kodunuz:</p>
            <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; margin: 0 auto; max-width: 200px;">
              <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #0f172a;">${code}</span>
            </div>
            <p style="color: #94a3b8; font-size: 13px; margin-top: 20px;">Bu kod <strong>10 dəqiqə</strong> ərzində keçərlidir.</p>
          </div>
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
            Əgər siz bu kodu tələb etməmisinizsə, bu mesajı nəzərə almayın.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Resend API error:', JSON.stringify(error));
      return false;
    }

    console.log(`✅ OTP sent to ${to}, id: ${data?.id}`);
    return true;
  } catch (error) {
    console.error('❌ Email send exception:', error.message || error);
    return false;
  }
};

module.exports = { sendVerificationEmail };

