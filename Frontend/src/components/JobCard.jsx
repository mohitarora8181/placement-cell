import React, { useState, useContext, useEffect } from 'react'


const JobCard = ({ job }) => {
  const firebase = useContext(FirebaseContext)
  const [url, setURL] = useState('')
  const getURL = async () => {
    const link = await firebase.getURL(job.imageURL)
    setURL(link);

  }
  useEffect(() => {
    getURL();
  }, [])

  return (
    <div className='p-4 bg-white shadow-md rounded-lg w-72 h-auto m-2'>
       {job.imageURL && (
        <img src={url} alt={job.jobTitle} className=' rounded-lg h-48 w-64' />
      )}
      <h3 className='text-xl font-semibold mb-2'>{job.jobTitle}</h3>
      <p className='text-gray-600 mb-2'>{job.companyName}</p>
      <p className='mb-4'>{job.jobDescription}</p>

      <p className='text-gray-500'>CTC: {job.ctc} lacs</p>
      <button className='bg-blue-500 hover:bg-blue-700 font-bold rounded-sm mt-2 px-4 py-2 text-white '>Apply Now</button>
    </div>
  )
}

export default JobCard
