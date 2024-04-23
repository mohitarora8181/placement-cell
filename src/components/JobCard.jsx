import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../context/Firebase';

const JobCard = ({ job }) => {
  const firebase = useContext(FirebaseContext);
  const [url,setURL] = useState('');
  useEffect(()=>{
    const getURL = async()=>{
      const link = await firebase.getURL(job.imageURL);
      setURL(url);
      console.log(url);
    }


  })

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-xl font-semibold mb-2">{job.jobTitle}</h3>
      <p className="text-gray-600 mb-2">{job.companyName}</p>
      <p className="mb-4">{job.jobDescription}</p>
      {job.jobImage && (
        <img
          src={url}
          alt={job.jobTitle}
          className="w-full rounded-lg"
        />
      )}
      <p className="text-gray-500">CTC: {job.ctc}</p>
    </div>
  );
};

export default JobCard;
