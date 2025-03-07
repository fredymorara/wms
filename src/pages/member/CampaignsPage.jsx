import React, { useState, useEffect } from 'react';
import { Input, Table, Button, Modal, Form, Alert, Spin, Layout, Typography } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

function CampaignsPage() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [contributionLoading, setContributionLoading] = useState(false);
    const [contributionError, setContributionError] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/member/campaigns');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCampaigns(data);
                setFilteredCampaigns(data);
                setLoading(false);
            } catch (e) {
                setError(e.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const defaultCampaigns = [
        {
            id: 1,
            title: 'Default Medical Fund for John',
            category: 'Medical',
            goal: 100000,
            raised: 65000,
            description: 'Help John with his medical expenses',
            details: 'John is a brilliant student who needs our support...',
            endDate: '2023-12-31',
        },
        {
            id: 2,
            title: 'Default Academic Support for Sara',
            category: 'Academic',
            goal: 50000,
            raised: 40000,
            description: 'Support Sara\'s education journey',
            details: 'Sara is dedicated and hardworking, but facing financial difficulties...',
            endDate: '2024-01-15',
        },
    ];

    const handleSearch = (value) => {
        setSearchText(value);
        const filteredData = (error ? defaultCampaigns : campaigns).filter((campaign) =>
            campaign.title.toLowerCase().includes(value.toLowerCase()) ||
            campaign.category.toLowerCase().includes(value.toLowerCase()) ||
            campaign.description.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCampaigns(filteredData);
    };

    const clearSearch = () => {
        setSearchText('');
        setFilteredCampaigns(error ? defaultCampaigns : campaigns);
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <Button type="link" onClick={() => showCampaignDetails(record)} disabled={error} style={{ color: 'maroon' }}>
                    {text}
                </Button>
            ),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Goal (Ksh)',
            dataIndex: 'goal',
            key: 'goal',
            render: (text) => text.toLocaleString(),
        },
        {
            title: 'Raised (Ksh)',
            dataIndex: 'raised',
            key: 'raised',
            render: (text) => text.toLocaleString(),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button type="primary" onClick={() => showModal(record)} disabled={error} style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}>
                    Contribute
                </Button>
            ),
        },
    ];

    const showModal = (record) => {
        setSelectedCampaign(record);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setContributionError(null);
    };

    const showCampaignDetails = (record) => {
        setSelectedCampaign(record);
        setIsModalVisible(true);
    };

    const onFinish = async (values) => {
        setContributionLoading(true);
        setContributionError(null);
        try {
            // Simulate M-Pesa integration - replace with actual API call
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
            console.log('Contribution successful!');
            setIsModalVisible(false);
            form.resetFields();
        } catch (e) {
            setContributionError(e.message);
        } finally {
            setContributionLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        setContributionError('Form submission failed. Please check the fields.');
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
                    Kabarak Student Welfare Management System
                </Title>
            </Header>
            <Content style={{ padding: '50px' }}>
                <div className="container">
                    <Title level={2} style={{ color: 'maroon', marginBottom: '20px', textAlign: 'center' }}>Active Campaigns</Title>
                    <Paragraph style={{ marginBottom: '20px', textAlign: 'center' }}>
                        Browse active campaigns and contribute to causes you care about. Use the search to find specific campaigns, or click on a campaign title to view more details and contribute.
                    </Paragraph>

                    {/* Search Input */}
                    <div className="mb-4 flex items-center">
                        <Input
                            placeholder="Search campaigns"
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

                    {/* Campaigns Table */}
                    {loading ? (
                        <div className="text-center">
                            <Spin size="large" />
                            <p className="mt-2">Loading campaigns...</p>
                        </div>
                    ) : error ? (
                        <Alert message={`Error fetching data: ${error}.  Displaying default campaigns.`} type="error" showIcon />
                    ) : (
                        <>
                            {filteredCampaigns.length === 0 && searchText ? (
                                <p>No campaigns found matching your search.</p>
                            ) : (
                                <Table
                                    columns={columns}
                                    dataSource={filteredCampaigns}
                                    rowKey="id"
                                    aria-label="Active Campaigns"
                                />
                            )}
                        </>
                    )}

                    {/* Modal for Campaign Details and Contribution */}
                    <Modal
                        title={selectedCampaign ? selectedCampaign.title : 'Campaign Details'}
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        footer={null}
                    >
                        {selectedCampaign && (
                            <div className='p-2 rounded-lg w-full' style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
                                <Title level={4} style={{ color: 'maroon' }}>Description</Title>
                                <Paragraph>{selectedCampaign.description}</Paragraph>
                                <div className='p-4 rounded-lg mt-4 w-full' style={{ backgroundColor: 'rgba(248, 232, 236, 0.5)' }}>
                                    <Title level={4} style={{ color: 'maroon' }}>Campaign Details</Title>
                                    <Paragraph>{selectedCampaign.details}</Paragraph>
                                </div>
                                <div className='p-4 rounded-lg mt-4 w-full' style={{ backgroundColor: 'rgba(149, 217, 154, 0.3)' }}>
                                    <Paragraph>
                                        <span style={{ fontWeight: 'bold', color: 'maroon' }}>Goal:</span> Ksh {selectedCampaign.goal.toLocaleString()}
                                    </Paragraph>
                                    <Paragraph>
                                        <span style={{ fontWeight: 'bold', color: 'maroon' }}>Raised:</span> Ksh {selectedCampaign.raised.toLocaleString()}
                                    </Paragraph>
                                    <Paragraph>
                                        <span style={{ fontWeight: 'bold', color: 'maroon' }}>End Date:</span> {selectedCampaign.endDate}
                                    </Paragraph>
                                </div>

                                <Title level={4} style={{ color: 'maroon', marginTop: '20px' }}>Contribute</Title>

                                {/* Contribution Form */}
                                <Form
                                    form={form}
                                    name="contributionForm"
                                    layout="vertical"
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                >
                                    <Form.Item
                                        label={<Title level={5}>Amount (Ksh)</Title>}
                                        name="amount"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter the amount to contribute.',
                                            },
                                            {
                                                type: 'number',
                                                min: 1,
                                                message: 'Amount must be greater than zero.',
                                            },
                                        ]}
                                    >
                                        <Input type="number" placeholder="Enter amount (Ksh)" disabled={error} />
                                    </Form.Item>
                                    {contributionError && <Alert message={`Error: ${contributionError}`} type="error" showIcon />}
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" loading={contributionLoading} disabled={contributionLoading || error} style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}>
                                            Contribute
                                        </Button>
                                        <Button key="cancel" onClick={handleCancel} style={{ marginLeft: 8 }} disabled={error}>
                                            Cancel
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        )}
                    </Modal>

                    {error && (
                        <Table
                            columns={columns}
                            dataSource={defaultCampaigns}
                            rowKey="id"
                            aria-label="Active Campaigns"
                        />
                    )}
                </div>
            </Content>
        </Layout>
    );
}

export default CampaignsPage;