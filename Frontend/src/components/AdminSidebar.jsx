import { useEffect, useState } from "react";
import { PiStudentBold } from "react-icons/pi";
import { CgOrganisation } from "react-icons/cg";
import UserCard from "./UserCard";
import axios from "axios";
import JobData from "./JobData";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminSidebar = ({ onData }) => {

  const [currentVal, setCurrentVal] = useState(() => {
    const savedVal = localStorage.getItem('currentVal');
    return savedVal ? savedVal : 'student';
  });
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);

  const setToCompany = () => {
    setCurrentVal('company');
  };

  const setToStudent = () => {
    setCurrentVal('student');
  };

  useEffect(() => {
    // Save the currentVal to local storage whenever it changes
    localStorage.setItem('currentVal', currentVal);
    onData(currentVal);

    if (currentVal === 'student') {
      axios.get('https://placement-cell-iczn.onrender.com/api/users/find')
        .then(response => {
          setUsers(response.data);
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    }
    if (currentVal === 'company') {
      axios.get('https://placement-cell-iczn.onrender.com/api/jobs') // Fetch job data
        .then(response => {
          setJobs(response.data);
        })
        .catch(error => {
          console.error('Error fetching jobs:', error);
        });
    }
  }, [currentVal, onData]);

  return (
    <>
      <nav className="hidden md:flex flex-col  w-[20%] bg-[#099934] text-white font-semibold pt-4 text-md shadow-lg mr-4">
        <ul className="flex flex-col p-4">
          <li
            className={currentVal === 'student' ? "cursor-pointer mb-2 font-bold" : "cursor-pointer mb-2"}
            onClick={setToStudent}
          >
            <span className="flex justify-between pb-2 items-center">
              Students <PiStudentBold className="text-3xl" />
            </span>
            <hr />
          </li>
          <li
            className={currentVal === 'company' ? "cursor-pointer mb-2 font-bold" : "cursor-pointer mb-2"}
            onClick={setToCompany}
          >
            <span className="flex justify-between pb-2 items-center">
              Companies <CgOrganisation className="text-3xl" />
            </span>
            <hr />
          </li>
          <Link to='https://placement-cell-iczn.onrender.com/admin/post-job'>
            <li
              className="cursor-pointer mb-2"
              onClick={setToCompany}
            >
              <span className="flex justify-between pb-2 items-center">
                Post Jobs <FaPlus className="text-3xl" />
              </span>
              <hr />
            </li>
          </Link>
        </ul>
      </nav>
      <div className="flex flex-wrap">
        {currentVal === 'student' && users.map(user => (
          <UserCard key={user._id} user={user} />
        ))}
        {currentVal === 'company' && jobs.map(job => (
          <JobData key={job._id} job={job} />
        ))}
      </div>
    </>
  );
};

export default AdminSidebar;
