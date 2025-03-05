// src/pages/secretary/ApplicationRequestsPage.jsx
import React from 'react';

function ApplicationRequestsPage() {
    // Sample Data
    const App_requests = [
        {name: 'Name 1', id: 1, Description: "Description1", requestDate: '1/1/2000'},
        {name: 'Name 2', id: 2, Description: "Description2", requestDate: '1/1/2000'},
        {name: 'Name 3', id: 3, Description: "Description3", requestDate: '1/1/2000'},
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Application Requests</h1>
            {/* List of application requests and request detail view */}
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Description</th>
                    <th className="py-2 px-4 border-b">Request Date</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                </tr>
                </thead>
                <tbody>
                {App_requests.map(req => (
                    <tr key={req.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">{req.name}</td>
                        <td className="py-2 px-4 border-b">{req.Description}</td>
                        <td className="py-2 px-4 border-b">{req.requestDate}</td>
                        <td className="py-2 px-4 border-b">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2">View</button>
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2">Approve</button>
                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Reject</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ApplicationRequestsPage;