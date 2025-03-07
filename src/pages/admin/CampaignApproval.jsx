import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, Table, Button, Input, Form, Alert, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

function CampaignApprovalPage() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/admin/campaigns/pending');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCampaigns(data);
                setLoading(false);
            } catch (e) {
                setError(e.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const defaultCampaigns = [
        { id: 1, title: 'Default Medical Campaign', beneficiary: 'John Doe', amount: 50000, description: 'Help John with his medical bills', request_date: '2024-01-20' },
        { id: 2, title: 'Default Education Campaign', beneficiary: 'Jane Smith', amount: 25000, description: 'Support Jane\'s education', request_date: '2024-01-22' },
    ];

    const handleApprove = async (record) => {
        console.log(`Approve campaign: ${record.id}`);
        // Implement your API call to approve the campaign
    };

    const handleReject = async (record) => {
        console.log(`Reject campaign: ${record.id}`);
        // Implement your API call to reject the campaign
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Beneficiary',
            dataIndex: 'beneficiary',
            key: 'beneficiary',
        },
        {
            title: 'Amount (Ksh)',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Request Date',
            dataIndex: 'request_date',
            key: 'request_date',
            render: (text) => text ? moment(text).format('MMMM DD, YYYY') : 'N/A',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <>
                    <Button type="primary" onClick={() => handleApprove(record)} style={{ backgroundColor: 'green', borderColor: 'green', color: 'white', marginRight: 8 }} disabled={error || loading}>
                        <CheckCircleOutlined /> Approve
                    </Button>
                    <Button type="primary" onClick={() => handleReject(record)} style={{ backgroundColor: 'red', borderColor: 'red', color: 'white' }} disabled={error || loading}>
                        <CloseCircleOutlined /> Reject
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
                    Kabarak Student Welfare Management System - Campaign Approval
                </Title>
            </Header>
            <Content style={{ padding: '50px' }}>
                <div className="container">
                    <Title level={2} style={{ color: 'maroon', marginBottom: '20px', textAlign: 'center' }}>Campaign Approval</Title>
                    <Paragraph style={{ marginBottom: '20px', textAlign: 'center' }}>
                        Review and approve or reject pending campaign requests.
                    </Paragraph>

                    {loading  ? (
                        <div className="text-center">
                            <Spin size="large" />
                            <p className="mt-2">Loading campaign requests...</p>
                        </div>
                    ) : error || campaigns.lenght ===0? (
                    <>
                        <Alert message={`Error fetching data: ${error}. Displaying default campaigns.`} type="error" showIcon />
                         <Table
                            columns={columns}
                            dataSource={defaultCampaigns}
                            rowKey="id"
                            aria-label="Campaign Approval"
                        />
                    </>
                      ) :(
                        <Table
                            columns={columns}
                            dataSource={campaigns}
                            rowKey="id"
                            aria-label="Campaign Approval"
                        />
                    )}
                </div>
            </Content>
        </Layout>
    );
}

export default CampaignApprovalPage;