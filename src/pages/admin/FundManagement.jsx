import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, Table, Button, Input, Form, Select, Alert, Spin, InputNumber } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, RedoOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

function FundManagementPage() {
    const [disbursements, setDisbursements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/admin/funds/disbursements');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setDisbursements(data);
                setLoading(false);
            } catch (e) {
                setError(e.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const defaultDisbursements = [
        { id: 1, campaign: 'Default Medical Campaign', beneficiary: 'John Doe', amount: 50000, payment_method: 'M-Pesa', request_date: '2024-01-25' },
        { id: 2, campaign: 'Default Education Campaign', beneficiary: 'Jane Smith', amount: 25000, payment_method: 'Bank Transfer', request_date: '2024-01-27' },
    ];

    const handleApprove = async (record) => {
        console.log(`Approve disbursement: ${record.id}`);
        // Implement your API call to approve the disbursement
    };

    const handleReject = async (record) => {
        console.log(`Reject disbursement: ${record.id}`);
        // Implement your API call to reject the disbursement
    };

    const handleRefund = async (values) => {
        console.log('Process refund:', values);
        // Implement your API call to process the refund
    };

    const columns = [
        {
            title: 'Campaign',
            dataIndex: 'campaign',
            key: 'campaign',
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
            title: 'Payment Method',
            dataIndex: 'payment_method',
            key: 'payment_method',
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
                    <Button type="primary" onClick={() => handleReject(record)} style={{ backgroundColor: 'red', borderColor: 'red', color: 'white', marginRight: 8 }} disabled={error || loading}>
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
                    Kabarak Student Welfare Management System - Fund Management
                </Title>
            </Header>
            <Content style={{ padding: '50px' }}>
                <div className="container">
                    <Title level={2} style={{ color: 'maroon', marginBottom: '20px', textAlign: 'center' }}>Fund Management</Title>
                    <Paragraph style={{ marginBottom: '20px', textAlign: 'center' }}>
                        Approve or reject pending disbursement requests.
                    </Paragraph>

                    {loading ? (
                        <div className="text-center">
                            <Spin size="large" />
                            <p className="mt-2">Loading disbursement requests...</p>
                        </div>
                    ) : error ? (
                        <>
                            <Alert message={`Error fetching data: ${error}. Displaying default disbursements.`} type="error" showIcon />
                               <Table
                                columns={columns}
                                dataSource={defaultDisbursements}
                                rowKey="id"
                                aria-label="Disbursement Requests"
                                />
                         </>
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={disbursements}
                            rowKey="id"
                            aria-label="Disbursement Requests"
                        />
                    )}

                     <Title level={3} style={{ color: 'maroon', marginTop: '40px', marginBottom: '20px' }}>Process Refund</Title>
                     <Card>
                        <Paragraph style={{ marginBottom: '20px'}}>Process refund for refund related issues eg the user accidentally sent an amount they were not intedending to.</Paragraph>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleRefund}
                    >
                         <Form.Item
                            label={<Title level={5}>Refundee (student name or admission)</Title>}
                            name="name or admission"
                            rules={[{ required: true, message: 'Please enter name!' }]}
                            >
                            <Input  />
                        </Form.Item>
                        <Form.Item
                            label={<Title level={5}> Amount(Ksh)</Title>}
                            name="amount"
                            rules={[{ required: true, message: 'Please enter the Refund Amount!' }]}
                            >
                              <InputNumber
                                style={{
                                  width: '100%',
                                }}
                              />
                         </Form.Item>
                        <Form.Item
                            label={<Title level={5}> Reason for Refund</Title>}
                            name="reason"
                            rules={[{ required: true, message: 'Please enter a reason for request!' }]}
                            >
                            <Input  />
                        </Form.Item>
                        <Form.Item>
                             <Button type="primary" htmlType="submit" style={{ backgroundColor: 'red', borderColor: 'red', color: 'white' }}>
                                      Process Refund
                             </Button>
                        </Form.Item>
                     </Form>
                   </Card>
                </div>
            </Content>
        </Layout>
    );
}

export default FundManagementPage;