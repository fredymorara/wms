// src/pages/admin/StudentApplicationReviewPage.jsx
import React from 'react';

function StudentApplicationReviewPage() {
    // Mock Student Applications Data.
    const studentApplications = [
        { id: 1, name: "Joe Mama", school: "School of Funny Business", applicationDate: "14/10/2024" },
        { id: 2, name: "John Wick", school: "School of Retirement", applicationDate: "10/10/2024" },
        { id: 3, name: "Example Person", school: "School of Example", applicationDate: "1/1/1000" },
    ]
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Student Application Review</h1>
            {/* Display the applications in a table.
            This table should use Student Applications data*/}
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">School</th>
                    <th className="py-2 px-4 border-b">Application Date</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                </tr>
                </thead>
                <tbody>
                {studentApplications.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">{student.name}</td>
                        <td className="py-2 px-4 border-b">{student.school}</td>
                        <td className="py-2 px-4 border-b">{student.applicationDate}</td>
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

export default StudentApplicationReviewPage;