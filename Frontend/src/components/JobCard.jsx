import React from 'react';

const JobCard = ({ job }) => {
  return (
    <div className='p-4 bg-white shadow-md rounded-lg w-80 h-auto m-4'>
      {job.imageURL && (
        <img src={job.imageURL} alt={job.jobTitle} className='rounded-lg h-44 w-full' />
      )}
      <h3 className='text-xl font-semibold mb-2'>{job.jobTitle}</h3>
      <p className='text-gray-600 mb-2'>{job.companyName}</p>
      <p className='mb-4'>{job.jobDescription}</p>
      <p className='text-gray-500'>CTC: {job.ctc} lacs</p>
      <button className='bg-blue-500 hover:bg-blue-700 font-bold rounded-sm mt-2 px-4 py-2 text-white'>
        Apply Now
      </button>
    </div>
  );
};

export default JobCard;
