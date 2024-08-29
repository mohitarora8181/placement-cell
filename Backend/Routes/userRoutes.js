import { Router } from 'express';
import {authUser, signup} from '../controller/user.controller.js'
import express from 'express';
import User from '../models/SignupModel.js';
import Job from '../models/Job.model.js'
import protect from '../middlewares/authMiddleware.js';




const router = express.Router();

router.route('/sign-up').post(signup);
router.post('/sign-in',authUser)
router.get('/profile/:userId',protect, async (req, res) => {
  try {
      const user = await User.findById(req.params.userId)
          .populate('appliedJobs', 'jobTitle companyName location type imageURL ctc')
          .select('username fullname email dob course degree resumeURL appliedJobs');

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
  } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
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
    console.log('Apply route hit');
    const { userId, jobId } = req.body;
  
    try {
      const user = await User.findById(userId);
      const job = await Job.findById(jobId);
  
      if (!user || !job) {
        return res.status(404).json({ message: 'User or Job not found' });
      }
  
      
      if (user.appliedJobs.includes(jobId)) {
        return res.status(400).json({ message: 'You have already applied for this job.' });
      }
  
      
      if (job.applicants.includes(userId)) {
        return res.status(400).json({ message: 'You have already applied for this job.' });
      }
  
      
      user.appliedJobs.push(jobId);
      await user.save();
  
   
      job.applicants.push(userId);
      await job.save();
  
      res.status(200).json({ message: 'Job applied successfully!' });
    } catch (error) {
      console.error('Error applying for job:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/find', async (req, res) => {
    try {
      const users = await User.find().select('username fullname email course'); // Select fields you want to include in the response
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  });

  router.get('/:userId',protect, async (req, res) => {
    try {
      const user = await User.findById(req.params.userId)
        .populate('appliedJobs', 'jobTitle companyName location type imageURL ctc jobDescription') // Adjust fields as necessary
        .select('fullname email dob course degree appliedJobs'); // Adjust fields as necessary
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  });
  


export default router;
