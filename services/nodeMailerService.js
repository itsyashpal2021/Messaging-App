//Node mailer package for sending otp to mail.
const nodemailer = require("nodemailer");

const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_NODEMAILER_PASSWORD,
    },
  });
  return transporter;
};

const sendOtp = async (email, transporter) => {
  const otp = 1000 + Math.floor(Math.random() * 9000);
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Otp for Resetting Password.",
    html: `<p>Your OTP for resetting password is <b>${otp}</b>.</p>`,
  };

  await transporter.sendMail(mailOptions);
  return otp;
};

module.exports = {
  createTransporter: createTransporter,
  sendOtpToMail: sendOtp,
};
