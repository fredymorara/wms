// src/pages/member/ContributionHistoryPage.jsx
import React, { useState } from 'react';
import { Table, Input, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

function ContributionHistoryPage() {
    // Mock data for a member's contribution history
    const [contributions, setContributions] = useState([
        { id: 1, campaign: 'Medical Fund for Student A', date: '2023-11-15', amount: 5000, receipt: '#' },
        { id: 2, campaign: 'Education Support for Student B', date: '2023-10-28', amount: 2000, receipt: '#' },
        { id: 3, campaign: 'Emergency Relief Fund', date: '2023-09-10', amount: 10000, receipt: '#' },
    ]);
    const [searchText, setSearchText] = useState(''); // State for search input
    const [filteredContributions, setFilteredContributions] = useState(contributions); // State for filtered contributions

    const handleSearch = (value) => {
        setSearchText(value);
        const filteredData = contributions.filter((contribution) =>
            contribution.campaign.toLowerCase().includes(value.toLowerCase()) ||
            contribution.date.includes(value) ||
            contribution.amount.toString().includes(value)
        );
        setFilteredContributions(filteredData);
    };

    const columns = [
        {
            title: 'Campaign',
            dataIndex: 'campaign',
            key: 'campaign',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Amount (Ksh)',
            dataIndex: 'amount',
            key: 'amount',
            render: (text) => text.toLocaleString(), // Format number
        },
        {
            title: 'Receipt',
            key: 'receipt',
            render: (text, record) => (
                <Button type="link" href={record.receipt} target="_blank">
                    View Receipt
                </Button>
            ),
        },
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Your Contribution History</h1>

            {/* Search Input */}
            <div className="mb-4">
                <Input placeholder="Search contributions" prefix={<SearchOutlined />} value={searchText} onChange={(e) => handleSearch(e.target.value)} />
            </div>

            {/* Contribution History Table */}
            <Table columns={columns} dataSource={filteredContributions} rowKey="id" />
        </div>
    );
}
export default ContributionHistoryPage;