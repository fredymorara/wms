// src/pages/admin/UserListPage.jsx
import React from 'react';

function UserListPage() {
    // Sample data for the time being
    const users = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'member', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'admin', status: 'active' },
        { id: 3, name: 'Peter Jones', email: 'peter.jones@example.com', role: 'member', status: 'inactive' },
    ];
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">User List</h1>
            {/* User list and management tools */}
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Role</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">{user.name}</td>
                        <td className="py-2 px-4 border-b">{user.email}</td>
                        <td className="py-2 px-4 border-b">{user.role}</td>
                        <td className="py-2 px-4 border-b">{user.status}</td>
                        <td className="py-2 px-4 border-b">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2">Edit</button>
                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserListPage;