import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import {
    Typography,
    Input,
    Table,
    Tabs,
    Button,
    Modal,
    Form,
    Alert,
    Spin,
    Tag,
    Space,
    Progress,
} from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const CampaignManagementPage = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [isApprovalModalVisible, setIsApprovalModalVisible] = useState(false);
    const [activeTabKey, setActiveTabKey] = useState('active'); // 'active', 'pending', 'records'
    const [isMobile, setIsMobile] = useState(false);
    const [form] = Form.useForm();
    const [rejectionReason, setRejectionReason] = useState('');
    const [isActionLoading, setIsActionLoading] = useState(false); // For Approve/Reject/End/Disburse actions

    // Fetch campaigns data (Placeholder - replace with your API endpoint)
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Replace 'http://localhost:5000/api/admin/campaigns' with your actual API endpoint to fetch all campaigns
                const response = await fetch('http://localhost:5000/api/admin/campaigns');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCampaigns(data);
                setFilteredCampaigns(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Filter campaigns based on tab and search text
    useEffect(() => {
        let filteredData = campaigns;

        // Filter by tab
        if (activeTabKey === 'active') {
            filteredData = campaigns.filter(campaign => campaign.status === 'active'); // Adjust status check based on your data
        } else if (activeTabKey === 'pending') {
            filteredData = campaigns.filter(campaign => campaign.status === 'pending_approval'); // Adjust status check based on your data
        } // 'records' tab shows all, no need to filter by tab status

        // Filter by search text
        if (searchText) {
            filteredData = filteredData.filter(campaign =>
                campaign.title.toLowerCase().includes(searchText.toLowerCase()) ||
                campaign.trackingNumber.toLowerCase().includes(searchText.toLowerCase()) ||
                campaign.description.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        setFilteredCampaigns(filteredData);
    }, [campaigns, searchText, activeTabKey]);


    const handleSearch = (value) => {
        setSearchText(value);
    };

    const clearSearch = () => {
        setSearchText('');
    };

    const showDetailsModal = (record) => {
        setSelectedCampaign(record);
        setIsDetailsModalVisible(true);
    };

    const handleDetailsModalCancel = () => {
        setIsDetailsModalVisible(false);
        setSelectedCampaign(null);
    };

    const showApprovalModal = (record) => {
        setSelectedCampaign(record);
        setIsApprovalModalVisible(true);
    };

    const handleApprovalModalCancel = () => {
        setIsApprovalModalVisible(false);
        setSelectedCampaign(null);
        setRejectionReason('');
    };

    const handleEndCampaign = async (campaignId) => {
        setIsActionLoading(true);
        // Implement API call to end campaign with campaignId
        console.log(`Ending campaign with ID: ${campaignId}`);
        setIsActionLoading(false);
        // After successful end, you might want to refresh campaign data or update UI accordingly
    };

    const handleApproveCampaign = async (campaignId) => {
        setIsActionLoading(true);
        // Implement API call to approve campaign with campaignId
        console.log(`Approving campaign with ID: ${campaignId}`);
        setIsApprovalModalVisible(false);
        setIsActionLoading(false);
        // After successful approval, refresh campaign data
    };

    const handleRejectCampaign = async (campaignId) => {
        setIsActionLoading(true);
        // Implement API call to reject campaign with campaignId and rejectionReason
        console.log(`Rejecting campaign with ID: ${campaignId}, Reason: ${rejectionReason}`);
        setIsApprovalModalVisible(false);
        setIsActionLoading(false);
        setRejectionReason('');
        // After successful rejection, refresh campaign data
    };

    const handleDisburseFunds = async (campaignId) => {
        setIsActionLoading(true);
        // Implement API call to initiate fund disbursement for campaign with campaignId
        console.log(`Disbursing funds for campaign with ID: ${campaignId}`);
        setIsActionLoading(false);
        // After successful disbursement initiation, refresh campaign data or update UI
    };


    const activeCampaignsColumns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <Button type="link" onClick={() => showDetailsModal(record)} style={{ color: 'maroon', padding: 0 }}>
                    {text}
                </Button>
            ),
        },
        {
            title: 'Tracking #',
            dataIndex: 'trackingNumber',
            key: 'trackingNumber',
        },
        {
            title: 'Target (Ksh)',
            dataIndex: 'targetAmount',
            key: 'targetAmount',
            render: (text) => text.toLocaleString(),
        },
        {
            title: 'Raised (Ksh)',
            dataIndex: 'currentAmount',
            key: 'currentAmount',
            render: (text) => text.toLocaleString(),
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: () => <Tag color="green">Active</Tag>, // Dynamic status rendering based on data
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button size="small" onClick={() => showDetailsModal(record)} >View Details</Button>
                    <Button size="small" type="primary" danger onClick={() => handleEndCampaign(record.id)} loading={isActionLoading}>End Campaign</Button>
                </Space>
            ),
        },
    ];

    const pendingApprovalColumns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <Button type="link" onClick={() => showApprovalModal(record)} style={{ color: 'maroon', padding: 0 }}>
                    {text}
                </Button>
            ),
        },
        {
            title: 'Requester',
            dataIndex: 'requesterName', // Adjust dataIndex based on your API response
            key: 'requesterName',
        },
        {
            title: 'Date Requested',
            dataIndex: 'dateRequested', // Adjust dataIndex based on your API response
            key: 'dateRequested',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button size="small" type="primary" onClick={() => showApprovalModal(record)} >View & Approve/Reject</Button>
                </Space>
            ),
        },
    ];

    const campaignRecordsColumns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <Button type="link" onClick={() => showDetailsModal(record)} style={{ color: 'maroon', padding: 0 }}>
                    {text}
                </Button>
            ),
        },
        {
            title: 'Tracking #',
            dataIndex: 'trackingNumber',
            key: 'trackingNumber',
        },
        {
            title: 'Target (Ksh)',
            dataIndex: 'targetAmount',
            key: 'targetAmount',
            render: (text) => text.toLocaleString(),
        },
        {
            title: 'Raised (Ksh)',
            dataIndex: 'currentAmount',
            key: 'currentAmount',
            render: (text) => text.toLocaleString(),
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                if (status === 'ended') color = 'blue'; // Adjust status values based on your data
                if (status === 'approved') color = 'green';
                if (status === 'rejected') color = 'red';
                return <Tag color={color}>{status.toUpperCase()}</Tag>; // Dynamic status rendering
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button size="small" onClick={() => showDetailsModal(record)} >View Details</Button>
                    {record.status === 'approved' && record.status === 'ended' && ( // Conditional rendering based on campaign status
                        <Button size="small" type="primary" onClick={() => handleDisburseFunds(record.id)} loading={isActionLoading}>Disburse Funds</Button>
                    )}
                </Space>
            ),
        },
    ];


    return (
        <AdminLayout>
            <div style={{ padding: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Title level={2} style={{ color: 'maroon' }}>
                        Campaign Management
                    </Title>
                    <Paragraph>
                        Manage welfare campaigns, review pending requests, and track campaign records.
                    </Paragraph>
                </div>

                {loading && <Spin tip="Loading Campaigns..." style={{ display: 'block', marginBottom: 24 }} />}
                {error && <Alert message={`Error fetching campaigns: ${error}`} type="error" closable onClose={() => setError(null)} style={{ marginBottom: 24 }} />}

                <Tabs activeKey={activeTabKey} onChange={setActiveTabKey} centered>
                    <TabPane tab="Active Campaigns" key="active">
                        <div style={{ marginBottom: 16, textAlign: 'right' }}>
                            <Input.Search
                                placeholder="Search campaigns"
                                onSearch={handleSearch}
                                style={{ width: isMobile ? '100%' : 300 }}
                                value={searchText}
                                onChange={(e) => handleSearch(e.target.value)}
                                suffix={searchText && <CloseOutlined onClick={clearSearch} style={{ cursor: 'pointer', color: 'rgba(0, 0, 0, 0.45)' }} />}
                            />
                        </div>
                        <Table
                            loading={loading}
                            columns={activeCampaignsColumns}
                            dataSource={filteredCampaigns.filter(campaign => activeTabKey === 'active')}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                        />
                    </TabPane>
                    <TabPane tab="Pending Approval" key="pending">
                        <div style={{ marginBottom: 16, textAlign: 'right' }}>
                            <Input.Search
                                placeholder="Search pending campaigns"
                                onSearch={handleSearch}
                                style={{ width: isMobile ? '100%' : 300 }}
                                value={searchText}
                                onChange={(e) => handleSearch(e.target.value)}
                                suffix={searchText && <CloseOutlined onClick={clearSearch} style={{ cursor: 'pointer', color: 'rgba(0, 0, 0, 0.45)' }} />}
                            />
                        </div>
                        <Table
                            loading={loading}
                            columns={pendingApprovalColumns}
                            dataSource={filteredCampaigns.filter(campaign => activeTabKey === 'pending')}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                        />
                    </TabPane>
                    <TabPane tab="Campaign Records" key="records">
                        <div style={{ marginBottom: 16, textAlign: 'right' }}>
                            <Input.Search
                                placeholder="Search campaign records"
                                onSearch={handleSearch}
                                style={{ width: isMobile ? '100%' : 300 }}
                                value={searchText}
                                onChange={(e) => handleSearch(e.target.value)}
                                suffix={searchText && <CloseOutlined onClick={clearSearch} style={{ cursor: 'pointer', color: 'rgba(0, 0, 0, 0.45)' }} />}
                            />
                        </div>
                        <Table
                            loading={loading}
                            columns={campaignRecordsColumns}
                            dataSource={filteredCampaigns.filter(campaign => activeTabKey === 'records')}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                        />
                    </TabPane>
                </Tabs>

                {/* Campaign Details Modal */}
                <Modal
                    title={selectedCampaign ? selectedCampaign.title : 'Campaign Details'}
                    visible={isDetailsModalVisible}
                    onCancel={handleDetailsModalCancel}
                    footer={null}
                    width={isMobile ? '95%' : '60%'}
                >
                    {selectedCampaign && (
                        <div style={{ padding: 16 }}>
                            <Title level={4} style={{ color: 'maroon' }}>Description</Title>
                            <Paragraph>{selectedCampaign.description}</Paragraph>
                            <div style={{ padding: 16, backgroundColor: '#f7f5f5', borderRadius: 8, marginTop: 16 }}>
                                <Title level={4} style={{ color: 'maroon' }}>Campaign Details</Title>
                                <Paragraph>{selectedCampaign.details}</Paragraph>
                            </div>
                            <div style={{ padding: 16, backgroundColor: '#f7f5f5', borderRadius: 8, marginTop: 16 }}>
                                <Paragraph>
                                    <Text strong style={{ color: 'maroon' }}>Goal:</Text> Ksh {selectedCampaign.targetAmount.toLocaleString()}
                                </Paragraph>
                                <Paragraph>
                                    <Text strong style={{ color: 'maroon' }}>Raised:</Text> Ksh {selectedCampaign.currentAmount.toLocaleString()}
                                </Paragraph>
                                <Paragraph>
                                    <Text strong style={{ color: 'maroon' }}>End Date:</Text> {selectedCampaign.endDate}
                                </Paragraph>
                                <Progress percent={(selectedCampaign.currentAmount / selectedCampaign.targetAmount) * 100} status="active" strokeColor="maroon" />
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Campaign Approval Modal */}
                <Modal
                    title={selectedCampaign ? `Approve/Reject: ${selectedCampaign.title}` : 'Campaign Approval'}
                    visible={isApprovalModalVisible}
                    onCancel={handleApprovalModalCancel}
                    footer={null}
                    width={isMobile ? '95%' : '50%'}
                >
                    {selectedCampaign && (
                        <div style={{ padding: 16 }}>
                            <Title level={4} style={{ color: 'maroon' }}>Campaign Request Details</Title>
                            <Paragraph><strong>Requester:</strong> {selectedCampaign.requesterName}</Paragraph>
                            <Paragraph><strong>Description:</strong> {selectedCampaign.description}</Paragraph>
                            <div style={{ padding: 16, backgroundColor: '#f7f5f5', borderRadius: 8, marginTop: 16 }}>
                                <Title level={5} style={{ color: 'maroon' }}>Supporting Information</Title>
                                <Paragraph>{selectedCampaign.details}</Paragraph> {/* Display 'details' as supporting info */}
                                {/* Add components to display uploaded documents if applicable */}
                            </div>

                            <Form layout="vertical" style={{ marginTop: 24 }}>
                                <Form.Item label="Rejection Reason (Optional, for rejection only):">
                                    <Input.TextArea rows={3} placeholder="Enter reason for rejection" value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} />
                                </Form.Item>
                                <div style={{ textAlign: 'right' }}>
                                    <Button key="back" onClick={handleApprovalModalCancel} style={{ marginRight: 8 }} disabled={isActionLoading}>
                                        Cancel
                                    </Button>
                                    <Button
                                        key="reject"
                                        type="danger"
                                        onClick={() => handleRejectCampaign(selectedCampaign.id)}
                                        loading={isActionLoading}
                                        style={{ marginRight: 8 }}
                                    >
                                        Reject Campaign
                                    </Button>
                                    <Button
                                        key="submit"
                                        type="primary"
                                        style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}
                                        onClick={() => handleApproveCampaign(selectedCampaign.id)}
                                        loading={isActionLoading}
                                    >
                                        Approve Campaign
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    )}
                </Modal>


            </div>
        </AdminLayout>
    );
};

export default CampaignManagementPage;