import React, { useState, useEffect } from 'react';
import { Row, Col, Progress, Button, Statistic, Alert, Typography, Modal, Form, Select, InputNumber } from 'antd';
import { Link } from 'react-router-dom';
import MemberLayout from '../../layout/MemberLayout';
import { API_URL } from '../../services/api';
import MpesaPaymentForm from '../../components/MpesaPaymentForm';

const { Option } = Select;
const { Title, Text } = Typography;

const MemberDashboardPage = () => {
    // State management
    const [campaigns, setCampaigns] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [quickContributionAmount, setQuickContributionAmount] = useState(100);
    const [isMobile, setIsMobile] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0)

    // Fetch data from the server
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch campaigns
                const campaignsResponse = await fetch(`${API_URL}/member/campaigns`, { headers: getAuthHeaders() });
                if (campaignsResponse.ok) {
                    const campaignsData = await campaignsResponse.json();
                    setCampaigns(campaignsData.map(c => ({
                        id: c._id,
                        title: c.title,
                        category: c.category,
                        goal: c.goalAmount,
                        raised: c.currentAmount,
                        description: c.description,
                        endDate: c.endDate,
                        status: c.status,
                        details: c.details,
                    })));
                }

                // Fetch contributions
                const contributionsResponse = await fetch(`${API_URL}/member/contributions`, { headers: getAuthHeaders() });
                if (contributionsResponse.ok) {
                    const contributionsData = await contributionsResponse.json();
                    setRecentActivity(contributionsData.map(c => ({
                        id: c._id,
                        description: `Contributed KES ${c.amount} to ${c.campaign?.title}`,
                        date: c.date || c.createdAt || new Date().toISOString(),
                    })));
                }
            } catch (e) {
                setError("Error loading data: " + e.message);
            }
            setLoading(false);
        };
        fetchData();
    }, [refreshKey]);

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Section styling
    const sectionStyle = {
        padding: isMobile ? '24px 16px' : '32px 24px',
        marginBottom: 24,
        borderBottom: '2px solid #f0f0f0',
    };

    return (
        <MemberLayout>
            <div style={{ width: '100%', maxWidth: 1600, margin: '0 auto', backgroundColor: '#fff', minHeight: '100vh' }}>
                {/* Dashboard Header */}
                <div style={{ ...sectionStyle, textAlign: 'center' }}>
                    <Title level={1} style={{ color: 'maroon', fontSize: isMobile ? '1.75rem' : '2.5rem', marginBottom: 0 }}>
                        Student Dashboard
                    </Title>
                    Easily & Quickly Contribute and View Announcements.
                </div>

                {/* Loading and Error States */}
                {loading && <Alert message="Loading..." type="info" showIcon style={{ marginBottom: 24 }} />}
                {error && <Alert message={`Error: ${error}`} type="error" closable onClose={() => setError(null)} style={{ marginBottom: 24 }} />}

                {/* Active Campaigns Section */}
                <div style={sectionStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <Title level={3} style={{ color: 'maroon', margin: 0 }}>Active Campaigns</Title>
                        <Link to="/member/campaigns" style={{ color: 'maroon' }}>View All →</Link>
                    </div>
                    <Row gutter={[24, 24]}>
                        {campaigns
                            .slice(0, isMobile ? 2 : 4) // Limiting campaigns based on screen size
                            .map(campaign => (
                                <Col key={campaign.id} xs={24} md={12} lg={8} xl={6}>
                                    <div style={{
                                        border: '1px solid',
                                        borderRadius: 8,
                                        padding: 16,
                                        marginBottom: 16,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div>
                                            <Title level={4}>{campaign.title}</Title>
                                            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>{campaign.category}</Text>
                                            <Progress
                                                percent={Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100)}
                                                status={campaign.raised >= campaign.goal ? "success" : "active"}
                                                strokeColor="maroon"
                                                style={{ margin: '16px 0' }}
                                            />
                                            <Row gutter={16}>
                                                <Col span={12}><Statistic title="Target" value={campaign.goal} prefix="KES" /></Col>
                                                <Col span={12}><Statistic title="Raised" value={campaign.raised} prefix="KES" /></Col>
                                            </Row>
                                        </div>
                                        <Button
                                            block
                                            type="primary"
                                            style={{
                                                background: '#b5e487',
                                                borderColor: 'maroon',
                                                color: 'black',
                                                marginTop: 16,
                                                whiteSpace: 'normal',
                                                height: 'auto',
                                                padding: '8px 0'
                                            }}
                                            onClick={() => { setSelectedCampaign(campaign); setIsModalVisible(true); }}
                                        >
                                            Donate Now
                                        </Button>
                                    </div>
                                </Col>
                            ))}
                    </Row>
                </div>

                {/* Quick Contribution Section */}
                <div style={sectionStyle}>
                    <Title level={3} style={{ color: 'maroon', marginBottom: 24, textAlign: 'center' }}>Quick Contribution</Title>
                    <div style={{ maxWidth: 600, margin: '0 auto' }}>
                        <Form layout="vertical">
                            <Form.Item label={<Text strong>Select Campaign</Text>}>
                                <Select
                                    placeholder="Select a campaign"
                                    onChange={(value) => setSelectedCampaign(campaigns.find(c => c.id === value))}
                                    disabled={loading}
                                >
                                    {campaigns.map(campaign => (
                                        <Option key={campaign.id} value={campaign.id}>{campaign.title}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label={<Text strong>Amount (KES)</Text>}>
                                <InputNumber
                                    min={100}
                                    step={100}
                                    defaultValue={100}
                                    onChange={setQuickContributionAmount}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    block
                                    type="primary"
                                    style={{ background: '#b5e487', borderColor: 'maroon', color: 'black', height: isMobile ? 48 : 40 }}
                                    onClick={() => {
                                        if (!selectedCampaign) {
                                            setError('Please select a campaign');
                                            return;
                                        }
                                        if (!quickContributionAmount || quickContributionAmount < 100) {
                                            setError('Amount must be at least KES 100');
                                            return;
                                        }
                                        setIsModalVisible(true);
                                    }}
                                >
                                    Contribute Now
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div style={sectionStyle}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 24,
                    }}>
                        <Title level={3} style={{ color: 'maroon', margin: 0 }}>
                            Recent Activity
                        </Title>
                        <Link to="/member/history" style={{ color: 'maroon' }}>
                            View All →
                        </Link>
                    </div>

                    <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                        {recentActivity.length > 0 ? (
                            recentActivity.map(activity => (
                                <div key={activity.id} style={{
                                    padding: '12px 0',
                                    borderBottom: '1px solid #f0f0f0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{ flex: 1 }}>{activity.description}</Text>
                                    <Text type="secondary" style={{ marginLeft: 16 }}>
                                        {new Date(activity.date).toLocaleDateString('en-GB')}
                                    </Text>
                                </div>
                            ))
                        ) : (
                            <div style={{
                                padding: '24px',
                                textAlign: 'center',
                                background: '#f9f9f9',
                                borderRadius: 8,
                            }}>
                                <Text type="secondary">
                                    No contribution history yet. Start contributing to campaigns to see your activity here.
                                </Text>
                            </div>
                        )}
                    </div>
                </div>

                {/* Announcements Section */}
                <div style={sectionStyle}>
                    <Title level={3} style={{ color: 'maroon', marginBottom: 24 }}>
                        Announcements
                    </Title>
                    <div style={{
                        padding: 16,
                        background: '#fff5f5',
                        borderRadius: 8,
                    }}>
                        <Text style={{ fontSize: isMobile ? 14 : 16 }}>
                            Welcome to the Student Welfare System! Check out our active campaigns
                            and support your fellow students.
                        </Text>
                    </div>
                </div>

                {/* M-Pesa Payment Modal */}
                <Modal
                    title={selectedCampaign?.title || 'Campaign Details'}
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    width={isMobile ? '95%' : '60%'}
                >
                    {selectedCampaign && (
                        <MpesaPaymentForm
                            campaign={selectedCampaign}
                            initialAmount={quickContributionAmount}
                            onPaymentSuccess={() => {
                                setIsModalVisible(false);
                                setRefreshKey(prev => prev + 1); // Trigger refresh
                            }}
                            onPaymentError={setError}
                        />
                    )}
                </Modal>
            </div>
        </MemberLayout>
    );
};

export default MemberDashboardPage;