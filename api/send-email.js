import nodemailer from 'nodemailer'; 
import { createTransport } from 'nodemailer'; 

export default async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const transporter = createTransport({
      host: 'smtp.gmail.com', 
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`, 
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${name}`, 
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`, 
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email.', error: error.message });
  }
};

