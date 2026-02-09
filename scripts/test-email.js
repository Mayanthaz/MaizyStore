const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../.env' });

async function checkEmailConfig() {
    console.log('📧 Testing Email Configuration...');

    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
        console.error('❌ Missing configuration!');
        console.log('---------------------------------------------------');
        console.log('Please open your .env file and set:');
        console.log('EMAIL_USER=your_gmail@gmail.com');
        console.log('EMAIL_PASS=your_app_password');
        console.log('---------------------------------------------------');
        console.log('To get an App Password:');
        console.log('1. Go to Google Account > Security');
        console.log('2. Enable 2-Step Verification');
        console.log('3. Search "App Passwords"');
        console.log('4. Create one for "Mail" and use it here.');
        process.exit(1);
    }

    console.log(`Using account: ${user}`);

    const transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: { user, pass },
        tls: { rejectUnauthorized: false }
    });

    try {
        await transporter.verify();
        console.log('✅ Connection Successful! Credentials are correct.');

        // Try sending a test email
        console.log('Attempting to send test email to yourself...');
        await transporter.sendMail({
            from: user,
            to: user,
            subject: '✅ MAIZY STORE - Test Email',
            text: 'If you are reading this, your email configuration is working perfectly! 🚀'
        });
        console.log('✅ Test email sent to ' + user);
        console.log('You can now restart your server to apply changes.');

    } catch (error) {
        console.error('❌ Connection Failed:', error.message);
        if (error.code === 'EAUTH') {
            console.log('💡 Tip: Make sure you are NOT using your login password.');
            console.log('You MUST use a Gmail App Password.');
        }
    }
}

checkEmailConfig();
