//import { useState } from 'react';
//import axios from 'axios';
//
//const ShortlistForm = () => {
//  const [companyName, setCompanyName] = useState('');
//  const [link, setLink] = useState('');
//  const [students, setStudents] = useState([{ name: '', email: '' }]);
//  const [sendAsLink, setSendAsLink] = useState(true);
//
//  const handleSubmit = async (e) => {
//    e.preventDefault();
//
//    const payload = {
//      companyName,
//      shortlistedStudents: sendAsLink ? link : students,
//    };
//
//    try {
//      const response = await axios.post('/api/jobs/shortlist', payload);
//      if (response.status === 200) {
//        alert('Shortlist saved successfully!');
//      } else {
//        alert('Failed to save shortlist');
//      }
//    } catch (error) {
//      console.error('Error saving shortlist:', error);
//      alert('Error saving shortlist');
//    }
//  };
//
//  const addStudent = () => {
//    setStudents([...students, { name: '', email: '' }]);
//  };
//
//  const updateStudent = (index, field, value) => {
//    const updatedStudents = [...students];
//    updatedStudents[index][field] = value;
//    setStudents(updatedStudents);
//  };
//
//  return (
//    <div>
//      <h2>Submit Shortlisted Students</h2>
//      <form onSubmit={handleSubmit}>
//        <label>
//          Company Name:
//          <input
//            type="text"
//            value={companyName}
//            onChange={(e) => setCompanyName(e.target.value)}
//            required
//          />
//        </label>
//
//        <label>
//          Submit as:
//          <select value={sendAsLink} onChange={(e) => setSendAsLink(e.target.value === 'link')}>
//            <option value="link">Link</option>
//            <option value="list">Manual List</option>
//          </select>
//        </label>
//
//        {sendAsLink ? (
//          <label>
//            File Link:
//            <input
//              type="text"
//              value={link}
//              onChange={(e) => setLink(e.target.value)}
//              required
//            />
//          </label>
//        ) : (
//          <>
//            {students.map((student, index) => (
//              <div key={index}>
//                <label>
//                  Name:
//                  <input
//                    type="text"
//                    value={student.name}
//                    onChange={(e) => updateStudent(index, 'name', e.target.value)}
//                    required
//                  />
//                </label>
//                <label>
//                  Email:
//                  <input
//                    type="email"
//                    value={student.email}
//                    onChange={(e) => updateStudent(index, 'email', e.target.value)}
//                    required
//                  />
//                </label>
//              </div>
//            ))}
//            <button type="button" onClick={addStudent}>
//              Add More Students
//            </button>
//          </>
//        )}
//
//        <button type="submit">Submit</button>
//      </form>
//    </div>
//  );
//};
//
//export default ShortlistForm;
//

import { useState } from 'react';
import axios from 'axios';

const ShortlistForm = () => {
  const [companyName, setCompanyName] = useState('');
  const [link, setLink] = useState('');
  const [students, setStudents] = useState([{ name: '', email: '' }]);
  const [sendAsLink, setSendAsLink] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      companyName,
      shortlistedStudents: sendAsLink ? link : students,
    };

    try {
      const response = await axios.post('/api/jobs/shortlist', payload);
      if (response.status === 200) {
        alert('Shortlist saved successfully!');
      } else {
        alert('Failed to save shortlist');
      }
    } catch (error) {
      console.error('Error saving shortlist:', error);
      alert('Error saving shortlist');
    }
  };

  const addStudent = () => {
    setStudents([...students, { name: '', email: '' }]);
  };

  const updateStudent = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Submit Shortlisted Students</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-2">Company Name:</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Submit as:</label>
          <select
            value={sendAsLink ? 'link' : 'list'}
            onChange={(e) => setSendAsLink(e.target.value === 'link')}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="link">Link</option>
            <option value="list">Manual List</option>
          </select>
        </div>

        {sendAsLink ? (
          <div>
            <label className="block font-semibold mb-2">File Link:</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        ) : (
          <>
            <label className="block font-semibold mb-2">Add Students Manually:</label>
            {students.map((student, index) => (
              <div key={index} className="grid grid-cols-2 gap-x-4 mb-4">
                <div>
                  <label className="block font-semibold mb-1">Name:</label>
                  <input
                    type="text"
                    value={student.name}
                    onChange={(e) => updateStudent(index, 'name', e.target.value)}
                    required
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Email:</label>
                  <input
                    type="email"
                    value={student.email}
                    onChange={(e) => updateStudent(index, 'email', e.target.value)}
                    required
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addStudent}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Add More Students
            </button>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ShortlistForm;