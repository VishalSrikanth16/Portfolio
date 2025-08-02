// A simple Node.js serverless function to handle email sending.
// This file should be placed in your project's 'api' directory.
// For example, './api/send-email.js'

// You will need to install nodemailer if you haven't already:
// npm install nodemailer

const nodemailer = require('nodemailer');

// Export an asynchronous function that Vercel will recognize as a serverless function.
module.exports = async (req, res) => {
  // Use try/catch for robust error handling.
  try {
    // Check for a POST request. The client-side should always send a POST request.
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Only POST requests are allowed.' });
    }

    // Access the environment variables. These are securely available on the server-side.
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    // Check if the environment variables are set.
    if (!emailUser || !emailPass) {
      return res.status(500).json({ message: 'Email credentials are not set in the environment variables.' });
    }

    // Create a Nodemailer transporter using the credentials from the environment.
    const transporter = nodemailer.createTransport({
      // We are using Gmail in this example. If you are using a different service,
      // you will need to adjust this configuration accordingly.
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // Get the email data (to, subject, text) from the request body.
    const { to, subject, text } = req.body;

    // Ensure the request body has the necessary data.
    if (!to || !subject || !text) {
      return res.status(400).json({ message: 'Missing required email fields: to, subject, or text.' });
    }

    // Configure the email message.
    const mailOptions = {
      from: emailUser,
      to,
      subject,
      text,
    };

    // Send the email using the transporter.
    await transporter.sendMail(mailOptions);

    // If the email is sent successfully, send a success response.
    res.status(200).json({ message: 'Email sent successfully!' });

  } catch (error) {
    // If any error occurs during the process, log it and send a generic error response.
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email.', error: error.message });
  }
};