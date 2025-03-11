import Flyers from "../model/Flyersubmissionmodel.js"; // Import model

// Handle form submission
export const submitForm = async (req, res) => {
    try {
        const { name, phone } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Save to DB
        const newSubmission = new Flyers({ name, phone });
        await newSubmission.save();

        res.status(201).json({ success: true, message: "Form submitted successfully!" });
    } catch (error) {
        console.error("Form Submission Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
