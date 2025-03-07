import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, Table, Select, DatePicker, Button, Alert, Spin, Form } from 'antd';
import moment from 'moment';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;
const { Option } = Select;

function ReportsAndDocumentationPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [campaignReports, setCampaignReports] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/secretary/reports');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCampaignReports(data);
                setLoading(false);
            } catch (e) {
                setError(e.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const defaultCampaignReports = [
        { id: 1, campaign: 'Default Medical Campaign', startDate: '2024-01-01', endDate: '2024-01-31', fundsRaised: 65000, outcome: 'Successful' },
        { id: 2, campaign: 'Default Education Campaign', startDate: '2024-02-01', endDate: '2024-02-29', fundsRaised: 40000, outcome: 'In Progress' },
    ];

    const columns = [
        {
            title: 'Campaign',
            dataIndex: 'campaign',
            key: 'campaign',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (text) => text ? moment(text).format('MMMM DD, YYYY') : 'N/A',
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (text) => text ? moment(text).format('MMMM DD, YYYY') : 'N/A',
        },
        {
            title: 'Funds Raised (Ksh)',
            dataIndex: 'fundsRaised',
            key: 'fundsRaised',
        },
        {
            title: 'Outcome',
            dataIndex: 'outcome',
            key: 'outcome',
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
                    Kabarak Student Welfare Management System - Reports & Documentation
                </Title>
            </Header>
            <Content style={{ padding: '50px' }}>
                <div className="container">
                    <Title level={2} style={{ color: 'maroon', marginBottom: '20px', textAlign: 'center' }}>Reports & Documentation</Title>
                    <Paragraph style={{ marginBottom: '20px', textAlign: 'center' }}>
                        Generate campaign reports and document campaign outcomes.
                    </Paragraph>

                    {/* Report Generation Options */}
                    <Card title={<Title level={4} style={{ color: 'maroon' }}>Generate Report</Title>} style={{ marginBottom: '20px' }}>
                        <Form layout="vertical">
                            <Form.Item label={<Title level={5}>Report Type</Title>}>
                                <Select defaultValue="campaign" disabled={loading || error}>
                                    <Option value="campaign">Campaign Report</Option>
                                    {/* Add other report types */}
                                </Select>
                            </Form.Item>
                            <Form.Item label={<Title level={5}>Date Range</Title>}>
                                <DatePicker.RangePicker style={{ width: '100%' }} disabled={loading || error}/>
                            </Form.Item>
                            <Button type="primary" style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }} disabled={loading || error}>
                                Generate Report
                            </Button>
                        </Form>
                    </Card>

                    {/* Campaign Reports Table */}
                    {loading ? (
                        <div className="text-center">
                            <Spin size="large" />
                            <p className="mt-2">Loading campaign reports...</p>
                        </div>
                    ) : error ? (
                         <>
                            <Alert message={`Error fetching data: ${error}. Displaying default reports.`} type="error" showIcon />
                             <Table
                                columns={columns}
                                dataSource={defaultCampaignReports}
                                rowKey="id"
                                aria-label="Campaign Reports"
                            />
                         </>
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={campaignReports}
                            rowKey="id"
                            aria-label="Campaign Reports"
                        />
                    )}
                </div>
            </Content>
        </Layout>
    );
}

export default ReportsAndDocumentationPage;