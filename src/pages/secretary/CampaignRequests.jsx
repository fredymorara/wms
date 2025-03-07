import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, Table, Input, Button, Alert, Spin, Tag } from 'antd';
import { SearchOutlined, CloseOutlined, CheckCircleOutlined, RollbackOutlined, MessageOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

function CampaignRequestsPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredRequests, setFilteredRequests] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/secretary/campaign-requests');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setRequests(data);
                setFilteredRequests(data);
                setLoading(false);
            } catch (e) {
                setError(e.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const defaultRequests = [
        { id: 1, requester: 'John Doe', title: 'Medical Assistance', amount: 50000, description: 'Help with medical bills', status: 'pending', request_date: '2024-02-01' },
        { id: 2, requester: 'Jane Smith', title: 'Education Support', amount: 25000, description: 'Support education expenses', status: 'pending', request_date: '2024-02-03' },
    ];

    const handleSearch = (value) => {
        setSearchText(value);
        const filteredData = (error ? defaultRequests : requests).filter((request) =>
            request.requester.toLowerCase().includes(value.toLowerCase()) ||
            request.title.toLowerCase().includes(value.toLowerCase()) ||
            request.description.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredRequests(filteredData);
    };

    const clearSearch = () => {
        setSearchText('');
        setFilteredRequests(error ? defaultRequests : requests);
    };

    const handleContactRequester = (record) => {
        console.log(`Contact requester: ${record.requester}`);
        // Implement your logic to contact the requester (e.g., open email client)
    };

    const handleForwardToAdmin = (record) => {
        console.log(`Forward request to admin: ${record.id}`);
        // Implement your logic to forward the request to the admin
    };

    const columns = [
        {
            title: 'Requester',
            dataIndex: 'requester',
            key: 'requester',
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
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
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text) => (
                <Tag color={text === 'pending' ? 'orange' : 'green'} key={text}>
                    {text.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <>
                    <Button type="primary" onClick={() => handleContactRequester(record)} style={{ marginRight: 8 }} disabled={error || loading}>
                        <MessageOutlined /> Contact
                    </Button>
                    <Button type="primary" onClick={() => handleForwardToAdmin(record)} style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }} disabled={error || loading}>
                        <CheckCircleOutlined /> Forward to Admin
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
                    Kabarak Student Welfare Management System - Campaign Requests
                </Title>
            </Header>
            <Content style={{ padding: '50px' }}>
                <div className="container">
                    <Title level={2} style={{ color: 'maroon', marginBottom: '20px', textAlign: 'center' }}>Campaign Requests</Title>
                    <Paragraph style={{ marginBottom: '20px', textAlign: 'center' }}>
                        Review and process incoming campaign requests from members.
                    </Paragraph>

                    {/* Search Input */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div className="flex items-center">
                            <Input
                                placeholder="Search requests"
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => handleSearch(e.target.value)}
                                disabled={error || loading}
                            />
                            {searchText && (
                                <Button
                                    icon={<CloseOutlined />}
                                    onClick={clearSearch}
                                    style={{ marginLeft: 8 }}
                                    disabled={error || loading}
                                />
                            )}
                        </div>
                    </div>

                    {/* Campaign Requests Table */}
                    {loading ? (
                        <div className="text-center">
                            <Spin size="large" />
                            <p className="mt-2">Loading campaign requests...</p>
                        </div>
                    ) : error ? (
                        <>
                            <Alert message={`Error fetching data: ${error}. Displaying default requests.`} type="error" showIcon />
                            <Table
                                columns={columns}
                                dataSource={defaultRequests}
                                rowKey="id"
                                aria-label="Campaign Requests"
                            />
                         </>
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={requests}
                            rowKey="id"
                            aria-label="Campaign Requests"
                        />
                    )}
                </div>
            </Content>
        </Layout>
    );
}

export default CampaignRequestsPage;