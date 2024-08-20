import { Router } from 'express';
import {authUser, signup} from '../controller/user.controller.js'
import express from 'express';
import User from '../models/SignupModel.js';
import Job from '../models/Job.model.js'




const router = express.Router();

router.route('/sign-up').post(signup);
router.post('/sign-in',authUser)
router.get('/profile/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      
      
      const user = await User.findById(userId)
        .select('username fullname email dob course degree'); 
  
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      
      res.json(user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  router.post('/update-resume/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { resumeURL } = req.body;
    if (!resumeURL || !/^https?:\/\/.+/.test(resumeURL)) {
      return res.status(400).json({ message: 'Invalid URL provided.' });
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(userId, { resumeURL: resumeURL }, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found.' });
      }

      res.json({ message: 'Resume URL updated successfully!', user: updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Failed to update user with resume URL.' });
    }
  });

 

 router.post('/apply', async (req, res) => {
  const { userId, jobId } = req.body;

  try {
    await User.findByIdAndUpdate(userId, { $addToSet: { appliedJobs: jobId } });

    await Job.findByIdAndUpdate(jobId, { $addToSet: { applicants: userId } });

    res.status(200).json({ message: 'Application successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error applying for job', error });
  }
});


export default router;
