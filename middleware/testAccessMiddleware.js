export const checkTestAccess = async (req, res, next) => {
    const userId = req.user.id;
  
    try {
      const user = await UserModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      if (user.testCount >= 3) {
        return res.status(403).json({ message: 'Maximum test attempts reached.' });
      }
  
      // Increment test count
      user.testCount += 1;
      await user.save();
  
      next(); // Proceed to the test route
    } catch (error) {
      res.status(500).json({ message: 'Error checking test access.', details: error.message });
    }
  };
  
  