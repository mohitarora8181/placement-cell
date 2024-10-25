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
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`/api/jobs/${jobId}`);
        const jobData = response.data.job;
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
      setShowPopup(true); // Show popup on success
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    window.location.href = '/admin'; // Redirect after closing popup
  };

  return (
    <div className="min-h-screen bg-white-500 flex justify-center items-center relative">
      <div className='w-full max-w-3xl mx-auto p-8 bg-purple-500 border-2 border-black rounded-lg shadow-lg'>

        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Edit Job</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-black font-medium mb-2">Job Title:</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
              className="input-field w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-black font-medium mb-2">Company Name:</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="input-field w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-black font-medium mb-2">Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="input-field w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-black font-medium mb-2">Type:</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="input-field w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-black font-medium mb-2">Job Description:</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
              className="input-field w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none resize-vertical min-h-[100px]"
            />
          </div>
          <div>
            <label className="block text-black font-medium mb-2">CTC:</label>
            <input
              type="number"
              value={ctc}
              onChange={(e) => setCtc(e.target.value)}
              required
              className="input-field w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-black font-medium mb-2">Image URL:</label>
            <input
              type="text"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              required
              className="input-field w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-black font-medium mb-2">Apply URL:</label>
            <input
              type="text"
              value={applyURL}
              onChange={(e) => setApplyURL(e.target.value)}
              required
              className="input-field w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-black text-white font-semibold rounded-md shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update Job
          </button>
        </form>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-4">Job Updated Successfully!</h3>
            <button
              onClick={handleClosePopup}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* CSS Styling */}
      <style jsx="true">{`
        .input-field {
          width: 100%;
          padding: 10px;
          border: 2px solid #000; /* Black border */
          border-radius: 8px;
          transition: all 0.3s ease;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          background-color: #fff;
          position: relative;
          z-index: 1;
        }

        .input-field:focus {
          transform: translateY(-20px) scale(1.05); /* Lift upwards */
          box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2); /* Deeper shadow */
          background-color: #f5e0ff; /* Bright purple background on focus */
          z-index: 2; /* Bring above the form */
          outline: none;
        }

        .resize-vertical {
          resize: vertical;
          min-height: 100px;
        }

        form {
          z-index: 1;
        }
      `}</style>
    </div>
  );
};

export default EditJob;
