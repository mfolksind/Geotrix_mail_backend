import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// function getWelcomeEmailTemplate(recipientName = 'Valued Guest') {
//   return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <style>
//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//         }
//         body {
//           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//           background-color: #f5f5f5;
//           color: #333;
//         }
//         .container {
//           max-width: 600px;
//           margin: 20px auto;
//           background-color: #ffffff;
//           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//           border-radius: 8px;
//           overflow: hidden;
//         }
//         .header {
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           padding: 40px 20px;
//           text-align: center;
//         }
//         .logo {
//           max-width: 150px;
//           height: auto;
//           margin-bottom: 20px;
//         }
//         .header h1 {
//           color: #ffffff;
//           font-size: 28px;
//           margin-top: 10px;
//         }
//         .content {
//           padding: 40px 30px;
//         }
//         .greeting {
//           font-size: 18px;
//           color: #333;
//           margin-bottom: 20px;
//           font-weight: 500;
//         }
//         .message {
//           font-size: 16px;
//           line-height: 1.8;
//           color: #555;
//           margin-bottom: 20px;
//         }
//         .highlight {
//           color: #667eea;
//           font-weight: 600;
//         }
//         .divider {
//           height: 2px;
//           background: linear-gradient(to right, #667eea, #764ba2);
//           margin: 30px 0;
//         }
//         .cta-box {
//           background-color: #f9f9f9;
//           border-left: 4px solid #667eea;
//           padding: 20px;
//           margin: 20px 0;
//           border-radius: 4px;
//         }
//         .cta-box p {
//           font-size: 16px;
//           color: #333;
//           font-weight: 500;
//           margin-bottom: 10px;
//         }
//         .team-message {
//           font-size: 15px;
//           color: #666;
//           line-height: 1.6;
//         }
//         .footer {
//           background-color: #f5f5f5;
//           padding: 30px;
//           text-align: center;
//           border-top: 1px solid #e0e0e0;
//         }
//         .footer p {
//           font-size: 14px;
//           color: #888;
//           margin-bottom: 10px;
//         }
//         .social-links {
//           margin-top: 15px;
//         }
//         .social-links a {
//           color: #667eea;
//           text-decoration: none;
//           margin: 0 10px;
//           font-size: 14px;
//         }
//         .company-name {
//           font-weight: 600;
//           color: #667eea;
//         }
//         .signature {
//           margin-top: 20px;
//           font-size: 14px;
//           color: #666;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <!-- Header -->
//         <div class="header">
//           <img src="cid:logo" alt="Company Logo" class="logo">
//           <h1>Welcome!</h1>
//         </div>

//         <!-- Content -->
//         <div class="content">
//           <p class="greeting">Hello <span class="highlight">${recipientName}</span>,</p>
          
//           <p class="message">
//             Thank you so much for reaching out and connecting with us! We truly appreciate your interest in our company and the opportunity to work with you.
//           </p>

//           <p class="message">
//             We are committed to providing exceptional service and support to all our valued clients. Your inquiry is important to us, and we're excited about the possibility of collaborating together.
//           </p>

//           <div class="cta-box">
//             <p>📞 What happens next?</p>
//             <p class="team-message">
//               Our dedicated team is reviewing your inquiry and will contact you very soon with more information. We aim to respond within <span class="highlight">24-48 hours</span> during business days.
//             </p>
//           </div>

//           <p class="message">
//             If you have any urgent questions or additional information you'd like to share, please feel free to reply to this email or contact us directly.
//           </p>

//           <div class="divider"></div>

//           <p class="message">
//             Thank you for being part of our growing community. We look forward to connecting with you!
//           </p>

//           <p class="signature">
//             Best regards,<br>
//             <span class="company-name">The Team</span><br>
//             Thermox
//           </p>
//         </div>

//         <!-- Footer -->
//         <div class="footer">
//           <p>&copy; 2026 Thermox. All rights reserved.</p>
//           <p>We respect your privacy and will never share your information.</p>
//           <div class="social-links">
//             <a href="ww.mfolks.com">Website</a> | 
//             <a href="#">Twitter</a> | 
//             <a href="#">LinkedIn</a>
//           </div>
//         </div>
//       </div>
//     </body>
//     </html>
//   `;
// }

export async function sendEmail(req, res) {
  try {
    const { to, subject, text, html, recipientName, useTemplate } = req.body;

    if (!to || !subject) {
      return res.status(400).json({
        error: 'Missing required fields. Provide to and subject.',
      });
    }

    let emailHtml = html;
    let attachments = [];

    // Use professional template if requested or no HTML provided
    if (useTemplate || !html) {
      emailHtml = getWelcomeEmailTemplate(recipientName || 'Valued Guest');
      const logoPath = path.join(__dirname, '../assests/image.png');
      attachments.push({
        filename: 'logo.png',
        path: logoPath,
        cid: 'logo',
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject: subject || 'Welcome to Thermox',
      text: text || 'Thank you for connecting with us!',
      html: emailHtml,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    return res.json({
      message: 'Email sent successfully',
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({
      error: 'Failed to send email',
      details: error.message,
    });
  }
}
