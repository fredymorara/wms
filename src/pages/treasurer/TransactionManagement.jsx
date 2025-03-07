import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, Table, Input, Button, Select, DatePicker, Alert, Spin, Tag } from 'antd';
import { SearchOutlined, CloseOutlined, CheckCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;
const { Option } = Select;

function TransactionManagementPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [transactionTypeFilter, setTransactionTypeFilter] = useState(null);
    const [campaignFilter, setCampaignFilter] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/treasurer/transactions');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTransactions(data);
                setFilteredTransactions(data);
                setLoading(false);
            } catch (e) {
                setError(e.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const defaultTransactions = [
        { id: 1, date: '2024-02-01', user: 'Student I', campaign: 'Medical Assistance', type: 'contribution', amount: 5000, payment_method: 'M-Pesa', status: 'verified' },
        { id: 2, date: '2024-02-03', user: 'Student J', campaign: 'Education Support', type: 'disbursement', amount: 25000, payment_method: 'Bank Transfer', status: 'processed' },
    ];

    const handleSearch = (value) => {
        setSearchText(value);
        const filteredData = (error ? defaultTransactions : transactions).filter((transaction) =>
            transaction.user.toLowerCase().includes(value.toLowerCase()) ||
            transaction.campaign.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredTransactions(filteredData);
    };

    const clearSearch = () => {
        setSearchText('');
        setFilteredTransactions(error ? defaultTransactions : transactions);
    };

    const handleTransactionTypeFilter = (value) => {
        setTransactionTypeFilter(value);
    };

    const handleCampaignFilter = (value) => {
        setCampaignFilter(value);
    };

    const handleVerifyMpesa = (record) => {
        console.log(`Verify M-Pesa transaction: ${record.id}`);
        // Implement your logic to verify the M-Pesa transaction
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (text) => text ? moment(text).format('MMMM DD, YYYY') : 'N/A',
        },
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
        },
        {
            title: 'Campaign',
            dataIndex: 'campaign',
            key: 'campaign',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (text) => (
                <Tag color={text === 'contribution' ? 'green' : (text === 'disbursement' ? 'blue' : 'orange')} key={text}>
                    {text.toUpperCase()}
                </Tag>
            ),
            filters: [
                { text: 'Contribution', value: 'contribution' },
                { text: 'Disbursement', value: 'disbursement' },
                { text: 'Refund', value: 'refund' },
            ],
            onFilter: (value, record) => record.type === value,
        },
        {
            title: 'Amount (Ksh)',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Payment Method',
            dataIndex: 'payment_method',
            key: 'payment_method',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
             render: (text, record) => (
                  <Tag color={text === 'verified' ? 'green' : 'volcano'} key={text}>
                       {text.toUpperCase()}
                  </Tag>
             ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <>
                    {record.payment_method === 'M-Pesa' && record.status !== 'verified' && (
                        <Button type="primary" onClick={() => handleVerifyMpesa(record)} style={{ backgroundColor: 'green', borderColor: 'green', color: 'white', marginRight: 8 }} disabled={error || loading}>
                            <CheckCircleOutlined /> Verify
                        </Button>
                    )}

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
                    Kabarak Student Welfare Management System - Transaction Management
                </Title>
            </Header>
            <Content style={{ padding: '50px' }}>
                <div className="container">
                    <Title level={2} style={{ color: 'maroon', marginBottom: '20px', textAlign: 'center' }}>Transaction Management</Title>
                    <Paragraph style={{ marginBottom: '20px', textAlign: 'center' }}>
                        List and manage transactions, including contributions, disbursements, and refunds.
                    </Paragraph>

                    {/* Search and Filters */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div className="flex items-center">
                            <Input
                                placeholder="Search transactions"
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

                    {/* Transaction List Table */}
                    {loading ? (
                        <div className="text-center">
                            <Spin size="large" />
                            <p className="mt-2">Loading transactions...</p>
                        </div>
                    ) : error ? (
                          <>
                            <Alert message={`Error fetching data: ${error}. Displaying default transactions.`} type="error" showIcon />
                            <Table
                                columns={columns}
                                dataSource={defaultTransactions}
                                rowKey="id"
                                aria-label="Transaction List"
                            />
                          </>
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={transactions}
                            rowKey="id"
                            aria-label="Transaction List"
                            onChange={(pagination, filters) => {
                                if (filters.type) {
                                    handleTransactionTypeFilter(filters.type[0]);
                                } else {
                                    handleTransactionTypeFilter(null);
                                }
                            }}
                        />
                    )}
                </div>
            </Content>
        </Layout>
    );
}

export default TransactionManagementPage;