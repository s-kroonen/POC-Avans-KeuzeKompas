const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

function sendMail({ to, subject, html }, callback) {
  const mailOptions = {
    from: `"Sakila Admin" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html
  };

  transporter.sendMail(mailOptions, callback);
}

module.exports = { sendMail };
