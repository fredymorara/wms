// src/pages/admin/ModifyUserPage.jsx
import React, { useState } from 'react';

function ModifyUserPage() {
    const [userId, setUserId] = useState('');
    const [newRole, setNewRole] = useState('');
    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Modify form values
        // The submission will be handled here by an API
        // For this skeleton, we will just return the results
        console.log(`Submitted. ID: ${userId}, Role: ${newRole}`)
    }
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Modify User Account</h1>
            {/* User modification form and logic goes here */}
            <form onSubmit={handleFormSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userId">
                        User ID
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="userId"
                        type="number"
                        placeholder="User ID"
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newRole">
                        New Role
                    </label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="newRole"
                        onChange={(e) => setNewRole(e.target.value)}
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                        <option value="treasurer">Treasurer</option>
                        <option value="secretary">Secretary</option>
                    </select>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Change Role
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ModifyUserPage;