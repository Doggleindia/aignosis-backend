import nodemailer from 'nodemailer';
// In-memory storage (optional, for demonstration purposes)
const contactSubmissions = [];
import dotenv from 'dotenv';

dotenv.config();
const { EMAIL_USER, EMAIL_PASS } = process.env;
// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // or use another email service like Outlook, Yahoo, etc.
    auth: {
        user: EMAIL_USER, // Replace with your email
        pass: EMAIL_PASS  // Replace with your email app password (if using Gmail)
    }
});

// POST route to handle contact form submission and send email
export const contactus = async (req, res) => {
    const { name, phone, age, message,city } = req.body;

    // Validation
    if (!name || !phone || !age || !message || !city) {
        return res.status(400).json({ error: 'All fields are required: name, phone, age, message.' });
    }

    if (typeof age !== 'number' || age <= 0) {
        return res.status(400).json({ error: 'Age must be a positive number.' });
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        return res.status(400).json({ error: 'Phone number must be a valid 10-digit number.' });
    }

    // Save the submission (optional)
    const submission = { id: contactSubmissions.length + 1, name, phone, age,city, message, submittedAt: new Date() };
    contactSubmissions.push(submission);

    // Compose email
    const mailOptions = {
        from: 'your-email@gmail.com', // Sender address
        to: 'recipient-email@gmail.com', // Recipient email (e.g., admin)
        subject: 'New Contact Form Submission',
        text: `You have received a new contact form submission:\n\nName: ${name}\nPhone: ${phone}\nAge: ${age}\nCity: ${city}\nMessage: ${message}`
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);

        res.status(201).json({
            message: 'Contact form submitted successfully and email sent!',
            submission
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email. Please try again later.' });
    }
};

