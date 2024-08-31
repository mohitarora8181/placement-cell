import express from 'express';
import mongoose from 'mongoose';
import User from '../models/SignupModel.js';

const router = express.Router();

router.get('/profile/:userId', async (req, res) => {
  try {
    const userId = req.params.userId.trim();
    console.log('Fetching user with ID:', userId);

   
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID format' });
    }

    
    const user = await User.findById(userId)
      //.select('username email nationality dob course degree resumeURL'); 
      .select('fullname email dob degree course twelfthPercentage diplomaPercentage nationality cgpa address school12th tenthPercentage gapYear yearOfPassing activeBacklogs contactNumber resumeURL');


    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User data:', user); 
    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





export default router;
