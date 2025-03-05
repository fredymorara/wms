// src/pages/member/HelpPage.jsx
import React from 'react';

function HelpPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Help & Support</h1>
            <div className="bg-white rounded-md shadow-md p-6">
                <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
                <p>If you need assistance, please contact us using the information below:</p>
                <ul className="list-disc pl-5 mt-2">
                    <li>Email: support@studentwelfare.com</li>
                    <li>Phone: +254 700 000 000</li>
                    <li>Office: Student Affairs Building, Room 101</li>
                </ul>

                <h2 className="text-xl font-semibold mt-4 mb-2">Submit an Inquiry</h2>
                <p>You can also submit your questions or concerns using the form below:</p>
                {/* Basic Contact Form */}
                <form className="mt-4">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                        <input type="text" id="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus-shadow-outline" placeholder="Your Name" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                        <input type="email" id="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus-shadow-outline" placeholder="Your Email" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Message:</label>
                        <textarea id="message" rows="4" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus-shadow-outline" placeholder="Your Message"></textarea>
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus-shadow-outline" type="submit">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default HelpPage;