import React, { useEffect, useState } from 'react'
import downloadjs from 'downloadjs';
import html2canvas from 'html2canvas';
import { Button, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

const StudnetCoordinators = () => {

  const [CardTitle, setCardTitle] = useState('Placement Coordinator - ID Card');
  const [InstituteName, setInstituteName] = useState('Maharaja Surajmal Institute of technology');
  const [InstituteLogo, setInstituteLogo] = useState('https://msit.in/static/img/msit.png');
  const [InstituteAddress, setInstituteAddress] = useState('C-4 , Janakpuri, New Delhi-110058 , Tel : 011-45037193');

  const [name, setName] = useState('');
  const [stImg, setStImg] = useState('https://cdn-icons-png.flaticon.com/512/201/201818.png');
  const [dob, setDob] = useState('');
  const [course, setCourse] = useState('');
  const [branch, setBranch] = useState('');
  const [mob, setMob] = useState('');
  const [email, setEmail] = useState('');

  const [errors, setErrors] = useState({ name: false, stImg: false, dob: false, course: false, branch: false, mob: false, email: false });

  const handleDownload = async () => {
    if (name.length == 0) {
      setErrors(prev => ({ ...prev, name: true }));
      return;
    }
    if (mob.length < 10) {
      setErrors(prev => ({ ...prev, mob: true }));
      return;
    }
    document.body.style.lineHeight = 0.5;
    const canvas = await html2canvas(document.getElementById('idcard'), { allowTaint: true, useCORS: true });
    downloadjs(canvas.toDataURL('image/png'), `${name}-PC-IDCard`, 'image/png');
    document.body.style.lineHeight = 1;
  }

  const releaseError = (key) => { setErrors(prev => ({ ...prev, [key]: false })); }

  // const handleDriveImage = async (e) => {
  //   const fullLink = e.target.value;
  //   const id = fullLink.slice(fullLink.indexOf('/d/') + 3, fullLink.indexOf('/view'));
  //   setStImg(`https://drive.google.com/thumbnail?id=${id}`)
  // }

  return (
    <div className='h-full w-full'>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <div className='w-full h-[85vh] items-center flex gap-5 p-10 justify-center align-middle'>
          <div className='w-[700px] h-[500px] overflow-y-auto flex flex-col gap-3 py-5'>
            {/* {data.map(({ name, mob }) => */}
            <IDCard name={name} stImg={stImg} dob={dob} course={course} branch={branch} mob={mob} email={email} />
            {/* )} */}
          </div>
          <div className='w-1/2 flex flex-col gap-5 p-10'>
            <div className='w-full flex gap-5'>
              <TextField error={errors.name} onFocus={() => releaseError('name')} fullWidth onChange={(e) => setName(e.target.value)} label='Name' />
              <DatePicker onFocus={() => releaseError('dob')} sx={{ width: '100%' }} onChange={(e) => setDob(new Date(e).toLocaleDateString())} label='Date of Birth' />
            </div>
            <div className='w-full flex gap-5'>
              <TextField error={errors.course} onFocus={() => releaseError('course')} fullWidth onChange={(e) => setCourse(e.target.value)} label='Course' />
              <TextField error={errors.branch} onFocus={() => releaseError('branch')} fullWidth onChange={(e) => setBranch(e.target.value)} label='Branch' />
            </div>
            <div className='w-full flex gap-5'>
              <TextField error={errors.mob} onFocus={() => releaseError('mob')} type='tel' fullWidth onChange={(e) => setMob(e.target.value)} label='Mobile Number' />
              <TextField error={errors.email} onFocus={() => releaseError('email')} type='email' fullWidth onChange={(e) => setEmail(e.target.value)} label='Email' />
            </div>
            <div className='w-full flex gap-5'>
              <TextField type='tel' fullWidth onChange={(e) => setStImg(e.target.value)} label='Student Photo ( Public Embeded Link )' />
            </div>
            <div className='w-full flex justify-center self-end'>
              <Button sx={{ width: '150px' }} variant='contained' onClick={handleDownload}>Download</Button>
            </div>
          </div>
        </div>
      </LocalizationProvider>
    </div>

  )
}


const IDCard = ({ name, stImg, dob, course, branch, mob, email }) => {
  return <div id='idcard' className='w-[600px] h-[400px] select-none outline outline-1 rounded-sm self-center px-10 py-5 flex flex-col gap-5'>
    <p className='w-full text-center whitespace-nowrap text-xl font-semibold py-2 bg-gray-200 leading-5'>Placement Coordinator - ID Card</p>
    <div className='flex gap-5 w-full border-b border-b-red-500 p-2'>
      <img className='w-24 h-24 rounded-full' src='https://assets.collegedunia.com/public/college_data/images/logos/1515217934msit.png' />
      <span className='w-full flex flex-col justify-center'>
        <p className='w-full text-center whitespace-nowrap text-lg font-semibold'>Maharaja Surajmal Institute of technology</p>
        <p className='w-full text-center whitespace-nowrap text-lg font-semibold'>( Affilated to GGSIPU )</p>
        <p className='w-full text-center whitespace-nowrap text-sm font-medium text-gray-600'>C-4 , Janakpuri, New Delhi-110058 , Tel : 011-45037193</p>
      </span>
    </div>
    <div className='flex gap-8 w-full h-full px-2'>
      <div className='w-1/4 h-full content-center flex flex-col gap-10'>
        <img className='w-24 h-24 rounded-md border overflow-hidden' src={stImg} />
        <span className='w-full flex gap-3 border-b'>
          <p className='w-full text-center whitespace-nowrap text-xs font-normal text-gray-500'>Student's Signature</p>
        </span>
      </div>
      <div className='w-full h-full flex flex-col gap-3'>
        <span className='w-full flex justify-center gap-5'>
          <span className='w-1/2 flex gap-3 border-b border-dashed'>
            <p className='w-fit text-left whitespace-nowrap text-sm font-normal text-gray-500'>Name : </p>
            <p className='w-full text-left whitespace-nowrap text-md font-normal text-black'>{name}</p>
          </span>
          <span className='w-1/2 flex gap-3 border-b border-dashed'>
            <p className='w-fit text-left whitespace-nowrap text-sm font-normal text-gray-500'>Date of Birth : </p>
            <p className='w-full text-left whitespace-nowrap text-md font-normal text-black'>{dob}</p>
          </span>
        </span>
        <span className='w-full flex justify-center gap-5'>
          <span className='w-1/2 flex gap-3 border-b border-dashed'>
            <p className='w-fit text-left whitespace-nowrap text-sm font-normal text-gray-500'>Course : </p>
            <p className='w-full text-left whitespace-nowrap text-md font-normal text-black'>{course}</p>
          </span>
          <span className='w-1/2 flex gap-3 border-b border-dashed'>
            <p className='w-fit text-left whitespace-nowrap text-sm font-normal text-gray-500'>Branch : </p>
            <p className='w-full text-left whitespace-nowrap text-md font-normal text-black'>{branch}</p>
          </span>
        </span>
        <span className='w-full flex gap-3 border-b border-dashed'>
          <p className='w-fit text-left whitespace-nowrap text-sm font-normal text-gray-500'>Mobile Number : </p>
          <p className='w-full text-left whitespace-nowrap text-md font-normal text-black'>{mob}</p>
        </span>
        <span className='w-full flex gap-3 border-b border-dashed'>
          <p className='w-fit text-left whitespace-nowrap text-sm font-normal text-gray-500'>Email : </p>
          <p className='w-full text-left whitespace-nowrap text-md font-normal text-black'>{email}</p>
        </span>
      </div>
    </div>
  </div>
}

export default StudnetCoordinators
