import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Button, Modal, Form, Alert, Spin, Typography, Card, Progress, Statistic } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import MemberLayout from '../../layout/MemberLayout';
import { API_URL } from '../../services/api';

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
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/member/campaigns`, { headers: getAuthHeaders() });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const formattedCampaigns = data.map(campaign => ({
                    id: campaign._id,
                    title: campaign.title,
                    category: campaign.category,
                    goal: campaign.goalAmount,
                    raised: campaign.currentAmount,
                    description: campaign.description,
                    endDate: campaign.endDate,
                    status: campaign.status,
                    details: campaign.details,
                }));
                setCampaigns(formattedCampaigns);
                setFilteredCampaigns(formattedCampaigns);
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

    // Handle search functionality
    const handleSearch = (value) => {
        setSearchText(value);
        const filteredData = campaigns.filter((campaign) =>
            campaign.title.toLowerCase().includes(value.toLowerCase()) ||
            campaign.category.toLowerCase().includes(value.toLowerCase()) ||
            campaign.description.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCampaigns(filteredData);
    };

    // Clear search input
    const clearSearch = () => {
        setSearchText('');
        setFilteredCampaigns(campaigns);
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
                <div style={{ padding: isMobile ? '24px 16px' : '32px 24px', textAlign: 'center' }}>
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
                <div style={{ padding: isMobile ? '24px 16px' : '32px 24px', textAlign: 'center' }}>
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

                {/* Campaigns Cards */}
                <div style={{ padding: isMobile ? '0px' : '32px 24px' }}>
                    <Row gutter={[16, 16]}>
                        {filteredCampaigns.length > 0 ? (
                            filteredCampaigns.map(campaign => (
                                <Col key={campaign.id} xs={24} sm={24} md={12} lg={8}>
                                    <Card
                                        style={{
                                            borderRadius: 6,
                                            border: '1px solid',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                            marginBottom: 16,
                                            padding: isMobile ? '0px' : '24px',
                                        }}
                                    >
                                        <Title level={4} style={{ color: 'maroon', marginBottom: 8 }}>
                                            {campaign.title}
                                        </Title>
                                        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                                            {campaign.category}
                                        </Text>
                                        <Progress
                                            percent={Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100)}
                                            status={campaign.raised >= campaign.goal ? "success" : "active"}
                                            strokeColor="maroon"
                                            style={{ margin: '16px 0' }}
                                        />
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Statistic title="Target" value={campaign.goal} prefix="KES" />
                                            </Col>
                                            <Col span={12}>
                                                <Statistic title="Raised" value={campaign.raised} prefix="KES" />
                                            </Col>
                                        </Row>
                                        <Button
                                            type="primary"
                                            onClick={() => showModal(campaign)}
                                            disabled={error}
                                            style={{
                                                backgroundColor: '#b5e487',
                                                borderColor: 'maroon',
                                                color: 'black',
                                                marginTop: 16,
                                                width: '100%',
                                                height: isMobile ? 48 : 40,
                                            }}
                                        >
                                            Contribute
                                        </Button>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <Col span={24}>
                                <Alert
                                    message="No active campaigns"
                                    description="There are currently no active campaigns to display."
                                    type="info"
                                />
                            </Col>
                        )}
                    </Row>
                </div>

                {/* Modal for Campaign Details and Contribution */}
                <Modal
                    title={selectedCampaign ? selectedCampaign.title : 'Campaign Details'}
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                    width={isMobile ? '95%' : '60%'}
                >
                    {selectedCampaign && (
                        <div style={{ padding: 16 }}>
                            <Title level={4} style={{ color: 'maroon' }}>Description</Title>
                            <Paragraph>{selectedCampaign.description}</Paragraph>
                            <div style={{ padding: 16, backgroundColor: '#f1f6f1', border: '1px solid rgb(243, 227, 227)', borderRadius: 8, marginTop: 16 }}>
                                <Title level={4} style={{ color: 'maroon' }}>Campaign Details</Title>
                                <Paragraph>{selectedCampaign.details}</Paragraph>
                            </div>
                            <div style={{ padding: 16, backgroundColor: '#f1f6f1', border: '1px solid rgb(243, 227, 227)', borderRadius: 8, marginTop: 16 }}>
                                <Paragraph>
                                    <Text strong style={{ color: 'maroon' }}>Goal:</Text> Ksh {selectedCampaign.goal.toLocaleString()}
                                </Paragraph>
                                <Paragraph>
                                    <Text strong style={{ color: 'maroon' }}>Raised:</Text> Ksh {selectedCampaign.raised.toLocaleString()}
                                </Paragraph>
                                <Paragraph>
                                    <Text strong style={{ color: 'maroon' }}>End Date:</Text> {new Date(selectedCampaign.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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
                                        style={{ backgroundColor: '#b5e487', borderColor: 'maroon', color: 'black' }}
                                    >
                                        Contribute Now
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