
import express from "express"
const router = express.Router();
import Job from '../models/Job.model.js'
import User from "../models/SignupModel.js";
import {protect} from "../middlewares/authMiddleware.js";
import Notification from "../models/NotificationModel.js";
// import { io } from "../index.js";


router.get('/jobs/:jobId', async (req, res) => {
  try {

    const job = await Job.findById(req.params.jobId)
      .populate({
        path: 'applicants', 
        select: 'fullname email course degree'
      });

    if (!job) {
      console.log(`Job with ID ${req.params.jobId} not found.`);
      return res.status(404).json({ message: 'Job not found' });
    }


    res.json({ job });
  } catch (error) {
    console.error('Error fetching job details:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});

router.post('/jobs',async (req, res) => {
  try {
    const newJob = new Job(req.body); 
    await newJob.save(); 
    const users = await User.find(); 
    users.forEach(async (user) => {
      await Notification.create({
        userId: user._id,
        jobId: newJob._id,
        message: `A new job "${newJob.jobTitle}" has been posted by ${newJob.companyName}.`,
      });
      if (user.isConnected) {
        io.to(user.socketId).emit('newJob', newJob);
      }
    });
   // io.emit('newJob', newJob);
    console.log('New job emitted:', newJob);
    res.status(201).json(newJob); 
  } catch (error) {
    console.error('Error adding job:', error);
    res.status(500).send('Server error.'); 
  }
});




router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching job postings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Notification route to fetch notifications for a user
router.get('/notifications/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).send('Server error.');
  }
});

// Route to mark notifications as read


router.delete('/notifications/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    await Notification.deleteMany({ userId });
    res.status(200).json({ message: 'Notifications cleared.' });
  } catch (error) {
    console.error('Error deleting notifications:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});









export default router; 
