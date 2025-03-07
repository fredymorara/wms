import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Progress, Button, Statistic, InputNumber, Form, Select, Alert, Typography, Layout } from 'antd';
import { FundViewOutlined, HistoryOutlined, MessageOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Option } = Select;
const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const MemberDashboardPage = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [contributionAmount, setContributionAmount] = useState(100);
    const [contributionSuccess, setContributionSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const campaignsResponse = await fetch('http://localhost:5000/api/member/campaigns');
                if (!campaignsResponse.ok) {
                    throw new Error(`HTTP error! status: ${campaignsResponse.status}`);
                }
                const campaignsData = await campaignsResponse.json();
                setCampaigns(campaignsData);
                setSelectedCampaign(campaignsData[0]?.id || null);

                const activityResponse = await fetch('/api/member/activity');
                if (!activityResponse.ok) {
                    throw new Error(`HTTP error! status: ${activityResponse.status}`);
                }
                const activityData = await activityResponse.json();
                setRecentActivity(activityData);

                setLoading(false);
            } catch (e) {
                setError(e.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const defaultCampaigns = [
        {
            id: 1,
            title: 'Default Medical Fund for John',
            progress: 60,
            description: 'Help John with his default medical expenses',
            link: '/member/campaigns/1',
            target: 100000,
            raised: 60000,
            contributors: 45,
        },
        {
            id: 2,
            title: 'Default Education Fund for Jane',
            progress: 80,
            description: 'Support Jane\'s default education journey',
            link: '/member/campaigns/2',
            target: 50000,
            raised: 40000,
            contributors: 62,
        },
    ];

    const defaultRecentActivity = [
        { id: 1, description: 'Default activity: Contributed KES 500 to Medical Fund for John', link: '/member/campaigns/1' },
        { id: 2, description: 'Default activity: Viewed Education Fund for Jane campaign', link: '/member/campaigns/2' },
    ];

    const onFinish = async (values) => {
        try {
            const response = await fetch('http://localhost:5000/api/member/contribute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    campaignId: selectedCampaign,
                    amount: contributionAmount,
                }),
            });

            if (response.ok) {
                setContributionSuccess(true);
                const campaignsResponse = await fetch('/api/member/campaigns');
                const campaignsData = await campaignsResponse.json();
                setCampaigns(campaignsData);
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
                    Kabarak Student Welfare Management System
                </Title>
            </Header>
            <Content style={{ padding: '20px' }}> {/* Reduced padding for smaller screens */}
                <div className="container">
                    <Title level={2} style={{ color: 'maroon', marginBottom: '20px', textAlign: 'center' }}>Member Dashboard</Title>

                    {loading && <p>Loading...</p>}
                    {error && <Alert message={`Error fetching data: ${error}. Displaying default data.`} type="error" closable onClose={() => setError(null)} style={{ marginBottom: '20px' }} />}
                    {contributionSuccess && (
                        <Alert
                            message="Contribution successful!"
                            type="success"
                            closable
                            onClose={() => setContributionSuccess(false)}
                            style={{ marginBottom: '20px' }}
                        />
                    )}

                    {(!loading && !error) ? (
                        <>
                            <Card title={<Title level={4}>Active Campaigns</Title>} extra={<Link to="/member/campaigns">View All</Link>} className="mb-4">
                                <div className="overflow-x-auto">
                                    <Row gutter={[16, 16]} style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}> {/* Added flexWrap: 'wrap' */}
                                        {campaigns.map((campaign) => (
                                            <Col key={campaign.id} xs={24} sm={12} md={8} lg={6} style={{ marginBottom: '16px' }}> {/* Added responsive breakpoints */}
                                                <Card
                                                    title={campaign.title}
                                                    actions={[
                                                        <Link to={`/member/campaigns/${campaign.id}`} key="donate">
                                                            <Button type="primary" style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}>Donate</Button>
                                                        </Link>,
                                                    ]}
                                                >
                                                    <Paragraph>{campaign.description}</Paragraph>
                                                    <Progress percent={(campaign.raised / campaign.target) * 100} size="small" strokeColor="maroon" />
                                                    <Statistic title="Target" value={campaign.target} prefix="KES" groupSeparator="," />
                                                    <Statistic title="Raised" value={campaign.raised} prefix="KES" groupSeparator="," />
                                                    <Statistic title="Contributors" value={campaign.contributors} suffix="people" />
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            </Card>

                            <Card title={<Title level={4}>Quick Contribution</Title>} className="mb-4">
                                <Form
                                    name="quickContribution"
                                    initialValues={{ remember: true, }}
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                    autoComplete="off"
                                    layout="vertical"
                                >
                                    <Form.Item
                                        label={<Title level={5}>Select Campaign</Title>}
                                    >
                                        <Select
                                            value={selectedCampaign}
                                            onChange={setSelectedCampaign}
                                            disabled={campaigns.length === 0}
                                            style={{ width: '100%' }}  // Ensure full width on smaller screens
                                        >
                                            {campaigns.map(campaign => (
                                                <Option value={campaign.id} key={campaign.id}>{campaign.title}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        label={<Title level={5}>Contribution Amount (KES)</Title>}
                                    >
                                        <InputNumber
                                            defaultValue={contributionAmount}
                                            formatter={(value) => `KES ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value) => value.replace(/\KES\s?|(,*)/g, '')}
                                            onChange={setContributionAmount}
                                            style={{ width: '100%' }}  // Ensure full width on smaller screens
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" disabled={campaigns.length === 0} style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white', width: '100%' }}>Contribute Now</Button> {/* Full width button */}
                                    </Form.Item>
                                </Form>
                            </Card>

                            <Card title={<Title level={4}>Recent Activity</Title>} extra={<Link to="/member/history">View All</Link>}>
                                <ul>
                                    {recentActivity.map(activity => (
                                        <li key={activity.id} className="mb-2">
                                            <Link to={activity.link} style={{ color: 'maroon' }}>
                                                {activity.description}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </Card>

                            <Card title={<Title level={4}>Announcements</Title>} icon={<MessageOutlined />} >
                                <Paragraph>Welcome to the Student Welfare System! Check out our active campaigns and support your fellow students.</Paragraph>
                            </Card>
                        </>
                    ) : (
                        <>
                            <Card title={<Title level={4}>Active Campaigns</Title>} extra={<Link to="/member/campaigns">View All</Link>} className="mb-4">
                                <div className="overflow-x-auto">
                                    <Row gutter={[16, 16]} style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>  {/* Added flexWrap: 'wrap' */}
                                        {defaultCampaigns.map((campaign) => (
                                            <Col key={campaign.id} xs={24} sm={12} md={8} lg={6} style={{ marginBottom: '16px' }}> {/* Added responsive breakpoints */}
                                                <Card
                                                    title={campaign.title}
                                                    actions={[
                                                        <Link to={`/member/campaigns/${campaign.id}`} key="donate">
                                                            <Button type="primary" style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}>Donate</Button>
                                                        </Link>,
                                                    ]}
                                                >
                                                    <Paragraph>{campaign.description}</Paragraph>
                                                    <Progress percent={(campaign.raised / campaign.target) * 100} size="small" strokeColor="maroon" />
                                                    <Statistic title="Target" value={campaign.target} prefix="KES" groupSeparator="," />
                                                    <Statistic title="Raised" value={campaign.raised} prefix="KES" groupSeparator="," />
                                                    <Statistic title="Contributors" value={campaign.contributors} suffix="people" />
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            </Card>

                            <Card title={<Title level={4}>Quick Contribution</Title>} className="mb-4">
                                <Form
                                    name="quickContribution"
                                    initialValues={{ remember: true, }}
                                    onFinish={() => { }}
                                    onFinishFailed={() => { }}
                                    autoComplete="off"
                                    layout="vertical"
                                >
                                    <Form.Item
                                        label={<Title level={5}>Select Campaign</Title>}
                                    >
                                        <Select
                                            defaultValue={defaultCampaigns[0].id}
                                            disabled
                                            style={{ width: '100%' }} // Ensure full width on smaller screens
                                        >
                                            {defaultCampaigns.map(campaign => (
                                                <Option value={campaign.id} key={campaign.id}>{campaign.title}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        label={<Title level={5}>Contribution Amount (KES)</Title>}
                                    >
                                        <InputNumber
                                            defaultValue={100}
                                            formatter={(value) => `KES ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value) => value.replace(/\KES\s?|(,*)/g, '')}
                                            disabled
                                            style={{ width: '100%' }}  // Ensure full width on smaller screens
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" disabled style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white', width: '100%' }}>Contribute Now</Button> {/* Full width button */}
                                    </Form.Item>
                                </Form>
                            </Card>

                            <Card title={<Title level={4}>Recent Activity</Title>} extra={<Link to="/member/history">View All</Link>}>
                                <ul>
                                    {defaultRecentActivity.map(activity => (
                                        <li key={activity.id} className="mb-2">
                                            <Link to={activity.link} style={{ color: '#b5e487' }}>
                                                {activity.description}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </Card>

                            <Card title={<Title level={4}>Announcements</Title>} icon={<MessageOutlined />} >
                                <Paragraph>Welcome to the Student Welfare System! Check out our active campaigns and support your fellow students.</Paragraph>
                            </Card>
                        </>
                    )}
                </div>
            </Content>
        </Layout>
    );
};

export default MemberDashboardPage;