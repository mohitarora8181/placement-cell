import { useEffect, useState } from "react";

const AdminSidebar = ({onData})=>{
  const [currentVal, setCurrentVal] = useState('student');

  const setToCompany = ()=>{
    setCurrentVal('company');
  }
  const setToStudent = ()=>{
    setCurrentVal('student');
  }



  useEffect(()=>{
    onData(currentVal); 
  },[currentVal]);

  return(
    <>
      <nav className="h-full w-[30%] bg-[#099934] text-white font-semibold pt-4 text-md">
        <ul className="flex flex-col p-4">
          <li className="cursor-pointer " onClick={setToStudent}>Students
            <hr/>
          </li>
          <li className="cursor-pointer " onClick={setToCompany}>Companies
            <hr></hr>
          </li>
        </ul>
      </nav>
    </>
  )
}
export default AdminSidebar;
