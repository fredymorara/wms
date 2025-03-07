import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Alert, Spin, Layout, Typography } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

function ContributionHistoryPage() {
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredContributions, setFilteredContributions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/member/contributions');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setContributions(data);
                setFilteredContributions(data);
                setLoading(false);
            } catch (e) {
                setError(e.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const defaultContributions = [
        { id: 1, campaign: 'Default Medical Fund for Student A', date: '2023-11-15', amount: 5000, receipt: '#' },
        { id: 2, campaign: 'Default Education Support for Student B', date: '2023-10-28', amount: 2000, receipt: '#' },
    ];

    const handleSearch = (value) => {
        setSearchText(value);
        const filteredData = (error ? defaultContributions : contributions).filter((contribution) =>
            contribution.campaign.toLowerCase().includes(value.toLowerCase()) ||
            (contribution.date && moment(contribution.date).format('MMMM DD, YYYY').toLowerCase().includes(value.toLowerCase())) ||
            contribution.amount.toString().includes(value)
        );
        setFilteredContributions(filteredData);
    };

    const clearSearch = () => {
        setSearchText('');
        setFilteredContributions(error ? defaultContributions : contributions);
    };

    const columns = [
        {
            title: 'Campaign',
            dataIndex: 'campaign',
            key: 'campaign',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (text) => text ? moment(text).format('MMMM DD, YYYY') : 'N/A',
        },
        {
            title: 'Amount (Ksh)',
            dataIndex: 'amount',
            key: 'amount',
            render: (text) => text.toLocaleString(),
        },
        {
            title: 'Receipt',
            key: 'receipt',
            render: (text, record) => (
                record.receipt ? (
                    <Button type="link" href={record.receipt} target="_blank" rel="noopener noreferrer" disabled={error} style={{ color: 'maroon' }}>
                        View Receipt
                    </Button>
                ) : (
                    'N/A'
                )
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
                    Kabarak Student Welfare Management System
                </Title>
            </Header>
            <Content style={{ padding: '50px' }}>
                <div className="container">
                    <Title level={2} style={{ color: 'maroon', marginBottom: '20px', textAlign: 'center' }}>Your Contribution History</Title>

                    {/* Search Input */}
                    <div className="mb-4 flex items-center">
                        <Input
                            placeholder="Search contributions"
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => handleSearch(e.target.value)}
                            disabled={error}
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

                    {/* Contribution History Table */}
                    {loading ? (
                        <div className="text-center">
                            <Spin size="large" />
                            <p className="mt-2">Loading contribution history...</p>
                        </div>
                    ) : error ? (
                        <Alert message={`Error fetching data: ${error}. Displaying default history.`} type="error" showIcon />
                    ) : (
                        <>
                            {filteredContributions.length === 0 && searchText ? (
                                <p>No contributions found matching your search.</p>
                            ) : (
                                <Table
                                    columns={columns}
                                    dataSource={filteredContributions}
                                    rowKey="id"
                                    aria-label="Contribution History"
                                />
                            )}
                        </>
                    )}
                    {error && (
                        <Table
                            columns={columns}
                            dataSource={defaultContributions}
                            rowKey="id"
                            aria-label="Contribution History"
                        />
                    )}
                </div>
            </Content>
        </Layout>
    );
}

export default ContributionHistoryPage;