const { Resend } = require('resend');

let resend = null;
const getResend = () => {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
};

const sendVerificationEmail = async (to, code) => {
  try {
    const client = getResend();
    if (!client) {
      console.error('❌ Cannot send email: RESEND_API_KEY is missing');
      return false;
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    console.log(`📧 Sending OTP to ${to} from ${fromEmail}...`);

    const { data, error } = await client.emails.send({
      from: `BiralStore <${fromEmail}>`,
      to: [to],
      subject: `${code} — BiralStore təsdiq kodu`,
      html: `
        <div style="font-family: 'Inter', 'Segoe UI', sans-serif; background-color: #f0fdf4; padding: 40px 20px; min-height: 100vh;">
          <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
            
            <!-- Header with Blue background from the logo -->
            <div style="background-color: #2196F3; padding: 30px 20px; text-align: center;">
              <!-- Make sure the logo URL is valid once uploaded -->
              <img src="https://biral.store/logo-circle.png" alt="1Al Store" style="max-height: 50px; margin: 0 auto;" />
            </div>

            <div style="padding: 40px 32px; text-align: center;">
              <h2 style="color: #0f172a; font-size: 22px; margin: 0 0 10px; font-weight: 700;">Xoş Gəlmisiniz! 👋</h2>
              <p style="color: #64748b; font-size: 15px; margin: 0 0 30px; line-height: 1.5;">Hesabınızı təsdiqləmək üçün aşağıdakı təsdiq kodundan istifadə edin:</p>
              
              <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 16px; padding: 24px; margin: 0 auto; max-width: 250px;">
                <span style="font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #3b82f6;">${code}</span>
              </div>
              
              <p style="color: #94a3b8; font-size: 14px; margin-top: 24px;">Bu kod <strong style="color: #475569;">10 dəqiqə</strong> ərzində keçərlidir.</p>
            </div>

            <div style="background: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #f1f5f9;">
              <p style="color: #64748b; font-size: 14px; margin: 0 0 16px;">Bizi sosial şəbəkələrdə izləyin:</p>
              <a href="https://instagram.com/biral.store" style="display: inline-flex; align-items: center; text-decoration: none; color: #e1306c; font-weight: 600; font-size: 15px;">
                📸 @biral.store
              </a>
              <p style="color: #cbd5e1; font-size: 12px; margin-top: 24px; margin-bottom: 0;">
                Əgər siz bu kodu tələb etməmisinizsə, lütfən bu mesajı nəzərə almayın.
              </p>
            </div>

          </div>
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

