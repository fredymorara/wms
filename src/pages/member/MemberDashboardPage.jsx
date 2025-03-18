import React, { useState, useEffect } from 'react';
import { Row, Col, Progress, Button, Statistic, InputNumber, Form, Select, Alert, Typography } from 'antd';
import { Link } from 'react-router-dom';
import MemberLayout from '../../layout/MemberLayout';
import { API_URL } from '../../services/api';

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

    // Fetch data from the server
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // Good practice
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            // Fetch campaigns
            try {
                const campaignsResponse = await fetch(`${API_URL}/member/campaigns`, {
                    headers: getAuthHeaders()
                });

                if (campaignsResponse.ok) {
                    const campaignsData = await campaignsResponse.json();
                    console.log("Raw API data:", campaignsData);

                    const formattedCampaigns = campaignsData.map(campaign => ({
                        id: campaign._id,
                        title: campaign.title,
                        category: campaign.category,
                        goal: campaign.goalAmount,
                        raised: campaign.currentAmount,
                        description: campaign.description,
                        endDate: campaign.endDate,
                        status: campaign.status,
                    }));

                    setCampaigns(formattedCampaigns);
                    setSelectedCampaign(formattedCampaigns[0]?.id || null);
                } else {
                    console.error("Campaign fetch failed with status:", campaignsResponse.status);
                    setError("Failed to load campaigns");
                }
            } catch (e) {
                console.error("Error fetching campaigns:", e);
                setError("Error loading campaigns: " + e.message);
            }

            // Fetch contributions with better error handling
            try {
                const contributionsResponse = await fetch(`${API_URL}/member/contributions`, {
                    headers: getAuthHeaders()
                });

                if (contributionsResponse.ok) {
                    const contributionsData = await contributionsResponse.json();

                    const activityData = contributionsData.map(contribution => ({
                        id: contribution._id,
                        description: `Contributed KES ${contribution.amount} to ${contribution.campaign?.title}`,
                        date: contribution.date || contribution.createdAt,
                    }));
                    setRecentActivity(activityData);
                } else {
                    // Parse the error response
                    const errorData = await contributionsResponse.json();
                    console.log("Contributions error:", errorData);

                    // Check if it's the "Contribution is not defined" error
                    if (errorData.error === "Contribution is not defined") {
                        console.log("No contributions yet - this is expected for new users");
                        setRecentActivity([]);  // Set empty array for new users
                    } else {
                        console.error("Contributions fetch failed:", errorData.message);
                        setRecentActivity([]);
                    }
                }
            } catch (e) {
                console.error("Error fetching contributions:", e);
                setRecentActivity([]);
            }

            setLoading(false);
        };

        fetchData();
    }, []);

    // Handle contribution submission
    // Handle contribution submission
    const onFinish = async (values) => {
        try {
            const response = await fetch(`${API_URL}/member/contribute`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    campaignId: selectedCampaign,
                    amount: contributionAmount,
                }),
            });

            if (response.ok) {
                setContributionSuccess(true);

                // Get the selected campaign info from our local state
                const selectedCampaignInfo = campaigns.find(c => c.id === selectedCampaign);

                // Create a new activity entry directly without fetching from the API
                const newActivity = {
                    id: Date.now(), // Temporary ID until we refresh
                    description: `Contributed KES ${contributionAmount} to ${selectedCampaignInfo?.title || 'a campaign'}`,
                    date: new Date().toISOString(),
                };

                // Update local state with the new activity
                setRecentActivity(prev => [newActivity, ...prev]);

                // Refresh campaign data to show updated amounts
                try {
                    const campaignsResponse = await fetch(`${API_URL}/member/campaigns`, {
                        headers: getAuthHeaders()
                    });

                    if (campaignsResponse.ok) {
                        const campaignsData = await campaignsResponse.json();

                        const formattedCampaigns = campaignsData.map(campaign => ({
                            id: campaign._id,
                            title: campaign.title,
                            category: campaign.category,
                            goal: campaign.goalAmount,
                            raised: campaign.currentAmount,
                            description: campaign.description,
                            endDate: campaign.endDate,
                            status: campaign.status,
                        }));

                        setCampaigns(formattedCampaigns);
                    }
                } catch (e) {
                    console.error("Error refreshing campaigns after contribution:", e);
                }
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Contribution failed');
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
                        {campaigns.length > 0 ? (
                            displayedCampaigns.map(campaign => (
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
                                        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
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
                            ))
                        ) : (
                            <Col span={24}>
                                <Alert
                                    message="No active campaigns"
                                    description="There are currently no active campaigns to display."
                                    type="info"
                                />
                            </Col>
                        )
                        }
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
                        )
                        }
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