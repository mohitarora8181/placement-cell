import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the toast styles
import './Button.css'; // Import custom styles

const ShortlistForm = () => {
  const [companyID, setCompanyID] = useState('');
  const [link, setLink] = useState('');
  const [students, setStudents] = useState([]);
  const [formStudent, setFormStudent] = useState({ name: '', email: '' });
  const [sendAsLink, setSendAsLink] = useState(true);
  const [companyNames, setCompanyNames] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/companies`);
        const companies = response.data;
        setCompanyNames(companies);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (companyID) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/jobs`);
          const jobs = response.data;
          const filteredJobs = jobs.filter(job => job._id === companyID);
          setJobDetails(filteredJobs);
          if (Array.isArray(filteredJobs[0].shortlistedStudents)) {
            setSendAsLink(false)
            setStudents(filteredJobs[0].shortlistedStudents)
          } else {
            setSendAsLink(true)
            setStudents(null)
          }
        } catch (error) {
          console.error('Error fetching job details:', error);
        }
      }
    };

    fetchJobDetails();
  }, [companyID]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyID) {
      toast.info('Please select a company.');
      return;
    }

    const payload = {
      companyID,
      shortlistedStudents: sendAsLink ? link : students,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/jobs/shortlist`, payload);
      if (response.status === 200) {
        toast.success('Shortlist saved successfully!');
        setCompanyID('');
        setLink('');
        setStudents([]);
        setSendAsLink(true);
      } else {
        toast.error('Failed to save shortlist');
      }
    } catch (error) {
      console.error('Error saving shortlist:', error);
      toast.error('Error saving shortlist');
    }
  };

  const addStudent = () => {
    if (formStudent.name && formStudent.email) {
      setStudents(prevStudents => [...prevStudents, formStudent]);
      setFormStudent({ name: '', email: '' });
    } else {
      toast.warn('Please fill out the form before adding.');
    }
  };

  const updateStudentForm = (field, value) => {
    setFormStudent(prev => ({ ...prev, [field]: value }));
  };

  const deleteStudent = (index) => {
    const updatedStudents = students.filter((_, i) => i !== index);
    setStudents(updatedStudents);
  };

  const handleToggleManualList = (value) => {
    setSendAsLink(value === 'link');
    if (value === 'list') {
      toast.info('Please enter name and email correctly!');
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-7xl mx-auto">
      <ToastContainer />
      <div className="bg-gray-100 shadow-lg rounded-lg flex-1 p-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Submit Shortlisted Students</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-2 text-gray-800">Company Name:</label>
            <select
              value={companyID}
              onChange={(e) => setCompanyID(e.target.value)}
              required
              className="w-full p-3 border rounded-md shadow-sm bg-gray-200 text-gray-800 focus:outline-none focus:ring focus:border-blue-300 transition"
            >
              <option value="" disabled>Select a company</option>
              {companyNames.map(({ companyName, _id, jobTitle }) => (
                <option key={_id} value={_id}>
                  {companyName} - {jobTitle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-800">Submit as:</label>
            <select
              value={sendAsLink ? 'link' : 'list'}
              onChange={(e) => handleToggleManualList(e.target.value)}
              className="w-full p-3 border rounded-md shadow-sm bg-gray-200 text-gray-800 focus:outline-none focus:ring focus:border-blue-300 transition"
            >
              <option value="link">Link</option>
              <option value="list">Manual List</option>
            </select>
          </div>

          {sendAsLink ? (
            <div>
              <label className="block font-semibold mb-2 text-gray-800">File Link:</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
                className="w-full p-3 border rounded-md shadow-sm bg-gray-200 text-gray-800 focus:outline-none focus:ring focus:border-blue-300 transition"
              />
            </div>
          ) : (
            <>
              <label className="block font-semibold mb-2 text-gray-800">Add Students Manually:</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block font-semibold mb-1 text-gray-800">Name:</label>
                  <input
                    type="text"
                    value={formStudent.name}
                    onChange={(e) => updateStudentForm('name', e.target.value)}
                    className="w-full p-3 border rounded-md shadow-sm bg-gray-200 text-gray-800 focus:outline-none focus:ring focus:border-blue-300 transition"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-800">Email:</label>
                  <input
                    type="email"
                    value={formStudent.email}
                    onChange={(e) => updateStudentForm('email', e.target.value)}
                    className="w-full p-3 border rounded-md shadow-sm bg-gray-200 text-gray-800 focus:outline-none focus:ring focus:border-blue-300 transition"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={addStudent}
                className={`w-full py-2 rounded-md transition-colors ${formStudent.name && formStudent.email ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                disabled={!formStudent.name || !formStudent.email}
              >
                Add Student
              </button>
            </>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              className="submit-button"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      <div className="bg-gray-100 shadow-lg rounded-lg flex-1 p-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Job Details</h2>
        {jobDetails ? (
          jobDetails.map((job) => (
            <div key={job._id} className="bg-gray-200 p-4 mb-4 shadow-md rounded-md">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{job.jobTitle}</h3>
              <p className="mb-1 text-gray-700"><strong>Company:</strong> {job.companyName}</p>
              <p className="mb-1 text-gray-700"><strong>Location:</strong> {job.location}</p>
              <p className="mb-1 text-gray-700"><strong>Type:</strong> {job.type}</p>
              <p className="mb-1 text-gray-700"><strong>CTC:</strong> {job.ctc} lacs</p>
              <p className="mb-1 text-gray-700"><strong>Description:</strong> {job.jobDescription}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">Select a company to view job details.</p>
        )}
        {!sendAsLink && students?.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Student List</h3>
            {students?.map((student, index) => (
              <div key={index} className="flex justify-between items-center p-4 mb-4 bg-gray-200 shadow-md rounded-md">
                <div>
                  <p className="text-gray-700"><strong>Name:</strong> {student.name}</p>
                  <p className="text-gray-700"><strong>Email:</strong> {student.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteStudent(index)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortlistForm;
