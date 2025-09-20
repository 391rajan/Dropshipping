// src/components/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { userAPI } from '../services/api'; // Import userAPI

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getAll(); // Using userAPI.getAll()
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // Original fetch call:
        // const response = await fetch(`http://localhost:5000/api/auth/users/${selectedUser._id}`, {
        //   method: 'DELETE',
        // });
        // if (!response.ok) {
        //   throw new Error('Failed to delete user.');
        // }
        await userAPI.delete(userId); // Using userAPI.delete()
        fetchUsers(); // Refresh list
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateRole = async (isAdmin) => {
    if (!selectedUser) return;
    try {
      // Original fetch call:
      // const response = await fetch(`http://localhost:5000/api/auth/users/${selectedUser._id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ isAdmin }),
      // });
      // if (!response.ok) {
      //   throw new Error('Failed to update user role.');
      // }
      await userAPI.update(selectedUser._id, { isAdmin }); // Using userAPI.update()
      fetchUsers();
      handleCloseModal();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manage Users</h2>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ 
                      user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800' 
                    }`}>
                      {user.isAdmin ? 'Admin' : 'Customer'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleEditClick(user)} className="text-blue-500 hover:text-blue-700 font-medium mr-4">Edit Role</button>
                    <button onClick={() => handleDelete(user._id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={`Edit Role for ${selectedUser?.name}`}>
        {selectedUser && (
          <div>
            <p>Select a new role for <strong>{selectedUser.email}</strong>.</p>
            <div className="mt-4 flex justify-around">
              <button onClick={() => handleUpdateRole(true)} disabled={selectedUser.isAdmin} className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400">
                Make Admin
              </button>
              <button onClick={() => handleUpdateRole(false)} disabled={!selectedUser.isAdmin} className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400">
                Make Customer
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default UserManagement;