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
    <div>
      <h2>Submit Shortlisted Students</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Company Name:
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </label>

        <label>
          Submit as:
          <select value={sendAsLink} onChange={(e) => setSendAsLink(e.target.value === 'link')}>
            <option value="link">Link</option>
            <option value="list">Manual List</option>
          </select>
        </label>

        {sendAsLink ? (
          <label>
            File Link:
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            />
          </label>
        ) : (
          <>
            {students.map((student, index) => (
              <div key={index}>
                <label>
                  Name:
                  <input
                    type="text"
                    value={student.name}
                    onChange={(e) => updateStudent(index, 'name', e.target.value)}
                    required
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    value={student.email}
                    onChange={(e) => updateStudent(index, 'email', e.target.value)}
                    required
                  />
                </label>
              </div>
            ))}
            <button type="button" onClick={addStudent}>
              Add More Students
            </button>
          </>
        )}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ShortlistForm;
