const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

// Generate verification code (6 digits)
const generateVerificationToken = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
const sendVerificationEmail = async (email, username, token) => {
    try {
        const transporter = createTransporter();

        const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

        // Professional HTML email template
        const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email - MAIZY STORE</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f7;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td align="center" style="padding: 40px 0;">
                        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); padding: 40px; text-align: center;">
                                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                                        MAIZY<span style="color: #FCD34D;">STORE</span>
                                    </h1>
                                    <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px;">Premium Digital Accounts</p>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 40px 30px 40px;">
                                    <h2 style="margin: 0 0 20px 0; color: #1F2937; font-size: 24px;">Welcome, ${username}!</h2>
                                    <p style="margin: 0 0 20px 0; color: #4B5563; font-size: 16px; line-height: 1.6;">
                                        Thank you for registering. Use the code below to verify your email address:
                                    </p>
                                    
                                    <!-- Verification Code -->
                                    <div style="margin: 30px 0; text-align: center;">
                                        <span style="display: inline-block; padding: 16px 40px; background-color: #F3F4F6; color: #1F2937; font-size: 32px; font-weight: bold; letter-spacing: 5px; border-radius: 8px; border: 2px dashed #D1D5DB;">
                                            ${token}
                                        </span>
                                    </div>

                                    <p style="margin: 0 0 30px 0; color: #4B5563; font-size: 16px; line-height: 1.6; text-align: center;">
                                        Or click the button below:
                                    </p>
                                    
                                    <!-- CTA Button -->
                                    <table role="presentation" style="margin: 0 auto;">
                                        <tr>
                                            <td style="border-radius: 6px; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);">
                                                <a href="${verificationLink}" style="display: inline-block; padding: 12px 30px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px;">
                                                    Verify Email Address
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <div style="margin: 30px 0 0 0; padding: 20px; background-color: #FEF3C7; border-left: 4px solid #F59E0B; border-radius: 4px;">
                                        <p style="margin: 0; color: #92400E; font-size: 14px; line-height: 1.6;">
                                            <strong>⏰ This code expires in 24 hours.</strong><br>
                                            If you didn't create an account, please ignore this email.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="padding: 30px 40px; background-color: #F9FAFB; text-align: center;">
                                    <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 14px;">
                                        Need help? Contact us at 
                                        <a href="mailto:support@maizystore.com" style="color: #8B5CF6; text-decoration: none;">support@maizystore.com</a>
                                    </p>
                                    <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                                        © 2026 MAIZY STORE. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `;

        const mailOptions = {
            from: {
                name: 'MAIZY STORE',
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: `✅ Your Verification Code: ${token} - MAIZY STORE`,
            html: htmlTemplate,
            text: `Welcome to MAIZY STORE, ${username}!\n\nYour verification code is: ${token}\n\nOr verify by visiting: ${verificationLink}\n\nThis code will expire in 24 hours.\n\nBest regards,\nMAIZY STORE Team`,
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'high',
                'X-Mailer': 'MAIZY STORE Mailer'
            }
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Verification email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email sending failed:', error);
        return { success: false, error: error.message };
    }
};

// Send welcome email after verification
const sendWelcomeEmail = async (email, username) => {
    try {
        const transporter = createTransporter();

        const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Welcome to MAIZY STORE</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f7;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td align="center" style="padding: 40px 0;">
                        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px;">
                            <tr>
                                <td style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px; text-align: center;">
                                    <h1 style="margin: 0; color: #ffffff; font-size: 32px;">🎉</h1>
                                    <h2 style="margin: 10px 0 0 0; color: #ffffff; font-size: 24px;">Email Verified!</h2>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 40px;">
                                    <h2 style="margin: 0 0 20px 0; color: #1F2937;">Welcome to MAIZY STORE, ${username}!</h2>
                                    <p style="margin: 0 0 20px 0; color: #4B5563; line-height: 1.6;">
                                        Your email has been successfully verified. You can now enjoy all the features of MAIZY STORE:
                                    </p>
                                    <ul style="color: #4B5563; line-height: 1.8;">
                                        <li>Browse premium digital accounts</li>
                                        <li>Instant delivery after purchase</li>
                                        <li>24/7 customer support</li>
                                        <li>Exclusive deals and offers</li>
                                    </ul>
                                    <table role="presentation" style="margin: 30px auto;">
                                        <tr>
                                            <td style="border-radius: 6px; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);">
                                                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: bold;">
                                                    Start Shopping
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 30px 40px; background-color: #F9FAFB; text-align: center;">
                                    <p style="margin: 0; color: #6B7280; font-size: 14px;">
                                        Thanks for choosing MAIZY STORE!
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `;

        const mailOptions = {
            from: {
                name: 'MAIZY STORE',
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: '🎉 Welcome to MAIZY STORE - Email Verified!',
            html: htmlTemplate,
            text: `Welcome to MAIZY STORE, ${username}!\n\nYour email has been successfully verified. Start shopping now at ${process.env.FRONTEND_URL || 'http://localhost:5173'}\n\nBest regards,\nMAIZY STORE Team`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Welcome email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Welcome email failed:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    generateVerificationToken,
    sendVerificationEmail,
    sendWelcomeEmail
};
