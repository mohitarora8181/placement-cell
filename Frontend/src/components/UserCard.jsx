import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserCard = ({ user }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/user-profile/${user._id}`);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg w-80 h-auto m-4 cursor-pointer" onClick={handleClick}>
      <h3 className="text-xl font-semibold mb-2">{user.fullname}</h3>
      <p className="text-gray-600 mb-2"><strong>Email:</strong> {user.email}</p>
      <p className="text-gray-600 mb-2"><strong>Branch:</strong> {user.course}</p>
    </div>
  );
};

export default UserCard;
