
import express from "express"
const router = express.Router();
import Job from '../models/Job.model.js'
import User from "../models/SignupModel.js";
import {protect} from "../middlewares/authMiddleware.js";
import Notification from "../models/NotificationModel.js";
import { io } from "../index.js";



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

//router.post('/jobs',async (req, res) => {
//  try {
//    const newJob = new Job(req.body); 
//    await newJob.save(); 
//    const users = await User.find(); 
//    users.forEach(async (user) => {
//      await Notification.create({
//        userId: user._id,
//        jobId: newJob._id,
//        message: `A new job "${newJob.jobTitle}" has been posted by ${newJob.companyName}.`,
//      });
//      if (user.isConnected) {
//        io.to(user.socketId).emit('newJob', newJob);
//      }
//    });
//   // io.emit('newJob', newJob);
//    console.log('New job emitted:', newJob);
//    res.status(201).json(newJob); 
//  } catch (error) {
//    console.error('Error adding job:', error);
//    res.status(500).send('Server error.'); 
//  }
//});
let jobPostingInProgress = false;

router.post('/jobs', async (req, res) => {
  if (jobPostingInProgress) {
    return res.status(429).send('Job posting in progress. Try again later.');
  }

  // Set the lock to prevent concurrent job postings
  jobPostingInProgress = true;

  try {
    // Create and save the new job
   // const newJob = new Job(req.body);
   // await newJob.save();
   const { jobTitle, companyName, location, type, jobDescription, ctc, imageURL, applyURL, postedBy } = req.body;

    
    const newJob = new Job({
      jobTitle,
      companyName,
      location,
      type,
      jobDescription,
      ctc,
      imageURL,
      applyURL,
      postedBy,
    });

    await newJob.save();

    // Find all users
    const users = await User.find();

    // Notify each user about the new job and send real-time notifications if connected
    users.forEach(async (user) => {
      // Create a notification for each user
      await Notification.create({
        userId: user._id,
        jobId: newJob._id,
        message: `A new job "${newJob.jobTitle}" has been posted by ${newJob.companyName}.`,
      });

      // Send real-time notification if the user is connected via Socket.IO
      if (user.isConnected) {
        io.to(user.socketId).emit('newJob', newJob);
      }
    });

    // Emit the new job event globally (optional)
    // io.emit('newJob', newJob);

    console.log('New job emitted:', newJob);

    // Send a success response to the client
    res.status(201).json(newJob);
  } catch (error) {
    console.error('Error adding job:', error);
    res.status(500).send('Server error.');
  } finally {
    // Release the lock to allow future job postings
    jobPostingInProgress = false;
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

router.post('/notify', async (req, res) => {
  const { to, emails, message } = req.body;

  try {
    let users = [];
    if (to === 'all') {
      // Send to all users
      users = await User.find();
    } else if (to === 'specific' && emails) {
      // Send to specific users by email
      users = await User.find({ email: { $in: emails } });
    }

    // Create notifications for each user
    const notifications = users.map(async (user) => {
      const notification = await Notification.create({
        userId: user._id,
        message,
      });

      // Optionally, emit real-time notifications to connected users
      if (user.isConnected) {
        io.to(user.socketId).emit('newNotification', notification);
      }

      return notification;
    });

    // Wait for all notifications to be created
    await Promise.all(notifications);

    res.status(200).json({ message: 'Notifications sent successfully.' });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ message: 'Server error. Could not send notifications.' });
  }
});
router.get('/companies', async (req, res) => {
  const {
      companyName,
      jobTitle,
      location,
      type,
      ctc
  } = req.query;

  try {
      const filters = {};

      if (jobTitle) filters.jobTitle = new RegExp(jobTitle, 'i');
      if (location) filters.location = new RegExp(location, 'i');
      if (type) filters.type = new RegExp(type, 'i');

      if (ctc) {
          const [minCtc, maxCtc] = ctc.split(',').map(Number);
          if (isNaN(minCtc) || isNaN(maxCtc)) {
              return res.status(400).json({ message: 'Invalid CTC range' });
          }
          
          filters.ctc = { $gte: Math.max(minCtc, 0), $lte: Math.min(maxCtc, 100) };
      } else {
          filters.ctc = { $gte: 0, $lte: 100 }; // Default range if not provided
      }

      console.log('Applying filters:', filters);

      const companies = await Job.find(filters);
      res.json(companies);
  } catch (error) {
      console.error('Error fetching companies:', error); // Log detailed error
      res.status(500).json({ message: 'Error fetching companies', error: error.message });
  }
});



// Endpoint to save the shortlisted students for a job/company
router.post('/jobs/shortlist', async (req, res) => {
  const { companyName, shortlistedStudents } = req.body;

  try {
    // Find the job by company name, ignoring case
    const job = await Job.findOne({ companyName: { $regex: new RegExp(companyName, 'i') } });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Update the job with the shortlisted students
    job.shortlistedStudents = shortlistedStudents;
    await job.save();

    res.status(200).json({ message: 'Shortlisted students saved successfully' });
  } catch (error) {
    console.error('Error saving shortlist:', error);
    res.status(500).json({ message: 'Failed to save shortlisted students' });
  }
});



export default router; 
