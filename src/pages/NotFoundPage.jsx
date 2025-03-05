// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">404 - Not Found</h2>
            <p>The page you are looking for does not exist.</p>
            <Link to="/" className="text-blue-500 hover:underline">Go to Home</Link>
        </div>
    );
}

export default NotFoundPage;