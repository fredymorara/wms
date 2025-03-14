import React from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { Typography, Row, Col, Card, Statistic } from 'antd';
import {
    DashboardOutlined,
    FundOutlined,
    UsergroupAddOutlined,
    FileTextOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const AdminDashboard = () => {
    // Placeholder data - replace with actual data fetching from backend
    const dashboardMetrics = [
        {
            title: 'Total Active Campaigns',
            value: 15, // Replace with actual count
            icon: <FundOutlined />,
            color: 'maroon',
        },
        {
            title: 'Pending Campaign Approvals',
            value: 3, // Replace with actual count
            icon: <FileTextOutlined />,
            color: '#d46b08', // Example orange-ish color
        },
        {
            title: 'Total System Members',
            value: 520, // Replace with actual count
            icon: <UsergroupAddOutlined />,
            color: '#389e0d', // Example green color
        },
        {
            title: 'Total Funds Raised (All Campaigns)',
            value: 1258500, // Replace with actual sum
            icon: <DashboardOutlined />, // Consider a more financial icon
            color: '#08979c', // Example teal color
        },
    ];

    return (
        <AdminLayout>
            <div style={{ padding: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Title level={2} style={{ color: 'maroon' }}>
                        Admin Dashboard
                    </Title>
                    <Paragraph>
                        Welcome to the Admin Dashboard. Get an overview of the system, monitor key metrics, and manage welfare operations.
                    </Paragraph>
                </div>

                <Row gutter={24}>
                    {dashboardMetrics.map((metric, index) => (
                        <Col xs={24} sm={12} md={6} key={index}>
                            <Card style={{ backgroundColor: '#f7f5f5', borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                <Statistic
                                    title={metric.title}
                                    value={metric.value}
                                    precision={0} // Adjust precision as needed
                                    prefix={metric.icon}
                                    suffix={metric.suffix} // Add suffix if needed (e.g., "+", "%")
                                    valueStyle={{ color: metric.color, fontSize: '1.5rem' }}
                                    style={{ textAlign: 'center' }}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>

                <div style={{ marginTop: '48px', borderTop: '2px solid #f0f0f0', paddingTop: '24px' }}>
                    <Title level={4} style={{ color: 'maroon' }}>
                        Quick Actions
                    </Title>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={8}>
                            <Card
                                hoverable
                                style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                                onClick={() => { /* Implement action - e.g., navigate to campaign creation page */ console.log('Create New Campaign Clicked'); }}
                            >
                                <Card.Meta
                                    avatar={<FundOutlined style={{ fontSize: '24px', color: 'maroon' }} />}
                                    title="Create New Campaign"
                                    description="Initiate a new welfare campaign for students in need."
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Card
                                hoverable
                                style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                                onClick={() => { /* Implement action - e.g., navigate to user management page */ console.log('Manage Users Clicked'); }}
                            >
                                <Card.Meta
                                    avatar={<UsergroupAddOutlined style={{ fontSize: '24px', color: 'maroon' }} />}
                                    title="Manage Users"
                                    description="Add new student accounts or manage existing user access."
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Card
                                hoverable
                                style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                                onClick={() => { /* Implement action - e.g., navigate to pending approvals page */ console.log('Review Pending Approvals Clicked'); }}
                            >
                                <Card.Meta
                                    avatar={<FileTextOutlined style={{ fontSize: '24px', color: 'maroon' }} />}
                                    title="Review Pending Approvals"
                                    description="Process and manage pending campaign approval requests."
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>

                {/* Add more dashboard sections as needed - e.g., Recent Activities, Charts, etc. */}

            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;