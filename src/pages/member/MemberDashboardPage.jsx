import React, { useState, useEffect } from 'react';
import { Row, Col, Progress, Button, Statistic, InputNumber, Form, Select, Alert, Typography } from 'antd';
import { Link } from 'react-router-dom';
import MemberLayout from '../../layout/MemberLayout';

const { Option } = Select;
const { Title, Text } = Typography;

const MemberDashboardPage = () => {
    // State management
    const [campaigns, setCampaigns] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [contributionAmount, setContributionAmount] = useState(100);
    const [contributionSuccess, setContributionSuccess] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Default data
    const defaultCampaigns = [
        {
            id: 1,
            title: 'Default Medical Fund for John',
            description: 'Help John with his default medical expenses',
            goal: 100000,
            raised: 60000,
            contributors: 45,
        },
        {
            id: 2,
            title: 'Default Education Fund for Jane',
            description: 'Support Jane\'s default education journey',
            goal: 50000,
            raised: 40000,
            contributors: 62,
        },
    ];

    // Fetch data from the server
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [campaignsResponse, contributionsResponse] = await Promise.all([
                    fetch('http://localhost:5000/api/member/campaigns'),
                    fetch('http://localhost:5000/api/member/contributions'),
                ]);

                if (!campaignsResponse.ok) {
                    throw new Error(`Campaigns API failed with status: ${campaignsResponse.status}`);
                }
                if (!contributionsResponse.ok) {
                    throw new Error(`Contributions API failed with status: ${contributionsResponse.status}`);
                }

                const [campaignsData, contributionsData] = await Promise.all([
                    campaignsResponse.json(),
                    contributionsResponse.json(),
                ]);

                setCampaigns(campaignsData);
                setSelectedCampaign(campaignsData[0]?.id || null);

                // Map contributions to recent activity
                const activityData = contributionsData.map(contribution => ({
                    id: contribution.id,
                    description: `Contributed KES ${contribution.amount} to ${contribution.campaign}`,
                    link: `/member/campaigns/${contribution.id}`,
                    date: contribution.date,
                }));
                setRecentActivity(activityData);
            } catch (e) {
                setError(e.message);
                setCampaigns(defaultCampaigns);
                setRecentActivity([]); // No fallback for recent activity
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle contribution submission
    const onFinish = async (values) => {
        try {
            const response = await fetch('http://localhost:5000/api/member/contribute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    campaignId: selectedCampaign,
                    amount: contributionAmount,
                }),
            });

            if (response.ok) {
                setContributionSuccess(true);

                // Fetch updated campaigns and contributions
                const [campaignsResponse, contributionsResponse] = await Promise.all([
                    fetch('http://localhost:5000/api/member/campaigns'),
                    fetch('http://localhost:5000/api/member/contributions'),
                ]);

                const [campaignsData, contributionsData] = await Promise.all([
                    campaignsResponse.json(),
                    contributionsResponse.json(),
                ]);

                setCampaigns(campaignsData);

                // Update recent activity with new contribution
                const newActivity = {
                    id: contributionsData.length + 1,
                    description: `Contributed KES ${contributionAmount} to ${campaigns.find(c => c.id === selectedCampaign)?.title}`,
                    link: `/member/campaigns/${selectedCampaign}`,
                    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
                };
                setRecentActivity([newActivity, ...recentActivity]);
            } else {
                setError('Contribution failed. Please try again.');
            }
        } catch (e) {
            setError(e.message);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        setError('Form submission failed. Please check the fields.');
    };

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Limit campaigns based on screen size
    const displayedCampaigns = campaigns.slice(0, isMobile ? 2 : 6);

    // Section styling
    const sectionStyle = {
        padding: isMobile ? '24px 16px' : '32px 24px',
        marginBottom: 24,
        borderBottom: '2px solid #f0f0f0',
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
                {/* Dashboard Header */}
                <div style={{ ...sectionStyle, textAlign: 'center' }}>
                    <Title level={1} style={{
                        color: 'maroon',
                        fontSize: isMobile ? '1.75rem' : '2.5rem',
                        marginBottom: 0,
                    }}>
                        Student Dashboard
                    </Title>
                </div>

                {/* Loading and Error States */}
                {loading && <Alert message="Loading..." type="info" showIcon style={{ marginBottom: 24 }} />}
                {error && <Alert message={`Error: ${error}`} type="error" closable onClose={() => setError(null)} style={{ marginBottom: 24 }} />}
                {contributionSuccess && <Alert message="Contribution successful!" type="success" closable onClose={() => setContributionSuccess(false)} style={{ marginBottom: 24 }} />}

                {/* Active Campaigns */}
                <div style={sectionStyle}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 24,
                    }}>
                        <Title level={3} style={{ color: 'maroon', margin: 0 }}>
                            Active Campaigns
                        </Title>
                        <Link to="/member/campaigns" style={{ color: 'maroon' }}>
                            View All →
                        </Link>
                    </div>

                    <Row gutter={[24, 24]}>
                        {displayedCampaigns.map(campaign => (
                            <Col key={campaign.id} xs={24} md={12} lg={8}>
                                <div style={{
                                    border: '1px solid',
                                    borderRadius: 8,
                                    padding: 16,
                                    marginBottom: 16,
                                }}>
                                    <Title level={4}>
                                        {campaign.title}
                                    </Title>
                                    <Progress
                                        percent={(campaign.raised / campaign.goal) * 100}
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
                                        block
                                        type="primary"
                                        style={{
                                            background: '#b5e487',
                                            borderColor: 'maroon',
                                            color: 'black',
                                            marginTop: 16,
                                        }}
                                    >
                                        Donate Now
                                    </Button>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Quick Contribution */}
                <div style={sectionStyle}>
                    <Title level={3} style={{ color: 'maroon', marginBottom: 24, textAlign: 'center' }}>
                        Quick Contribution
                    </Title>
                    <div style={{ maxWidth: 600, margin: '0 auto' }}>
                        <Form layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                            <Form.Item label={<Text strong>Select Campaign</Text>}>
                                <Select
                                    value={selectedCampaign}
                                    onChange={setSelectedCampaign}
                                    disabled={loading || error}
                                >
                                    {campaigns.map(c => (
                                        <Option key={c.id} value={c.id}>{c.title}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label={<Text strong>Amount (KES)</Text>}>
                                <InputNumber
                                    min={100}
                                    step={100}
                                    value={contributionAmount}
                                    onChange={setContributionAmount}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    block
                                    type="primary"
                                    htmlType="submit"
                                    style={{
                                        background: '#b5e487',
                                        borderColor: 'maroon',
                                        color: 'black',
                                        height: isMobile ? 48 : 40,
                                    }}
                                >
                                    Contribute Now
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>

                {/* Recent Activity */}
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
                        {recentActivity.map(activity => (
                            <div key={activity.id} style={{
                                padding: '12px 0',
                                borderBottom: '1px solid #f0f0f0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <Text style={{ flex: 1 }}>{activity.description}</Text>
                                <Text type="secondary" style={{ marginLeft: 16 }}>
                                    {new Date(activity.date).toLocaleDateString()}
                                </Text>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Announcements */}
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
            </div>
        </MemberLayout>
    );
};

export default MemberDashboardPage;