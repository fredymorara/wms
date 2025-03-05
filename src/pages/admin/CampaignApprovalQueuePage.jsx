// src/pages/secretary/CampaignRequestPage.jsx
import React from 'react';

function CampaignRequestPage() {
    // Dummy Data
    const Campaign_Requsts=[
        { title: "Title 1", Description: "Description 1", Name: 'Example Name 1', Email: 'example1@Example.com',
        },
        { title: "Title 2", Description: "Description 2", Name: 'Example Name 2', Email: 'example2@Example.com',
        },
    ]
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Campaign Requests</h1>
            <p>Review campaign requests submitted by members.</p>
            {/* Implement the campaign request list and detail view here */}
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b">title</th>
                    <th className="py-2 px-4 border-b">Desctiption</th>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Email</th>
                </tr>
                </thead>
                <tbody>
                {Campaign_Requsts.map((request, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">{request.title}</td>
                        <td className="py-2 px-4 border-b">{request.Description}</td>
                        <td className="py-2 px-4 border-b">{request.Name}</td>
                        <td className="py-2 px-4 border-b">{request.Email}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default CampaignRequestPage;