import React from 'react';
import AdminPage from './AdminPage';

const Dashboard = () => {
 
  const isAdmin = true; 

  console.log('isAdmin:', isAdmin); // Log isAdmin value for debugging

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {isAdmin ? (
        <AdminPage />
      ) : (
        <p className="text-red-500">You are not authorized to access this page.</p>
      )}
    </div>
  );
};

export default Dashboard;
