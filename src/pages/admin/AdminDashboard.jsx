import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, Statistic, Row, Col, Button, Alert, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { UsergroupAddOutlined, FundOutlined, CheckCircleOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

function AdminDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/admin/dashboard');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setDashboardData(data);
                setLoading(false);
            } catch (e) {
                setError(e.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Mock dashboard data (replace with actual API response)
    const defaultDashboardData = {
        totalMembers: 150,
        activeCampaigns: 10,
        fundsRaised: 750000,
        pendingCampaigns: 3,
        pendingDisbursements: 2,
        recentActivity: [
            'New member joined the system',
            'Campaign "Medical Fund for John" approved',
            'Disbursement of KES 10,000 for campaign "Education Support for Jane"',
        ],
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
                    Kabarak Student Welfare Management System - Admin Dashboard
                </Title>
            </Header>
            <Content style={{ padding: '50px' }}>
                <div className="container">
                    <Title level={2} style={{ color: 'maroon', marginBottom: '20px', textAlign: 'center' }}>Admin Dashboard</Title>

                    {loading ? (
                        <div className="text-center">
                            <Spin size="large" />
                            <p className="mt-2">Loading dashboard data...</p>
                        </div>
                    ) : error ? (
                        <Alert message={`Error fetching data: ${error}. Displaying default data.`} type="error" showIcon />
                    ) : null}

                    {/* Key Metrics */}
                    <Row gutter={[24, 24]} style={{ marginBottom: '20px' }}>
                        <Col xs={24} sm={12} md={8}>
                            <Card>
                                <Statistic
                                    title="Total Members"
                                    value={loading || error ? defaultDashboardData.totalMembers : dashboardData.totalMembers}
                                    prefix={<UsergroupAddOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Card>
                                <Statistic
                                    title="Active Campaigns"
                                    value={loading || error ? defaultDashboardData.activeCampaigns : dashboardData.activeCampaigns}
                                    prefix={<FundOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card>
                                <Statistic
                                    title="Funds Raised (KES)"
                                    value={loading || error ? defaultDashboardData.fundsRaised : dashboardData.fundsRaised}
                                    prefix="KES"
                                    precision={2}
                                    groupSeparator=","
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Pending Actions */}
                    <Row gutter={[24, 24]} style={{ marginBottom: '20px' }}>
                        <Col xs={24} sm={12}>
                            <Card
                                title="Pending Campaign Approvals"
                                extra={<Link to="/admin/campaigns/pending">View All</Link>}
                                style={{ borderColor: 'orange' }}
                            >
                                <Statistic
                                    value={loading || error ? defaultDashboardData.pendingCampaigns : dashboardData.pendingCampaigns}
                                    prefix={<ExclamationCircleOutlined style={{ color: 'orange' }} />}
                                    suffix=" campaigns"
                                />
                                <Button type="primary" style={{ marginTop: '10px', backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}>
                                    <Link to="/admin/campaigns/pending">Approve Campaigns</Link>
                                </Button>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Card
                                title="Pending Disbursement Requests"
                                extra={<Link to="/admin/funds/disbursements">View All</Link>}
                                style={{ borderColor: 'red' }}
                            >
                                <Statistic
                                    value={loading || error ? defaultDashboardData.pendingDisbursements : dashboardData.pendingDisbursements}
                                    prefix={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                                    suffix=" requests"
                                />
                                <Button type="primary" style={{ marginTop: '10px', backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}>
                                    <Link to="/admin/funds/disbursements">Process Disbursements</Link>
                                </Button>
                            </Card>
                        </Col>
                    </Row>

                    {/* Quick Links */}
                    <Card title="Quick Links" style={{ marginBottom: '20px' }}>
                        <Button type="primary" style={{ marginRight: '10px', marginBottom: '10px', backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}>
                            <Link to="/admin/users/add"><PlusOutlined /> Add New Student</Link>
                        </Button>
                        <Button type="primary" style={{ marginRight: '10px', marginBottom: '10px', backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}>
                            <Link to="/admin/campaigns/pending"><CheckCircleOutlined /> Approve Campaign</Link>
                        </Button>
                        <Button type="primary" style={{ marginRight: '10px', marginBottom: '10px', backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}>
                            <Link to="/admin/funds/disbursements"><FundOutlined /> Process Disbursement</Link>
                        </Button>
                    </Card>

                    {/* Recent Activity */}
                    <Card title="Recent Welfare-Related Activity">
                        <ul>
                            {(loading || error ? defaultDashboardData.recentActivity : dashboardData.recentActivity).map((activity, index) => (
                                <li key={index} style={{ marginBottom: '5px' }}>
                                    {activity}
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </Content>
        </Layout>
    );
}

export default AdminDashboardPage;