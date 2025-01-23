import Career from '../model/carreerModel.js'; 

// Create a new career record
export const createCareer = async (req, res) => {
  try {
    const { name,mobile, email,role, experience, location,message} = req.body;

    const fileURL = req.file ? req.file.path : ''; // Get the file path of the uploaded resume
    console.log(req.body)
    console.log(fileURL)

    const career = new Career({
      name,
      mobile,
      email,
      role,
      experience,
      location,
      message,
      fileURL,
    });

    await career.save();
    if (!res.headersSent) {
        res.status(201).json({ message: 'Career record created successfully', career });
      }
    // res.status(201).json({ message: 'Career record created successfully', career });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all career records
export const getCareers = async (req, res) => {
  try {
    const careers = await Career.find();
    res.status(200).json(careers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific career record by ID
export const getCareerById = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return res.status(404).json({ message: 'Career record not found' });
    }

    res.status(200).json(career);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a career record by ID
export const updateCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return res.status(404).json({ message: 'Career record not found' });
    }

    const { name,mobile,email,role, experience, location, message } = req.body;
    const fileURL = req.file ? req.file.path : career.fileURL; // If a new file is uploaded, use it, else keep the old one

    career.name = name || career.name;
    career.mobile = mobile || career.mobile;
    career.email = email || career.email;
    career.role = role || career.role;
    career.experience = experience || career.experience;
    career.location = location || career.location;
    career.message = message || career.message;

    career.fileURL = fileURL;

    await career.save();
    
    res.status(200).json({ message: 'Career record updated successfully', career });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a career record by ID
export const deleteCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);

    if (!career) {
      return res.status(404).json({ message: 'Career record not found' });
    }

    res.status(200).json({ message: 'Career record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
