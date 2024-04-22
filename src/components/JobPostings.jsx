import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Use Axios for making HTTP requests

const JobPostings = () => {
  const [jobPostings, setJobPostings] = useState([]);

  // Function to fetch job postings from the backend
  const fetchJobPostings = async () => {
    try {
      const response = await axios.get('/api/job-postings'); // Replace with actual API endpoint
      setJobPostings(response.data); // Assuming the response data is an array of job postings
    } catch (error) {
      console.error('Error fetching job postings:', error);
    }
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
            <div
              key={job.id}
              className="p-4 bg-white shadow-md rounded-lg"
            >
              <h3 className="text-xl font-semibold mb-2">{job.jobTitle}</h3>
              <p className="text-gray-600 mb-2">{job.companyName}</p>
              <p className="mb-4">{job.jobDescription}</p>
              {job.jobImage && (
                <img
                  src={job.jobImage}
                  alt={job.jobTitle}
                  className="w-full rounded-lg"
                />
              )}
              <p className="text-gray-500">CTC: {job.ctc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobPostings;
