// services/emailService.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvoiceEmail(recipientEmail: string, invoiceImage: string, invoiceNumber: string) {
    const { data, error } = await resend.emails.send({
        from: 'Nexus Works <invoices@nexusworks.com>',
        to: [recipientEmail],
        subject: `Your Invoice #${invoiceNumber} from Nexus Works`,
        html: getEmailTemplate(invoiceNumber),
        attachments: [
            {
                filename: `invoice-${invoiceNumber}.png`,
                content: invoiceImage,
            },
        ],
    });

    if (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }

    return data;
}

function getEmailTemplate(invoiceNumber: string) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice from Nexus Works</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background-color: #4a90e2;
                color: white;
                padding: 20px;
                text-align: center;
            }
            .content {
                background-color: #f9f9f9;
                border: 1px solid #ddd;
                padding: 20px;
                margin-top: 20px;
            }
            .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 0.8em;
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Invoice from Nexus Works</h1>
        </div>
        <div class="content">
            <h2>Dear Valued Customer,</h2>
            <p>Thank you for choosing Nexus Works. We hope you're satisfied with our services.</p>
            <p>Please find attached your invoice #${invoiceNumber}.</p>
            <p>If you have any questions or concerns regarding this invoice, please don't hesitate to contact our support team.</p>
            <p>We appreciate your business and look forward to serving you in the future.</p>
            <p>Best regards,<br>The Nexus Works Team</p>
        </div>
        <div class="footer">
            <p>© 2023 Nexus Works. All rights reserved.</p>
            <p>123 Business Street, Tech City, TC 12345</p>
        </div>
    </body>
    </html>
    `;
}