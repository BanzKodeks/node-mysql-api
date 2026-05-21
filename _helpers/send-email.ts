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
    if (!process.env.BREVO_API_KEY) {
        throw new Error('BREVO_API_KEY is not set');
    }

    if (!from) {
        throw new Error('EMAIL_FROM is not set');
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'api-key': process.env.BREVO_API_KEY,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            sender: {
                name: 'Node MySQL API',
                email: from
            },
            to: [
                {
                    email: to
                }
            ],
            subject,
            htmlContent: html
        })
    });

    const result = await response.json();

    if (!response.ok) {
        console.error('❌ Brevo email failed:', result);
        throw new Error(`Email delivery failed: ${result.message || response.statusText}`);
    }

    console.log('✅ Brevo email sent:', result);

    return result;
}