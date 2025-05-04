import { Router } from 'express';
import { authUser, getUsers, signup } from '../controller/user.controller.js';
import express from 'express';
import User from '../models/SignupModel.js';
import Job from '../models/Job.model.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();



router.post('/sign-up', signup);
router.post('/sign-in', authUser);
router.get('/find',protect, getUsers);

router.get('/profile/:userId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('appliedJobs', 'jobTitle companyName location type imageURL ctc')
      //.select('username fullname email dob course degree resumeURL appliedJobs');
      .select('fullname email dob degree course twelfthPercentage classes enrollmentNumber diplomaPercentage nationality cgpa address school12th tenthPercentage gapYear yearOfPassing activeBacklogs contactNumber resumeURL linkedin github leetCode');

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



router.get('/:userId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('appliedJobs', 'jobTitle companyName location type imageURL ctc jobDescription')
      .select('fullname email dob course degree appliedJobs isAdmin');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});
router.get('/user-profile/:userId', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/update-profile/:id', protect, async (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;

  console.log(updatedData)

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true, allowNull: false });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});
export default router;
