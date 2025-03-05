// src/pages/member/CampaignsPage.jsx
import React, { useState } from 'react';
import { Input, Table, Button, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

function CampaignsPage() {
    const [campaigns, setCampaigns] = useState([
        {
            id: 1,
            title: 'Medical Fund for John',
            category: 'Medical',
            goal: 100000,
            raised: 65000,
            description: 'Help John with his medical expenses',
            details: 'John is a brilliant student who needs our support...', // Detailed description
            endDate: '2023-12-31',
        },
        {
            id: 2,
            title: 'Academic Support for Sara',
            category: 'Academic',
            goal: 50000,
            raised: 40000,
            description: 'Support Sara\'s education journey',
            details: 'Sara is dedicated and hardworking, but facing financial difficulties...',
            endDate: '2024-01-15',
        },
        {
            id: 3,
            title: 'Emergency Relief Fund',
            category: 'Emergency',
            goal: 75000,
            raised: 25000,
            description: 'Help students in emergency situations',
            details: 'This fund will provide a safety net for students in crisis...',
            endDate: '2024-02-29',
        },
        // Add more campaign data
    ]);
    const [searchText, setSearchText] = useState(''); // State for search input
    const [filteredCampaigns, setFilteredCampaigns] = useState(campaigns); // State for filtered campaigns
    const [selectedCampaign, setSelectedCampaign] = useState(null); // State for selected campaign
    const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility

    const handleSearch = (value) => {
        setSearchText(value);
        const filteredData = campaigns.filter((campaign) =>
            campaign.title.toLowerCase().includes(value.toLowerCase()) ||
            campaign.category.toLowerCase().includes(value.toLowerCase()) ||
            campaign.description.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCampaigns(filteredData);
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => <a onClick={() => showCampaignDetails(record)}>{text}</a>, // Render as a link
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Goal (Ksh)',
            dataIndex: 'goal',
            key: 'goal',
            render: (text) => text.toLocaleString(), // Format number
        },
        {
            title: 'Raised (Ksh)',
            dataIndex: 'raised',
            key: 'raised',
            render: (text) => text.toLocaleString(), // Format number
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button type="primary" onClick={() => showModal(record)}>
                    Contribute
                </Button>
            ),
        },
    ];

    const showModal = (record) => {
        setSelectedCampaign(record);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const showCampaignDetails = (record) => {
        setSelectedCampaign(record);
        setIsModalVisible(true);
    };
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Active Campaigns</h1>
            <p className="mb-4">
                Browse active campaigns and contribute to causes you care about. Use the search to find specific
                campaigns, or click on a campaign title to view more details and contribute.
            </p>
            {/* Search Input */}
            <div className="mb-4">
                <Input placeholder="Search campaigns" prefix={<SearchOutlined />} value={searchText} onChange={(e) => handleSearch(e.target.value)} />
            </div>
            {/* Campaigns Table */}
            <Table columns={columns} dataSource={filteredCampaigns} rowKey="id" />
            {/* Modal for Campaign Details and Contribution */}
            <Modal
                title={selectedCampaign ? selectedCampaign.title : 'Campaign Details'}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary">
                        Contribute
                    </Button>,
                ]}
            >
                {selectedCampaign && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Campaign Details</h2>
                        <p>{selectedCampaign.details}</p>
                        <p className="mt-2">Goal: Ksh {selectedCampaign.goal.toLocaleString()}</p>
                        <p>Raised: Ksh {selectedCampaign.raised.toLocaleString()}</p>
                        <p>End Date: {selectedCampaign.endDate}</p>
                        <h2 className="text-xl font-semibold mt-4 mb-2">Contribute</h2>
                        {/* Contribution Form */}
                        <Input placeholder="Enter amount (Ksh)" type="number" className="mb-2" />
                        {/* Add more form elements here */}
                    </div>
                )}
            </Modal>
        </div>
    );
}
export default CampaignsPage;