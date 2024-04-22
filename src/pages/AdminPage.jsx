import React, { useState } from 'react';

const AdminPage = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const handleJobTitleChange = (e) => {
    setJobTitle(e.target.value);
  };

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here, e.g., sending data to backend
    console.log('Job Title:', jobTitle);
    console.log('Job Description:', jobDescription);
    // Reset form fields after submission
    setJobTitle('');
    setJobDescription('');
  };

  return (
    <div className="mx-auto max-w-lg p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Post New Job</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={jobTitle}
            onChange={handleJobTitleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <textarea
            id="jobDescription"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full h-32"
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Post Job
        </button>
      </form>
    </div>
  );
};

export default AdminPage;
