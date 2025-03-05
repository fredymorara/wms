// src/pages/member/CampaignsPage.jsx
import React, { useState } from 'react';
import { Input, Table, Button, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

function CampaignsPage() {
    // Mock campaign data
    const [campaigns, setCampaigns] = useState([
        { id: 1, title: 'Medical Fund for John', category: 'Medical', goal: 100000, raised: 65000, description: "Has medical needs" },
        { id: 2, title: 'Academic Support for Sara', category: 'Academic', goal: 50000, raised: 40000, description: "Needs academic goals met" },
        { id: 3, title: 'Emergency Relief Fund', category: 'Emergency', goal: 75000, raised: 25000, description: "Is in trouble" },
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

            {/* Search Input */}
            <div className="mb-4">
                <Input placeholder="Search campaigns" prefix={<SearchOutlined />} value={searchText} onChange={(e) => handleSearch(e.target.value)} />
            </div>

            {/* Campaigns Table */}
            <Table columns={columns} dataSource={filteredCampaigns} rowKey="id" />

            {/* Modal for Contribution */}
            <Modal
                title={selectedCampaign ? `Contribute to ${selectedCampaign.title}` : 'Contribute'}
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
                        <p>{selectedCampaign.description}</p>
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