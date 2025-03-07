import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, Statistic, Row, Col, Alert, Spin } from 'antd';
import { DollarCircleOutlined, AccountBookOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

function TreasurerDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/treasurer/dashboard');
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

    const defaultDashboardData = {
        totalFunds: 1250000,
        fundsDisbursedThisMonth: 150000,
        pendingDisbursementRequests: 3,
        lowBalanceAlerts: 1,
        recentTransactions: [
            'Contribution of KES 5,000 from Student F',
            'Disbursement of KES 25,000 to Student G for Education Support',
            'Refund of KES 1,000 to Student H due to overpayment',
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
                    Kabarak Student Welfare Management System - Treasurer Dashboard
                </Title>
            </Header>
            <Content style={{ padding: '50px' }}>
                <div className="container">
                    <Title level={2} style={{ color: 'maroon', marginBottom: '20px', textAlign: 'center' }}>Treasurer Dashboard</Title>

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
                                    title="Total Funds Available (KES)"
                                    value={loading || error ? defaultDashboardData.totalFunds : dashboardData.totalFunds}
                                    prefix={<DollarCircleOutlined />}
                                    precision={2}
                                    groupSeparator=","
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Card>
                                <Statistic
                                    title="Funds Disbursed This Month (KES)"
                                    value={loading || error ? defaultDashboardData.fundsDisbursedThisMonth : dashboardData.fundsDisbursedThisMonth}
                                    prefix={<AccountBookOutlined />}
                                    precision={2}
                                    groupSeparator=","
                                />
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card>
                                <Statistic
                                    title="Pending Disbursement Requests"
                                    value={loading || error ? defaultDashboardData.pendingDisbursementRequests : dashboardData.pendingDisbursementRequests}
                                    prefix={<ExclamationCircleOutlined />}
                                    suffix=" requests"
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Low Balance Alerts */}
                    {loading || error ? (defaultDashboardData.lowBalanceAlerts > 0 && (
                        <Alert
                            message={`Low Balance Alert: ${defaultDashboardData.lowBalanceAlerts} campaigns are nearing their target amount. Please review and take action.`}
                            type="warning"
                            showIcon
                            style={{ marginBottom: '20px' }}
                        />
                    ))
                         : dashboardData.lowBalanceAlerts > 0 && (
                         <Alert
                            message={`Low Balance Alert: ${dashboardData.lowBalanceAlerts} campaigns are nearing their target amount. Please review and take action.`}
                            type="warning"
                            showIcon
                            style={{ marginBottom: '20px' }}
                         />
                    )}

                    {/* Recent Transactions */}
                    <Card title="Recent Transactions">
                        <ul>
                            {(loading || error ? defaultDashboardData.recentTransactions : dashboardData.recentTransactions).map((transaction, index) => (
                                <li key={index} style={{ marginBottom: '5px' }}>
                                    {transaction}
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </Content>
        </Layout>
    );
}

export default TreasurerDashboardPage;