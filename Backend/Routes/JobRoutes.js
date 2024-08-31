
import express from "express"
const router = express.Router();
import Job from '../models/Job.model.js'
import {protect} from "../middlewares/authMiddleware.js";
// const User = require('../models/User');
// const Job = require('../models/Job.model.js');


// router.post('/apply-job/:userId/:jobId', async (req, res) => {
//   const { userId, jobId } = req.params;
//   try {
//     const job = await Job.findById(jobId);
//     if (!job) return res.status(404).send('Job not found.');

//     if (!job.applicants.includes(userId)) {
//       job.applicants.push(userId);
//       await job.save();
//     }

    
//     const user = await User.findById(userId);
//     if (user && !user.appliedJobs.includes(jobId)) {
//       user.appliedJobs.push(jobId);
//       await user.save();
//     }

//     res.status(200).send('Application recorded successfully.');
//   } catch (error) {
//     console.error('Error applying for job:', error);
//     res.status(500).send('Server error.');
//   }
// });
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

router.post('/jobs', protect,async (req, res) => {
  try {
    const newJob = new Job(req.body); 
    await newJob.save(); 
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








export default router; 
