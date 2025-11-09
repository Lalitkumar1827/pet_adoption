const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const otpStore = {}; // Temporary in-memory store

// 📬 Contact Form Route
app.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).send('All fields are required');
  }

  const newEntry = { name, email, subject, message, timestamp: new Date().toISOString() };
  const filePath = path.join(__dirname, 'data', 'contacts.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    const contacts = err ? [] : JSON.parse(data);
    contacts.push(newEntry);
    fs.writeFile(filePath, JSON.stringify(contacts, null, 2), (err) => {
      if (err) return res.status(500).send('Error saving message');
      res.status(200).send('Message saved successfully!');
    });
  });
});

// // 📱 Send OTP
// app.post('/send-otp', (req, res) => {
//   const { phone } = req.body;
//   if (!phone) return res.status(400).send('Phone number is required');

//   const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
//   otpStore[phone] = otp;

//   console.log(`OTP for ${phone}: ${otp}`); // For testing
//   res.status(200).send('OTP sent successfully');
// });

// // ✅ Verify OTP
// app.post('/verify-otp', (req, res) => {
//   const { phone, otp } = req.body;
//   if (!phone || !otp) return res.status(400).send('Phone and OTP are required');

//   if (otpStore[phone] === otp) {
//     delete otpStore[phone]; // Clear OTP after success

//     const filePath = path.join(__dirname, 'data', 'users.json');
//     const newUser = { phone, timestamp: new Date().toISOString() };

//     fs.readFile(filePath, 'utf8', (err, data) => {
//       const users = err ? [] : JSON.parse(data);
//       users.push(newUser);
//       fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
//         if (err) return res.status(500).send('Error saving user');
//         res.status(200).send('Login successful!');
//       });
//     });
//   } else {
//     res.status(401).send('Invalid OTP');
//   }
// });

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});