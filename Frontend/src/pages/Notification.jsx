import { useState } from 'react';
import axios from 'axios';
import AdminNav from '../components/AdminNav';

const NotificationForm = () => {
  const [notifyTo, setNotifyTo] = useState('all');
  const [emails, setEmails] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      to: notifyTo,
      emails: notifyTo === 'specific' ? emails.split(',') : null,
      message,
    };

    try {
      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Notifications sent successfully');
      } else {
        alert('Failed to send notifications');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Error sending notification');
    }
  };


  return (
    <>
    <AdminNav/>

    <div className='mx-auto flex flex-col items-center justify-center p-4  w-[100%] '>

      <h2 className='font-bold text-xl text-center mb-4'>Send Notification 🔔</h2>
      <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center w-[60%] shadow-md mt-8 p-8'>
        <label className='mb-8'>
          Notify:
          <select value={notifyTo} onChange={(e) => setNotifyTo(e.target.value)}>
            <option value="all">All</option>
            <option value="specific">Specific Emails</option>
          </select>
        </label>

        {notifyTo === 'specific' && (
          <label>
            Emails (comma-separated):
            <input
              type="text"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
            />
          </label>
        )}
<span className='flex w-full'>
  <label className='mt-4 mr-2'>
    Message:
  </label>
  <textarea
    className='bg-gray-50 border-2 border-black h-48 w-[100%]' // Increase height here
    value={message}
    onChange={(e) => setMessage(e.target.value)}
  />
</span>

        <button type="submit" className='bg-green-500 w-[40%] py-1 text-white font-semibold rounded-sm mt-2'>Notify</button>
      </form>
    </div>

    </>
  );
};

export default NotificationForm;
