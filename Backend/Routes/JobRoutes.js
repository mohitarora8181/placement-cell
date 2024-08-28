
import express from "express"
const router = express.Router();
import Job from '../models/Job.model.js'
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

router.post('/jobs', async (req, res) => {
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
    const jobs = await Job.find(); 
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching job postings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 
