import React, { useEffect, useState } from 'react'
import AdminNav from '../components/AdminNav'
import downloadjs from 'downloadjs';
import html2canvas from 'html2canvas';
import { Button, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import axios from 'axios';

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
    const canvas = await html2canvas(document.getElementById('idcard'), { allowTaint: true, useCORS: true });
    downloadjs(canvas.toDataURL('image/png'), 'StudentName-PC-IDCard', 'image/png');
  }

  useEffect(() => {
    document.body.style.lineHeight = 0.5;
  }, []);

  // const handleDriveImage = async (e) => {
  //   const fullLink = e.target.value;
  //   const id = fullLink.slice(fullLink.indexOf('/d/') + 3, fullLink.indexOf('/view'));
  //   setStImg(`https://drive.google.com/thumbnail?id=${id}`)
  // }

  return (
    <div className='h-full w-full'>
      <AdminNav />
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <div className='w-full h-[85vh] items-center flex gap-5 p-10 justify-center align-middle'>
          <div id='idcard' className='w-[600px] h-[400px] outline outline-1 rounded-sm self-center px-10 py-5 flex flex-col gap-5'>
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
          <div className='w-1/2 flex flex-col gap-5 p-10'>
            <div className='w-full flex gap-5'>
              <TextField fullWidth onChange={(e) => setName(e.target.value)} label='Name' />
              <DatePicker sx={{ width: '100%' }} onChange={(e) => setDob(new Date(e).toLocaleDateString())} label='Date of Birth' />
            </div>
            <div className='w-full flex gap-5'>
              <TextField fullWidth onChange={(e) => setCourse(e.target.value)} label='Course' />
              <TextField fullWidth onChange={(e) => setBranch(e.target.value)} label='Branch' />
            </div>
            <div className='w-full flex gap-5'>
              <TextField type='tel' fullWidth onChange={(e) => setMob(e.target.value)} label='Mobile Number' />
              <TextField type='email' fullWidth onChange={(e) => setEmail(e.target.value)} label='Email' />
            </div>
            <div className='w-full flex gap-5'>
              <TextField type='tel' fullWidth onChange={(e)=>setStImg(e.target.value)} label='Student Photo ( Public Embeded Link )' />
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

export default StudnetCoordinators
