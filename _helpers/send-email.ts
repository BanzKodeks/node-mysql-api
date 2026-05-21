import nodemailer from 'nodemailer';

// ✅ Create transporter ONCE at module level, not per call
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465, // ✅ auto-set based on port
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    connectionTimeout: 30000,  // ✅ increased from 10s → 30s for Render
    greetingTimeout: 30000,
    socketTimeout: 30000,
    pool: true,                // ✅ reuse connections
    maxConnections: 3
});

// ✅ Verify connection on startup — check Render logs for SMTP errors
transporter.verify((error) => {
    if (error) {
        console.error('❌ SMTP connection failed:', error.message);
    } else {
        console.log('✅ SMTP server ready');
    }
});

export default async function sendEmail({ 
    to, 
    subject, 
    html, 
    from = process.env.EMAIL_FROM 
}: {
    to: string;
    subject: string;
    html: string;
    from?: string;
}) {
    try {
        const info = await transporter.sendMail({ from, to, subject, html });
        console.log('✅ Email sent:', info.messageId);
        return info;
    } catch (error: any) {
        // ✅ Log the real error so you can debug on Render
        console.error('❌ Email send failed:', error.message);
        throw new Error(`Email delivery failed: ${error.message}`);
    }
}