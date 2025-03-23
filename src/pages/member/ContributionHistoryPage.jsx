import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Button, Alert, Typography, Card, Table } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import MemberLayout from '../../layout/MemberLayout';
import { API_URL } from '../../services/api';

const { Title, Paragraph, Text } = Typography;

function ContributionHistoryPage() {
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredContributions, setFilteredContributions] = useState([]);
    const [isMobile, setIsMobile] = useState(false);

    // Fetch contributions data with authentication
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Changed API endpoint to /member/my-contributions
                const response = await fetch(`${API_URL}/member/my-contributions`, {
                    headers: getAuthHeaders(),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    // Improved error handling for no contributions
                    if (response.status === 404 && errorData.message === "No contributions found for this user") { // Assuming your backend sends this message for no contributions
                        setContributions([]);
                        setFilteredContributions([]);
                        setError(null); // No error, just no contributions
                    } else {
                        throw new Error(errorData.message || 'Failed to fetch contributions');
                    }
                } else {
                    const data = await response.json();
                    const formattedContributions = data.data.map(contribution => ({ // Access data.data as per your controller response
                        id: contribution._id,
                        campaign: contribution.campaign?.title || 'Unknown Campaign',
                        date: contribution.paymentDate || contribution.createdAt, // Use paymentDate from your model
                        amount: contribution.amount,
                        // receipt: contribution.receiptUrl || '#', // Removed receipt data
                    }));

                    setContributions(formattedContributions);
                    setFilteredContributions(formattedContributions);
                }
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Mobile detection (no changes needed)
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Handle search functionality (no changes needed)
    const handleSearch = (value) => {
        setSearchText(value);
        const filteredData = contributions.filter((contribution) =>
            contribution.campaign.toLowerCase().includes(value.toLowerCase()) ||
            (contribution.date && moment(contribution.date).format('MMMM DD, YYYY').toLowerCase().includes(value.toLowerCase())) ||
            contribution.amount.toString().includes(value)
        );
        setFilteredContributions(filteredData);
    };

    // Clear search input (no changes needed)
    const clearSearch = () => {
        setSearchText('');
        setFilteredContributions(contributions);
    };

    // Table columns (Removed Receipt Column)
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
            render: (text) => (text ? moment(text).format('MMMM DD, YYYY') : 'N/A'),
        },
        {
            title: 'Amount (Ksh)',
            dataIndex: 'amount',
            key: 'amount',
            render: (text) => text.toLocaleString(),
        },
        // Removed Receipt Column definition entirely
    ];

    // Section styling (no changes needed)
    const sectionStyle = {
        padding: isMobile ? '24px 16px' : '32px 24px',
        marginBottom: 24,
        borderBottom: '2px solid #f0f0f0',
    };

    // Render contribution cards (Removed Receipt Button)
    const renderContributionCards = () => {
        if (filteredContributions.length === 0) {
            return (
                <div style={{ padding: '24px', textAlign: 'center', background: '#f9f9f9', borderRadius: 8 }}>
                    <Text type="secondary">
                        You have not made any contributions yet. Start contributing to campaigns to see your activity here.
                    </Text>
                </div>
            );
        }

        return filteredContributions.map((contribution) => (
            <Card
                key={contribution.id}
                style={{
                    marginBottom: 16,
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    padding: isMobile ? '16px' : '24px',
                }}
            >
                <Title level={5} style={{ color: 'maroon', marginBottom: 8 }}>
                    {contribution.campaign}
                </Title>
                <Text strong>Date:</Text> {moment(contribution.date).format('MMMM DD, YYYY')}
                <br />
                <Text strong>Amount:</Text> Ksh {contribution.amount.toLocaleString()}
                <br />
                {/* Removed Receipt Button Conditional Rendering */}
            </Card>
        ));
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
                {/* Contribution History Header (no changes needed) */}
                <div style={{ ...sectionStyle, textAlign: 'center' }}>
                    <Title level={1} style={{
                        color: 'maroon',
                        fontSize: isMobile ? '1.75rem' : '2.5rem',
                        marginBottom: 0,
                    }}>
                        Your Contribution History
                    </Title>
                    <Paragraph style={{ marginBottom: '20px', textAlign: 'center' }}>
                        View your past contributions.
                    </Paragraph>
                </div>

                {/* Loading and Error States (no changes needed) */}
                {loading && <Alert message="Loading..." type="info" showIcon style={{ marginBottom: 24 }} />}
                {error && <Alert message={`Error: ${error}`} type="error" closable onClose={() => setError(null)} style={{ marginBottom: 24 }} />}

                {/* Search Input (no changes needed) */}
                <div style={{ ...sectionStyle, textAlign: 'center' }}>
                    <Input
                        placeholder="Search contributions"
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                        disabled={error || loading}
                        style={{ maxWidth: 600, marginBottom: 16 }}
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

                {/* Contribution History Table or Cards (no changes needed) */}
                <div style={sectionStyle}>
                    {isMobile ? (
                        renderContributionCards()
                    ) : (
                        filteredContributions.length > 0 ? (
                            <Table
                                columns={columns}
                                dataSource={filteredContributions}
                                rowKey="id"
                                aria-label="Contribution History"
                                pagination={{ pageSize: 10 }}
                            />
                        ) : (
                            <div style={{ padding: '24px', textAlign: 'center', background: '#f9f9f9', borderRadius: 8 }}>
                                <Text type="secondary">
                                    You have not made any contributions yet. Start contributing to campaigns to see your activity here.
                                </Text>
                            </div>
                        )
                    )}
                </div>
            </div>
        </MemberLayout>
    );
}

export default ContributionHistoryPage;