import { useEffect, useState } from "react";
import { PiStudentBold } from "react-icons/pi";
import { CgOrganisation } from "react-icons/cg";
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
      <nav className="h-full w-[20%] bg-[#099934] text-white font-semibold pt-4 text-md shadow-lg mr-4">
        <ul className="flex flex-col p-4">
          <li className="cursor-pointer mb-2" onClick={setToStudent}>
            <span className="flex justify-between pb-2 items-center">Students <PiStudentBold className="text-3xl" /></span>
            <hr/>
          </li>
          <li className="cursor-pointer mb-2" onClick={setToCompany}>
          <span className="flex justify-between pb-2 items-center">Companies <CgOrganisation className="text-3xl" /></span>

            <hr></hr>
          </li>
        </ul>
      </nav>
    </>
  )
}
export default AdminSidebar;
