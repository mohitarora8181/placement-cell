import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';
import jobData from '../jobdata/job.json'; 

const JobPostings = () => {
  const [jobPostings, setJobPostings] = useState([]);

  useEffect(() => {
    setJobPostings(jobData);
  }, []);

  return (
    <div className="max-w-[80%] mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Job Postings</h2>
      {jobPostings.length === 0 ? (
        <p>No job postings available.</p>
      ) : (
        <div className="flex flex-row flex-wrap justify-center">
          {jobPostings.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobPostings;
