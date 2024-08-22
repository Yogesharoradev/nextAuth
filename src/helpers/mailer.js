import User from '@/models/userModel';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const verificationEmailHTML = (verifyToken) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <h2 style="color: #333;">Verify Your Email Address</h2>
    <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
    <a href="${process.env.DOMAIN}/verifyemail?token=${verifyToken}" 
       style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">
       Verify Email
    </a>
    <p>If the button above doesn’t work, please copy and paste the following link into your web browser:</p>
    <p><a href="${process.env.DOMAIN}/verifyemail?token=${verifyToken}" style="color: #007bff;">${process.env.DOMAIN}/verifyemail?token=${verifyToken}</a></p>
    <p>If you did not create an account with us, please ignore this email.</p>
    <p>Thank you,<br>Your Website Team</p>
  </div>
`;

const resetPasswordEmailHTML = (resetToken) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <h2 style="color: #333;">Reset Your Password</h2>
    <p>We received a request to reset your password. Click the button below to reset it:</p>
    <a href="${process.env.DOMAIN}/resetpassword?token=${resetToken}" 
       style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #fff; background-color: #dc3545; text-decoration: none; border-radius: 5px;">
       Reset Password
    </a>
    <p>If the button above doesn’t work, please copy and paste the following link into your web browser:</p>
    <p><a href="${process.env.DOMAIN}/resetpassword?token=${resetToken}" style="color: #dc3545;">${process.env.DOMAIN}/resetpassword?token=${resetToken}</a></p>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>Thank you,<br>Your Website Team</p>
  </div>
`;

export const sendEmail = async ({ email, emailType, userId }) => {
  try {
    // Generate token
    const token = emailType === 'VERIFY' ? jwt.sign({ userId }, process.env.TOKEN_SECRET, { expiresIn: '1h' }) : jwt.sign({ userId }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
    
    // Update user record with token
    if (emailType === 'VERIFY') {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: token,
          verifyTokenExpiry: Date.now() + 3600000, // 1 hour
        },
      });
    } else if (emailType === 'RESET') {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: token,
          forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour
        },
      });
    }

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Set up email options
    const mailOptions = {
      from: 'yogesh@gmail.com',
      to: email,
      subject: emailType === 'VERIFY' ? 'Verify Your Email' : 'Reset Your Password',
      html: emailType === 'RESET' ? resetPasswordEmailHTML(token) : verificationEmailHTML(token),
    };

    // Send email
    const mailResponse = await transporter.sendMail(mailOptions);
    
    return mailResponse;

  } catch (err) {
    console.error('Error sending email:', err.message);
    throw new Error(err.message);
  }
};
