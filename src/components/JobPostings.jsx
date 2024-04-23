import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../context/Firebase';
import JobCard from './JobCard';


const JobPostings = () => {
  const firebase = useContext(FirebaseContext);
  const [jobPostings, setJobPostings] = useState([]);

  const fetchJobPostings = async () => {
    const jobs= firebase.listAllJobs().then((docs) => setJobPostings(docs.docs));
    console.log(jobPostings?.[0]?.data());
    console.log(jobPostings);


    // setJobPostings(jobs);
  };

  // Fetch job postings when the component mounts
  useEffect(() => {
    fetchJobPostings();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Job Postings</h2>
      {jobPostings.length === 0 ? (
        <p>No job postings available.</p>
      ) : (
        <div className="grid gap-4">
          {jobPostings.map((job) => (
            <JobCard job={job.data()}/>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobPostings;
