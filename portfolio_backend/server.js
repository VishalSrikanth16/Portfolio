const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config(); 
const app = express();
const port = process.env.PORT || 3001; 

app.use(cors());
app.use(express.json());
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,    
    pass: process.env.EMAIL_PASS,    
  },
});
app.post('/api/send-email', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const mailOptions = {
    from: process.env.EMAIL_USER, 
    to: process.env.EMAIL_USER,   
    subject: `New Message from Portfolio Website: ${name}`,
    html: `
      <p>You have received a new message from your portfolio contact form.</p>
      <h3>Contact Details:</h3>
      <ul>
        <li>Name: ${name}</li>
        <li>Email: ${email}</li>
      </ul>
      <h3>Message:</h3>
      <p>${message}</p>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});