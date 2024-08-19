import React, { useState, useEffect, useContext } from 'react';

import JobCard from './JobCard';


const JobPostings = () => {
  
  const [jobPostings, setJobPostings] = useState([]);

  const fetchJobPostings = async () => {
    
    // console.log(jobPostings?.[0]?.data());
    // console.log(jobPostings);


    // setJobPostings(jobs);
  };

  // Fetch job postings when the component mounts
  useEffect(() => {
    fetchJobPostings();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
   // <div className="max-w-[80%] mx-auto px-4 py-8 ">
   //   <h2 className="text-2xl font-bold mb-4  text-center">Job Postings</h2>
   //   {jobPostings.length === 0 ? (
   //     <p>No job postings available.</p>
   //   ) : (
   //     <div className="flex flex-row flex-wrap justify-center">
   //       {jobPostings.map((job) => (
   //         <JobCard key={job.id} job={job.data()}/>
   //       ))}
   //     </div>
   //   )}
   // </div>
   <div>
    hmm
   </div>
  );
};

export default JobPostings;
