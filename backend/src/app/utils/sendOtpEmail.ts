import status from 'http-status';
import nodemailer from 'nodemailer';
import config from '../config';
import AppError from './AppError';

const sendOtpEmail = async (email: string, otp: string, username: string) => {
  try {
    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.nodemailer.email,
        pass: config.nodemailer.password,
      },
    });

    // Email HTML template with dynamic placeholders
    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 2px solid #f0f0f0;
        }
        .header h2 {
          color: #4CAF50;
        }
        .otp {
          font-size: 24px;
          font-weight: bold;
          color: #4CAF50;
          padding: 12px;
          background-color: #f0f8ff;
          border-left: 4px solid #4CAF50;
          text-align: center;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #888888;
          padding-top: 20px;
          border-top: 2px solid #f0f0f0;
        }

        @media only screen and (max-width: 600px) {
          .container {
            padding: 15px;
          }
          .otp {
            font-size: 20px;
            padding: 10px;
          }
          .footer {
            font-size: 10px;
          }
          .header h2 {
            font-size: 22px;
          }
        }
      </style>
    </head>
    <body>

      <div class="container">
        <div class="header">
          <h2>Welcome to Jotter!</h2>
          <p>We're excited to help you manage your storage efficiently.</p>
        </div>

        <p>Hello ${username},</p>
        <p>We received a request to verify your email address. Your one-time password (OTP) is:</p>

        <div class="otp">
          ${otp}
        </div>

        <p>Please enter this OTP to complete your verification.</p>
        <p><strong>Note:</strong> The OTP will expire in 5 minutes. Please use it before the expiration time.</p>

        <div class="footer">
          <p>Thank you for choosing Jotter. If you did not request this, please ignore this email.</p>
        </div>
      </div>

    </body>
    </html>
  `;

    // Email options: from, to, subject, and HTML body
    const mailOptions = {
      from: config.nodemailer.email, // Sender's email address
      to: email, // Recipient's email address
      subject: 'Your OTP for Jotter Verification',
      html: htmlTemplate,
    };

    // Send the email using Nodemailer
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new AppError(status.INTERNAL_SERVER_ERROR, 'Failed to send email');
  }
};

export default sendOtpEmail;
