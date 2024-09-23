import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EditJob = () => {
  const { jobId } = useParams();
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [ctc, setCtc] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [applyURL, setApplyURL] = useState('');

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`/api/jobs/${jobId}`);
        const jobData = response.data.job; // Adjust if necessary
        setJobTitle(jobData.jobTitle || '');
        setCompanyName(jobData.companyName || '');
        setLocation(jobData.location || '');
        setType(jobData.type || '');
        setJobDescription(jobData.jobDescription || '');
        setCtc(jobData.ctc || '');
        setImageURL(jobData.imageURL || '');
        setApplyURL(jobData.applyURL || '');
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation to check for empty fields
    if (!jobTitle || !companyName || !location || !type || !jobDescription || !ctc || !imageURL || !applyURL) {
      alert('Please fill in all fields before submitting the form.');
      return;
    }

    try {
      const updatedJob = {
        jobTitle,
        companyName,
        location,
        type,
        jobDescription,
        ctc,
        imageURL,
        applyURL,
      };

      await axios.put(`/api/jobs/${jobId}`, updatedJob);
      alert('Job updated successfully!');
      window.location.href = '/admin'; // Redirect back to admin page
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  return (
    <div className='w-full max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg'>
      <h2 className='text-2xl font-semibold text-gray-800 text-center mb-6'>
        Edit Job
      </h2>
      <div className='bg-purple-500 p-8 rounded-lg shadow-md'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-black font-medium mb-2'>Job Title:</label>
            <input
              type='text'
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
              className='w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label className='block text-black font-medium mb-2'>Company Name:</label>
            <input
              type='text'
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className='w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label className='block text-black font-medium mb-2'>Location:</label>
            <input
              type='text'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className='w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label className='block text-black font-medium mb-2'>Type:</label>
            <input
              type='text'
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className='w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label className='block text-black font-medium mb-2'>Job Description:</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
              className='w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical min-h-[100px]'
            />
          </div>
          <div>
            <label className='block text-black font-medium mb-2'>CTC:</label>
            <input
              type='number'
              value={ctc}
              onChange={(e) => setCtc(e.target.value)}
              required
              className='w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label className='block text-black font-medium mb-2'>Image URL:</label>
            <input
              type='text'
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              required
              className='w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label className='block text-black font-medium mb-2'>Apply URL:</label>
            <input
              type='text'
              value={applyURL}
              onChange={(e) => setApplyURL(e.target.value)}
              required
              className='w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <button
            type='submit'
            className='w-full py-3 bg-black text-white font-semibold rounded-md shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            Update Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditJob;
