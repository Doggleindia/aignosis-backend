import Flyers from "../model/Flyersubmissionmodel.js"; // Import model

// Handle form submission
export const submitForm = async (req, res) => {
    try {
        const { name, phone } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check if phone number already exists
        const existingSubmission = await Flyers.findOne({ phone });

        if (existingSubmission) {
            return res.status(400).json({ success: false, message: "You have already booked a demo!" });
        }

        // Save to DB
        const newSubmission = new Flyers({ name, phone });
        await newSubmission.save();

        res.status(201).json({ success: true, message: "Form submitted successfully!" });
    } catch (error) {
        console.error("Form Submission Error:", error);

        // Handle duplicate key error explicitly
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "You have already booked a demo!" });
        }

        res.status(500).json({ success: false, message: "Server Error" });
    }
};
