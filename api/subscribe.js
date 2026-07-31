const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Create reusable transporter object using standard SMTP transport
  // In a real application, you'd use process.env for these credentials
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email", // Using Ethereal for testing
    port: 587,
    secure: false, 
    auth: {
      user: "ethereal.user@ethereal.email", // Replace with real Ethereal or SMTP user
      pass: "ethereal_password", // Replace with real password
    },
  });

  try {
    // Send mail to the author (Notification)
    await transporter.sendMail({
      from: '"Website Newsletter" <no-reply@hopebeckett.com>', 
      to: "hope@hopebeckett.com", 
      subject: "New Newsletter Subscriber! 🎉",
      text: `A new reader has subscribed: ${email}`, 
      html: `<b>A new reader has subscribed:</b> ${email}`, 
    });

    // Send welcome mail to the subscriber
    await transporter.sendMail({
      from: '"Hope Beckett" <no-reply@hopebeckett.com>',
      to: email, 
      subject: "Welcome to my reading journey!",
      text: "Thank you for subscribing! Here is your free prequel novella...",
      html: "<b>Thank you for subscribing!</b><br>Here is your free prequel novella...", 
    });

    res.status(200).json({ message: 'Successfully subscribed!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending email' });
  }
}
