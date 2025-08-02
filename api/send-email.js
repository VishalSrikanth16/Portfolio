// This is the updated serverless function for your contact form.
// It uses ES module syntax (import) to be compatible with Vercel's environment.

import nodemailer from 'nodemailer'; // Use 'import' instead of 'require'
import { createTransport } from 'nodemailer'; // Also use 'import' for the function

// This is the main handler for the Vercel serverless function.
// It will be triggered by a POST request to the /api/send-email endpoint.
export default async (req, res) => {
  // Use a try/catch block for robust error handling
  try {
    // Extract the form data from the request body.
    const { name, email, message } = req.body;

    // Create a Nodemailer transporter object.
    // This uses your email credentials from Vercel's environment variables.
    const transporter = createTransport({
      host: 'smtp.gmail.com', // Your email provider's SMTP host
      port: 465, // Standard port for secure SMTP
      secure: true, // Use SSL/TLS
      auth: {
        // Use the environment variables you configured in Vercel
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Define the email content.
    const mailOptions = {
      from: `"${name}" <${email}>`, // Sender's name and email
      to: process.env.EMAIL_USER, // Your email address to receive the message
      subject: `New Contact Form Submission from ${name}`, // Email subject
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`, // Plain text body
    };

    // Send the email and wait for it to finish.
    await transporter.sendMail(mailOptions);

    // Send a success response back to the client.
    res.status(200).json({ success: true, message: 'Email sent successfully!' });

  } catch (error) {
    // If there's an error, log it and send an error response.
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email.', error: error.message });
  }
};