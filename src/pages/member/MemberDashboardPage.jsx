// src/pages/member/MemberDashboardPage.jsx
import React from 'react';
import { Card, Col, Row, Progress, Button } from 'antd';
import { FundViewOutlined, HistoryOutlined, MessageOutlined } from '@ant-design/icons';

const MemberDashboardPage = () => {
    // Mock campaign data
    const campaigns = [
        {
            id: 1,
            title: 'Medical Fund for John',
            progress: 60, // Percentage
            description: 'Help John with his medical expenses',
            link: '/member/campaigns/1',
        },
        {
            id: 2,
            title: 'Education Fund for Jane',
            progress: 80,
            description: 'Support Jane\'s education journey',
            link: '/member/campaigns/2',
        },
        {
            id: 3,
            title: 'Emergency Relief Fund',
            progress: 40,
            description: 'Help students in emergency situations',
            link: '/member/campaigns/3',
        },
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Member Dashboard</h1>

            {/* Active Campaigns */}
            <Card title="Active Campaigns" extra={<a href="/member/campaigns">View All</a>} className="mb-4">
                <Row gutter={[16, 16]}>
                    {campaigns.map((campaign) => (
                        <Col span={24} md={12} lg={8} key={campaign.id}>
                            <Card
                                title={campaign.title}
                                actions={[
                                    <Button type="primary" key="donate" href={campaign.link}>
                                        Donate
                                    </Button>,
                                ]}
                            >
                                <p>{campaign.description}</p>
                                <Progress percent={campaign.progress} size="small" />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card>

            {/* Quick Contribution */}
            <Card title="Quick Contribution" className="mb-4">
                <p>Select a campaign to contribute to:</p>
                {/* Add a form/select element to choose a campaign, and a contribution amount input */}
                <Button type="primary" >Contribute</Button>
                <br />
                <p>This button doesn't do anything because it needs a backend to function</p>
            </Card>

            {/* Recent Activity Summary */}
            <Card title="Recent Activity" extra={<a href="/member/history">View All</a>}>
                <ul>
                    <li>Contributed KES 500 to Medical Fund for John</li>
                    <li>Viewed Education Fund for Jane campaign</li>
                    <li>Updated profile settings</li>
                    {/* Add more recent activity items here */}
                </ul>
            </Card>

            {/* System Announcements */}
            <Card title="Announcements" icon={<MessageOutlined />}>
                <p>Welcome to the Student Welfare System! Check out our active campaigns and support your fellow students.</p>
                {/* Add more system announcement items here */}
            </Card>
        </div>
    );
};

export default MemberDashboardPage;