
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');


router.post('/apply-job/:userId/:jobId', async (req, res) => {
  const { userId, jobId } = req.params;
  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).send('Job not found.');

    if (!job.applicants.includes(userId)) {
      job.applicants.push(userId);
      await job.save();
    }

    
    const user = await User.findById(userId);
    if (user && !user.appliedJobs.includes(jobId)) {
      user.appliedJobs.push(jobId);
      await user.save();
    }

    res.status(200).send('Application recorded successfully.');
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).send('Server error.');
  }
});

module.exports = router;
