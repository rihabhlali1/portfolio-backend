const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory counters
let views = 0;
let messages = [];

// Increment portfolio view
app.post('/api/view', (req, res) => {
  views += 1;
  res.json({ views });
});

// Send contact message
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  messages.push({ name, email, message, date: new Date() });

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'rihabhleli9@gmail.com',
      pass: 'qrmg sbgr vhlk giuh' // Use Gmail App password
    }
  });

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <rihabhleli9@gmail.com>`,
      to: 'rihabhleli9@gmail.com',
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    });

    res.json({ success: true, message: 'Message sent!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Get stats
app.get('/api/stats', (req, res) => {
  res.json({ views, messagesCount: messages.length });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
