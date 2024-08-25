import React, { useState, useContext } from 'react';
import AdminNav from '../components/AdminNav';
import AdminSidebar from '../components/AdminSidebar';
import AdminStudents from '../components/AdminStudents';


const AdminPage = () => {
  const [display, setDisplay] = useState('student');

  const getDisplayValue = (data)=>{
    setDisplay(data);
  }

 return(
  <>
  <AdminNav/>
  <div className='flex flex-row h-screen '>
    <AdminSidebar onData={getDisplayValue}/>
    { display==='student' &&
      <AdminStudents />

    }


  </div>
  </>
 )
};

export default AdminPage;
