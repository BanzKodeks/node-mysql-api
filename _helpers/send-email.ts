import nodemailer from 'nodemailer';

export default async function sendEmail({ to, subject, html, from = process.env.EMAIL_FROM }: any) {

    console.log('Creating transporter...');

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    console.log('Sending email to:', to);

    const info = await transporter.sendMail({
        from,
        to,
        subject,
        html
    });

    console.log('Email sent:', info.messageId);
}