import React, { useState, useContext } from 'react';
import AdminNav from '../components/AdminNav';
import AdminSidebar from '../components/AdminSidebar';
import AdminStudents from '../components/AdminStudents';
import AdminCompanies from '../components/AdminCompanies';


const AdminPage = () => {
  const [display, setDisplay] = useState('student');

  const getDisplayValue = (data)=>{
    setDisplay(data);
  }

 return(
  <>
  <AdminNav/>
  <div className='flex flex-row  '>
    <AdminSidebar onData={getDisplayValue}/>
    { display==='student' ?
      <AdminStudents />
      : <AdminCompanies/>

    }


  </div>
  </>
 )
};

export default AdminPage;
