import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, Table, Input, Button, Select, DatePicker, Alert, Spin, Form } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;
const { Option } = Select;

function DisbursementManagementPage() {
    const [disbursements, setDisbursements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form] = Form.useForm();
    const [selectedCampaign, setSelectedCampaign] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/treasurer/disbursements');
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
        { id: 1, campaign: 'Default Medical Campaign', beneficiary: 'John Doe', amount: 50000, request_date: '2024-02-05', status: 'pending' },
        { id: 2, campaign: 'Default Education Campaign', beneficiary: 'Jane Smith', amount: 25000, request_date: '2024-02-07', status: 'pending' },
    ];

    const handleApprove = async (record) => {
        console.log(`Approve disbursement: ${record.id}`);
        // Implement your API call to approve the disbursement
    };

    const handleReject = async (record) => {
        console.log(`Reject disbursement: ${record.id}`);
        // Implement your API call to reject the disbursement
    };

    const handleRecordPayment = async (record) => {
        console.log(`Record payment details for disbursement: ${record.id}`);
        // Implement your logic to record the payment details
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
                    Kabarak Student Welfare Management System - Disbursement Management
                </Title>
            </Header>
            <Content style={{ padding: '50px' }}>
                <div className="container">
                    <Title level={2} style={{ color: 'maroon', marginBottom: '20px', textAlign: 'center' }}>Disbursement Management</Title>
                    <Paragraph style={{ marginBottom: '20px', textAlign: 'center' }}>
                        Handle and oversee disbursement requests to users.
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
                </div>
            </Content>
        </Layout>
    );
}

export default DisbursementManagementPage;