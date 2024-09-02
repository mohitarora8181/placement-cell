import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from './JobCard';

const JobPostings = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        const response = await axios.get('/api/jobs');
        setJobPostings(response.data);
      } catch (error) {
        console.error('Error fetching job postings:', error);
        setError('Failed to load job postings. Please try again later.');
      } finally {
        setLoading(false); // Stop loading once data is fetched or an error occurs
      }
    };

    fetchJobPostings();
  }, []);

  return (
    <div className="max-w-[95%]  px-4 py-8 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4 text-center">Job Postings</h2>
      {loading ? (
        <p>Loading job postings...</p> // Display a loading message while fetching data
      ) : error ? (
        <p>{error}</p> // Display an error message if fetching fails
      ) : jobPostings.length === 0 ? (
        <p>No job postings available.</p> // Handle case when no jobs are available
      ) : (
        <div className="flex flex-row flex-wrap justify-start">
          {jobPostings.map((job) => (
            <JobCard key={job._id} job={job} /> // Use job._id as key
          ))}
        </div>
      )}
    </div>
  );
};

export default JobPostings;
