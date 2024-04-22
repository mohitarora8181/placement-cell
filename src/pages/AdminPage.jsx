import React, { useState } from 'react';
import { useContext } from 'react';
import { FirebaseContext } from '../context/Firebase';

const AdminPage = () => {
  const firebase = useContext(FirebaseContext);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobImage, setJobImage] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [ctc, setCTC] = useState('');

  const handleJobTitleChange = (e) => {
    setJobTitle(e.target.value);
  };

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setJobImage(file);
  };

  const handleCompanyNameChange = (e) => {
    setCompanyName(e.target.value);
  };

  const handleCTCChange = (e) => {
    setCTC(e.target.value);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    await firebase.postJob(jobTitle, companyName, ctc, jobDescription, jobImage);

    // // Ensure required fields are not empty
    // if (!jobTitle || !jobDescription || !companyName || !ctc) {
    //   alert('Please enter job title, company name, CTC, and description');
    //   return;
    // }

    // // Prepare FormData to include job data and image file
    // const formData = new FormData();
    // formData.append('jobTitle', jobTitle);
    // formData.append('jobDescription', jobDescription);
    // formData.append('companyName', companyName);
    // formData.append('ctc', ctc);
    // if (jobImage) {
    //   formData.append('jobImage', jobImage);
    // }

    // // Send formData to backend for processing (e.g., posting job with image)
    // console.log('Form data:', formData);

    // // Reset form fields after submission
    setJobTitle('');
    setJobDescription('');
    setJobImage(null);
    setCompanyName('');
    setCTC('');
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
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={companyName}
            onChange={handleCompanyNameChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="ctc" className="block text-sm font-medium text-gray-700">
            CTC (Cost to Company)
          </label>
          <input
            type="text"
            id="ctc"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={ctc}
            onChange={handleCTCChange}
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
        <div className="mb-4">
          <label htmlFor="jobImage" className="block text-sm font-medium text-gray-700">
            Job Image
          </label>
          <input
            type="file"
            id="jobImage"
            accept="image/*"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            onChange={handleImageChange}
          />
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
