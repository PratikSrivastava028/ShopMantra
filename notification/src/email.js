const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

let isMock = false;

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error.message || error);
        console.log('Falling back to local Mock Email Transporter...');
        isMock = true;
        transporter = nodemailer.createTransport({
            jsonTransport: true
        });
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"ShopMantra" <${process.env.EMAIL_USER || 'no-reply@shopmantra.ai'}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });

        if (isMock) {
            console.log(`[Mock Email] Email sent successfully to ${to}`);
            console.log(`  Subject: ${subject}`);
            
            try {
                const mailDir = path.join(__dirname, '..', 'sent_emails');
                if (!fs.existsSync(mailDir)) {
                    fs.mkdirSync(mailDir, { recursive: true });
                }
                const filename = `email_${Date.now()}_${to.replace(/[@.]/g, '_')}.html`;
                const filePath = path.join(mailDir, filename);
                fs.writeFileSync(filePath, html);
                console.log(`  Preview HTML locally at: file:///${filePath.replace(/\\/g, '/')}`);
            } catch (fsErr) {
                console.error('  Failed to save email preview locally:', fsErr.message);
            }
        } else {
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendEmail };