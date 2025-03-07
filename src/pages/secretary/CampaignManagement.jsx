import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, Table, Input, Button, Form, Select, DatePicker, Alert, Spin, Tag } from 'antd';
import { SearchOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;
const { Option } = Select;

function CampaignManagementPage() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/secretary/campaigns');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCampaigns(data);
                setFilteredCampaigns(data);
                setLoading(false);
            } catch (e) {
                setError(e.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const defaultCampaigns = [
        { id: 1, title: 'Default Medical Campaign', status: 'active', duration: '30 days', tracking_number: 'TRACK123', progress: 50 },
        { id: 2, title: 'Default Education Campaign', status: 'draft', duration: '60 days', tracking_number: null, progress: 20 },
    ];

    const handleSearch = (value) => {
        setSearchText(value);
        const filteredData = (error ? defaultCampaigns : campaigns).filter((campaign) =>
            campaign.title.toLowerCase().includes(value.toLowerCase()) ||
            campaign.status.toLowerCase().includes(value.toLowerCase()) ||
            (campaign.tracking_number && campaign.tracking_number.toLowerCase().includes(value.toLowerCase()))
        );
        setFilteredCampaigns(filteredData);
    };

    const clearSearch = () => {
        setSearchText('');
        setFilteredCampaigns(error ? defaultCampaigns : campaigns);
    };

    const handleCreateCampaign = () => {
        console.log('Create new campaign');
        // Implement your logic to open a modal/form to create a new campaign
    };

    const handleEditCampaign = (record) => {
        console.log(`Edit campaign: ${record.id}`);
        // Implement your logic to open a modal/form to edit the campaign details
    };

    const handleAssignTrackingNumber = (record) => {
        console.log(`Assign tracking number for campaign: ${record.id}`);
        // Implement your logic to assign a tracking number
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                let color = 'green';
                if (text === 'draft') {
                    color = 'geekblue';
                } else if (text === 'past') {
                    color = 'gray';
                }
                return (
                    <Tag color={color} key={text}>
                        {text.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Tracking Number',
            dataIndex: 'tracking_number',
            key: 'tracking_number',
            render: (text) => text || 'N/A',
        },
        {
            title: 'Progress',
            dataIndex: 'progress',
            key: 'progress',
            render: (progress) => `${progress}%`,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <>
                    <Button type="primary" onClick={() => handleEditCampaign(record)} style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white', marginRight: 8 }} disabled={error || loading}>
                        Edit
                    </Button>
                    <Button type="primary" onClick={() => handleAssignTrackingNumber(record)} disabled={error || loading}>
                        Assign Tracking
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Layout
            style={{
                background: 'linear-gradient(to bottom, #F8E8EC 70%, #d9f7be)',
                minHeight: '100vh',
            }}
        >
            <Header
                style={{
                    background: 'maroon',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    padding: '0 50px',
                    height: '80px',
                }}
            >
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                    Kabarak Student Welfare Management System - Campaign Management
                </Title>
            </Header>
            <Content style={{ padding: '50px' }}>
                <div className="container">
                    <Title level={2} style={{ color: 'maroon', marginBottom: '20px', textAlign: 'center' }}>Campaign Management</Title>
                    <Paragraph style={{ marginBottom: '20px', textAlign: 'center' }}>
                        Create, edit, and manage campaign details.
                    </Paragraph>

                    {/* Search and Add Campaign */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div className="flex items-center">
                            <Input
                                placeholder="Search campaigns"
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => handleSearch(e.target.value)}
                                disabled={error || loading}
                            />
                            {searchText && (
                                <Button
                                    icon={<CloseOutlined />}
                                    onClick={clearSearch}
                                    style={{ marginLeft: 8 }}
                                    disabled={error || loading}
                                />
                            )}
                        </div>
                        <Button type="primary" onClick={handleCreateCampaign} style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }} disabled={error || loading}>
                            <PlusOutlined /> Create Campaign
                        </Button>
                    </div>

                    {/* Campaigns Table */}
                    {loading ? (
                        <div className="text-center">
                            <Spin size="large" />
                            <p className="mt-2">Loading campaign data...</p>
                        </div>
                    ) : error ? (
                        <>
                            <Alert message={`Error fetching data: ${error}. Displaying default campaigns.`} type="error" showIcon />
                            <Table
                                columns={columns}
                                dataSource={defaultCampaigns}
                                rowKey="id"
                                aria-label="Campaign List"
                            />
                         </>
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={campaigns}
                            rowKey="id"
                            aria-label="Campaign List"
                        />
                    )}
                </div>
            </Content>
        </Layout>
    );
}

export default CampaignManagementPage;