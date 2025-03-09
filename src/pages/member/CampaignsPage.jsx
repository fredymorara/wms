import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Table, Button, Modal, Form, Alert, Spin, Typography, Card } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import MemberLayout from '../../layout/MemberLayout';

const { Title, Paragraph, Text } = Typography;

function CampaignsPage() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [contributionLoading, setContributionLoading] = useState(false);
    const [contributionError, setContributionError] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [form] = Form.useForm();

    // Fetch campaigns data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/member/campaigns');
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

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Default campaigns for fallback
    const defaultCampaigns = [
        {
            id: 1,
            title: 'Default Medical Fund for John',
            category: 'Medical',
            goal: 100000,
            raised: 65000,
            description: 'Help John with his medical expenses',
            details: 'John is a brilliant student who needs our support...',
            endDate: '2023-12-31',
        },
        {
            id: 2,
            title: 'Default Academic Support for Sara',
            category: 'Academic',
            goal: 50000,
            raised: 40000,
            description: 'Support Sara\'s education journey',
            details: 'Sara is dedicated and hardworking, but facing financial difficulties...',
            endDate: '2024-01-15',
        },
    ];

    // Handle search functionality
    const handleSearch = (value) => {
        setSearchText(value);
        const filteredData = (error ? defaultCampaigns : campaigns).filter((campaign) =>
            campaign.title.toLowerCase().includes(value.toLowerCase()) ||
            campaign.category.toLowerCase().includes(value.toLowerCase()) ||
            campaign.description.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCampaigns(filteredData);
    };

    // Clear search input
    const clearSearch = () => {
        setSearchText('');
        setFilteredCampaigns(error ? defaultCampaigns : campaigns);
    };

    // Show modal for campaign details or contribution
    const showModal = (record) => {
        setSelectedCampaign(record);
        setIsModalVisible(true);
    };

    // Handle modal cancel
    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setContributionError(null);
    };

    // Handle contribution submission
    const onFinish = async (values) => {
        setContributionLoading(true);
        setContributionError(null);
        try {
            // Simulate M-Pesa integration - replace with actual API call
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
            console.log('Contribution successful!');
            setIsModalVisible(false);
            form.resetFields();
        } catch (e) {
            setContributionError(e.message);
        } finally {
            setContributionLoading(false);
        }
    };

    // Handle form submission failure
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        setContributionError('Form submission failed. Please check the fields.');
    };

    // Table columns
    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <Button type="link" onClick={() => showModal(record)} disabled={error} style={{ color: 'maroon' }}>
                    {text}
                </Button>
            ),
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
            render: (text) => text.toLocaleString(),
        },
        {
            title: 'Raised (Ksh)',
            dataIndex: 'raised',
            key: 'raised',
            render: (text) => text.toLocaleString(),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button type="primary" onClick={() => showModal(record)} disabled={error} style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}>
                    Contribute
                </Button>
            ),
        },
    ];

    // Section styling
    const sectionStyle = {
        padding: isMobile ? '24px 16px' : '32px 24px',
        marginBottom: 24,
        borderBottom: '2px solid #f0f0f0',
    };

    // Render campaigns as cards for mobile
    const renderCampaignCards = () => {
        return filteredCampaigns.map((campaign) => (
            <Card
                key={campaign.id}
                style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
            >
                <Title level={5} style={{ color: 'maroon' }}>{campaign.title}</Title>
                <Text strong>Category:</Text> {campaign.category}
                <br />
                <Text strong>Goal:</Text> Ksh {campaign.goal.toLocaleString()}
                <br />
                <Text strong>Raised:</Text> Ksh {campaign.raised.toLocaleString()}
                <br />
                <Button
                    type="primary"
                    onClick={() => showModal(campaign)}
                    disabled={error}
                    style={{ backgroundColor: '#b5e487', borderColor: 'maroon', color: 'black', marginTop: 16 }}
                    block
                >
                    Contribute
                </Button>
            </Card>
        ));
    };

    return (
        <MemberLayout>
            <div style={{
                width: '100%',
                maxWidth: 1600,
                margin: '0 auto',
                backgroundColor: '#fff',
                minHeight: '100vh',
            }}>
                {/* Campaigns Header */}
                <div style={{ ...sectionStyle, textAlign: 'center' }}>
                    <Title level={1} style={{
                        color: 'maroon',
                        fontSize: isMobile ? '1.75rem' : '2.5rem',
                        marginBottom: 0,
                    }}>
                        Active Campaigns
                    </Title>
                    <Paragraph style={{ marginBottom: '20px', textAlign: 'center' }}>
                        Browse active campaigns and contribute to causes you care about. Use the search to find specific campaigns, or click on a campaign title to view more details and contribute.
                    </Paragraph>
                </div>

                {/* Loading and Error States */}
                {loading && <Alert message="Loading..." type="info" showIcon style={{ marginBottom: 24 }} />}
                {error && <Alert message={`Error: ${error}`} type="error" closable onClose={() => setError(null)} style={{ marginBottom: 24 }} />}

                {/* Search Input */}
                <div style={{ ...sectionStyle, textAlign: 'center' }}>
                    <Input
                        placeholder="Search campaigns"
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                        disabled={error}
                        style={{ maxWidth: 600, marginBottom: 16 }}
                    />
                    {searchText && (
                        <Button
                            icon={<CloseOutlined />}
                            onClick={clearSearch}
                            style={{ marginLeft: 8 }}
                            disabled={error}
                        />
                    )}
                </div>

                {/* Campaigns Table or Cards */}
                <div style={sectionStyle}>
                    {isMobile ? (
                        renderCampaignCards()
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={filteredCampaigns}
                            rowKey="id"
                            aria-label="Active Campaigns"
                            pagination={{ pageSize: 10 }}
                        />
                    )}
                </div>

                {/* Modal for Campaign Details and Contribution */}
                <Modal
                    title={selectedCampaign ? selectedCampaign.title : 'Campaign Details'}
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                    width={isMobile ? '90%' : '60%'}
                >
                    {selectedCampaign && (
                        <div style={{ padding: 16 }}>
                            <Title level={4} style={{ color: 'maroon' }}>Description</Title>
                            <Paragraph>{selectedCampaign.description}</Paragraph>
                            <div style={{ padding: 16, backgroundColor: '#f7f5f5', borderRadius: 8, marginTop: 16 }}>
                                <Title level={4} style={{ color: 'maroon' }}>Campaign Details</Title>
                                <Paragraph>{selectedCampaign.details}</Paragraph>
                            </div>
                            <div style={{ padding: 16, backgroundColor: '#f7f5f5', borderRadius: 8, marginTop: 16 }}>
                                <Paragraph>
                                    <Text strong style={{ color: 'maroon' }}>Goal:</Text> Ksh {selectedCampaign.goal.toLocaleString()}
                                </Paragraph>
                                <Paragraph>
                                    <Text strong style={{ color: 'maroon' }}>Raised:</Text> Ksh {selectedCampaign.raised.toLocaleString()}
                                </Paragraph>
                                <Paragraph>
                                    <Text strong style={{ color: 'maroon' }}>End Date:</Text> {selectedCampaign.endDate}
                                </Paragraph>
                            </div>

                            <Title level={4} style={{ color: 'maroon', marginTop: 24 }}>Contribute</Title>

                            {/* Contribution Form */}
                            <Form
                                form={form}
                                name="contributionForm"
                                layout="vertical"
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                            >
                                <Form.Item
                                    label={<Text strong>Amount (Ksh)</Text>}
                                    name="amount"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter the amount to contribute.',
                                        },
                                        {
                                            type: 'number',
                                            min: 1,
                                            message: 'Amount must be greater than zero.',
                                        },
                                    ]}
                                >
                                    <Input type="number" placeholder="Enter amount (Ksh)" disabled={error} />
                                </Form.Item>
                                {contributionError && <Alert message={`Error: ${contributionError}`} type="error" showIcon />}
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={contributionLoading}
                                        disabled={contributionLoading || error}
                                        style={{ backgroundColor: '#b5e487', borderColor: 'maroon', color: 'white' }}
                                    >
                                        Contribute
                                    </Button>
                                    <Button key="cancel" onClick={handleCancel} style={{ marginLeft: 8 }} disabled={error}>
                                        Cancel
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    )}
                </Modal>
            </div>
        </MemberLayout>
    );
}

export default CampaignsPage;