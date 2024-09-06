import { useState } from 'react';
import axios from 'axios';

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
    <div>
      <h2>Send Notification</h2>
      <form onSubmit={handleSubmit}>
        <label>
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

        <label>
          Message:
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
        </label>

        <button type="submit">Notify</button>
      </form>
    </div>
  );
};

export default NotificationForm;
