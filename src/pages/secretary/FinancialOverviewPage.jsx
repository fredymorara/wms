// src/pages/treasurer/FinancialOverviewPage.jsx
import React from 'react';

function FinancialOverviewPage() {
    const financialData = {
        totalContributions: 54400,
        totalDisbursements: 12000,
        activeCampaigns: 12
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Financial Overview</h1>
            <div className="bg-white rounded-md shadow-md p-6">
                <p className="text-gray-600">Total Contributions: KES {financialData.totalContributions.toLocaleString()}</p>
                <p className="text-gray-600">Total Disbursements: KES {financialData.totalDisbursements.toLocaleString()}</p>
                <p className="text-gray-600">Active Campaigns: {financialData.activeCampaigns}</p>
                {/* Add visualizations and other key financial indicators */}
            </div>
        </div>
    );
}

export default FinancialOverviewPage;