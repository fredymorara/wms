import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Button, Alert, Typography, Card, Space, Tag, Divider } from 'antd';
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
                const response = await fetch(`${API_URL}/member/my-contributions`, {
                    headers: getAuthHeaders(),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    if (response.status === 404 && errorData.message === "No contributions found for this user") {
                        setContributions([]);
                        setFilteredContributions([]);
                        setError(null);
                    } else {
                        throw new Error(errorData.message || 'Failed to fetch contributions');
                    }
                } else {
                    const data = await response.json();
                    const completedContributions = data.data
                        .filter(contribution => contribution.status === 'completed')
                        .map(contribution => ({
                            id: contribution._id,
                            campaign: contribution.campaign?.title || 'Unknown Campaign',
                            date: contribution.paymentDate || contribution.createdAt,
                            amount: contribution.amount,
                            paymentMethod: contribution.paymentMethod,
                            mpesaCode: contribution.mpesaCode,
                            transactionId: contribution.transactionId,
                            status: contribution.status
                        }));

                    setContributions(completedContributions);
                    setFilteredContributions(completedContributions);
                }
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleSearch = (value) => {
        setSearchText(value);
        const filteredData = contributions.filter((contribution) =>
            contribution.campaign.toLowerCase().includes(value.toLowerCase()) ||
            (contribution.date && moment(contribution.date).format('MMMM DD, YYYY').toLowerCase().includes(value.toLowerCase())) ||
            contribution.amount.toString().includes(value) ||
            (contribution.mpesaCode && contribution.mpesaCode.toLowerCase().includes(value.toLowerCase()))
        );
        setFilteredContributions(filteredData);
    };

    const clearSearch = () => {
        setSearchText('');
        setFilteredContributions(contributions);
    };

    const sectionStyle = {
        padding: isMobile ? '24px 16px' : '32px 24px',
        marginBottom: 24,
        borderBottom: '2px solid #f0f0f0',
    };

    const renderContributionCards = () => {
        if (filteredContributions.length === 0) {
            return (
                <div style={{ padding: '24px', textAlign: 'center', background: '#f9f9f9', borderRadius: 8 }}>
                    <Text type="secondary">
                        {loading ? 'Loading...' : 'You have not made any completed contributions yet.'}
                    </Text>
                </div>
            );
        }

        return (
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {filteredContributions.map((contribution) => (
                    <Card
                        key={contribution.id}
                        style={{
                            width: '100%',
                            borderRadius: 8,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            border: '1px solid green'
                        }}
                        bodyStyle={{ padding: isMobile ? '16px' : '24px' }}
                    >
                        <Row gutter={16} align="middle">
                            <Col xs={24} sm={12} md={8}>
                                <Title level={5} style={{ color: 'maroon', marginBottom: 8 }}>
                                    {contribution.campaign}
                                </Title>
                                <Text type="secondary">
                                    {moment(contribution.date).format('MMMM DD, YYYY')}
                                </Text>
                            </Col>

                            <Col xs={24} sm={12} md={8}>
                                <Space direction="vertical" size="small">
                                    <div>
                                        <Text strong>Amount: </Text>
                                        <Text>Ksh {contribution.amount.toLocaleString()}</Text>
                                    </div>
                                    <div>
                                        <Text strong>Method: </Text>
                                        <Text>{contribution.paymentMethod}</Text>
                                    </div>
                                </Space>
                            </Col>

                            <Col xs={24} sm={24} md={8}>
                                <Space direction="vertical" size="small">
                                    {contribution.mpesaCode && (
                                        <div>
                                            <Text strong>M-Pesa Code: </Text>
                                            <Tag color="green">{contribution.mpesaCode}</Tag>
                                        </div>
                                    )}
                                    <div>
                                        <Text strong>Status: </Text>
                                        <Tag color="success">Completed</Tag>
                                    </div>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                ))}
            </Space>
        );
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
                <div style={{ ...sectionStyle, textAlign: 'center' }}>
                    <Title level={1} style={{
                        color: 'maroon',
                        fontSize: isMobile ? '1.75rem' : '2.5rem',
                        marginBottom: 0,
                    }}>
                        Your Contribution History
                    </Title>
                    <Paragraph style={{ marginBottom: '20px', textAlign: 'center' }}>
                        View your completed contributions.
                    </Paragraph>
                </div>

                {loading && <Alert message="Loading..." type="info" showIcon style={{ marginBottom: 24 }} />}
                {error && <Alert message={`Error: ${error}`} type="error" closable onClose={() => setError(null)} style={{ marginBottom: 24 }} />}

                <div style={{ ...sectionStyle, textAlign: 'center' }}>
                    <Input
                        placeholder="Search contributions by campaign, date, amount or M-Pesa code"
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

                <div style={sectionStyle}>
                    {renderContributionCards()}
                </div>
            </div>
        </MemberLayout>
    );
}

export default ContributionHistoryPage;