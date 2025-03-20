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
import { API_URL } from '../../services/api';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const CampaignManagementPage = () => {
    // State Management
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [activeTabKey, setActiveTabKey] = useState('active');
    const [form] = Form.useForm();
    const [rejectionReason, setRejectionReason] = useState('');
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Modal States
    const [selectedCampaignForDetails, setSelectedCampaignForDetails] = useState(null);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [selectedCampaignForApproval, setSelectedCampaignForApproval] = useState(null);
    const [isApprovalModalVisible, setIsApprovalModalVisible] = useState(false);

    // Search Handlers
    const handleSearch = (value) => setSearchText(value);
    const clearSearch = () => setSearchText('');

    // Data Fetching
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/admin/campaigns`, { headers: getAuthHeaders() });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setCampaigns(data);
            setFilteredCampaigns(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // Call fetchData here to load initial data
    }, []);

    // Responsive Design
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Campaign Filtering
    useEffect(() => {
        let filteredData = campaigns;

        if (activeTabKey === 'active') {
            filteredData = campaigns.filter(c => c.status === 'active');
        } else if (activeTabKey === 'pending') {
            filteredData = campaigns.filter(c => c.status === 'pending_approval');
        }

        if (searchText) {
            filteredData = filteredData.filter(c =>
                c.title.toLowerCase().includes(searchText.toLowerCase()) ||
                c.trackingNumber.toLowerCase().includes(searchText.toLowerCase()) ||
                c.description.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        setFilteredCampaigns(filteredData);
    }, [campaigns, searchText, activeTabKey]);

    // Auth Headers
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    // Modal Handlers
    const showDetailsModal = (record) => {
        setSelectedCampaignForDetails(record);
        setIsDetailsModalVisible(true);
    };

    const handleDetailsModalCancel = () => {
        setIsDetailsModalVisible(false);
        setSelectedCampaignForDetails(null);
    };

    const showApprovalModal = (record) => {
        setSelectedCampaignForApproval(record);
        setIsApprovalModalVisible(true);
    };

    const handleApprovalModalCancel = () => {
        setIsApprovalModalVisible(false);
        setSelectedCampaignForApproval(null);
        setRejectionReason('');
    };

    // Campaign Actions
    const handleEndCampaign = async (campaignId) => { setIsActionLoading(true); try { /* API call to end campaign */ console.log(`Ending campaign: ${campaignId}`); } finally { setIsActionLoading(false); } };

    const handleApproveCampaign = async (campaignId) => {
        setIsActionLoading(true);
        try {
            const response = await fetch(`${API_URL}/admin/campaigns/${campaignId}/approve`, { method: 'POST', headers: getAuthHeaders() });
            if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.message || 'Failed to approve campaign'); }

            message.success(`Campaign ${campaignId} approved successfully`);
            setIsApprovalModalVisible(false);

            await fetchData(); // <-- AWAIT fetchData to refresh data and re-render!

        } catch (error) { setError(`Error approving campaign: ${error.message}`); } finally { setIsActionLoading(false); }
    };

    const handleRejectCampaign = async (campaignId) => { setIsActionLoading(true); try { /* API call to reject campaign */ console.log(`Rejecting campaign: ${campaignId}, Reason: ${rejectionReason}`); } finally { setIsApprovalModalVisible(false); setIsActionLoading(false); setRejectionReason(''); } };

    const handleDisburseFunds = async (campaignId) => { setIsActionLoading(true); try { /* API call to disburse funds */ console.log(`Disbursing funds for: ${campaignId}`); } finally { setIsActionLoading(false); } };

    // Table Columns
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
            dataIndex: 'goalAmount',
            key: 'targetAmount',
            render: (text) => (text || 0).toLocaleString(),
        },
        {
            title: 'Raised (Ksh)',
            dataIndex: 'currentAmount',
            key: 'currentAmount',
            render: (text) => (text || 0).toLocaleString(),
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: () => <Tag color="green">Active</Tag>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button size="small" onClick={() => showDetailsModal(record)}>View Details</Button>
                    <Button size="small" type="primary" danger onClick={() => handleEndCampaign(record._id)} loading={isActionLoading}>
                        End Campaign
                    </Button>
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
       /* {
            title: 'Requester',
            dataIndex: 'requesterName',
            key: 'requesterName',
        },*/
        {
            title: 'Date Requested',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString(),
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
            render: (_, record) => (
                <Button type="primary" onClick={() => showApprovalModal(record)}>
                    Review Request
                </Button>
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
            dataIndex: 'goalAmount',
            key: 'targetAmount',
            render: (text) => (text || 0).toLocaleString(),
        },
        {
            title: 'Raised (Ksh)',
            dataIndex: 'currentAmount',
            key: 'currentAmount',
            render: (text) => (text || 0).toLocaleString(),
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                if (status === 'ended') color = 'blue';
                if (status === 'approved') color = 'green';
                if (status === 'rejected') color = 'red';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button size="small" onClick={() => showDetailsModal(record)}>View Details</Button>
                    {record.status === 'ended' && (
                        <Button size="small" type="primary" onClick={() => handleDisburseFunds(record._id)} loading={isActionLoading}>
                            Disburse Funds
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout>
            <div style={{ padding: '24px' }}>
                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Title level={2} style={{ color: 'maroon' }}>Campaign Management</Title>
                    <Paragraph>Manage welfare campaigns, review requests, and track records</Paragraph>
                </div>

                {/* Loading & Error States */}
                {loading && <Spin tip="Loading Campaigns..." style={{ display: 'block', marginBottom: 24 }} />}
                {error && (
                    <Alert
                        message={`Error: ${error}`}
                        type="error"
                        closable
                        onClose={() => setError(null)}
                        style={{ marginBottom: 24 }}
                    />
                )}

                {/* Tabs Section */}
                <Tabs activeKey={activeTabKey} onChange={setActiveTabKey} centered>
                    {/* Active Campaigns Tab */}
                    <TabPane tab="Active Campaigns" key="active">
                        <div style={{ marginBottom: 16, textAlign: 'right' }}>
                            <Input.Search
                                placeholder="Search active campaigns"
                                onSearch={handleSearch}
                                onChange={(e) => handleSearch(e.target.value)}
                                style={{ width: isMobile ? '100%' : 300 }}
                                value={searchText}
                                suffix={searchText && <CloseOutlined onClick={clearSearch} style={{ cursor: 'pointer' }} />}
                            />
                        </div>
                        <Table
                            columns={activeCampaignsColumns}
                            dataSource={filteredCampaigns.filter(c => activeTabKey === 'active')}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                        />
                    </TabPane>

                    {/* Pending Approval Tab */}
                    <TabPane tab="Pending Approval" key="pending">
                        <div style={{ marginBottom: 16, textAlign: 'right' }}>
                            <Input.Search
                                placeholder="Search pending campaigns"
                                onSearch={handleSearch}
                                onChange={(e) => handleSearch(e.target.value)}
                                style={{ width: isMobile ? '100%' : 300 }}
                                value={searchText}
                                suffix={searchText && <CloseOutlined onClick={clearSearch} style={{ cursor: 'pointer' }} />}
                            />
                        </div>
                        <Table
                            columns={pendingApprovalColumns}
                            dataSource={filteredCampaigns.filter(c => activeTabKey === 'pending')}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                        />
                    </TabPane>

                    {/* Campaign Records Tab */}
                    <TabPane tab="Campaign Records" key="records">
                        <div style={{ marginBottom: 16, textAlign: 'right' }}>
                            <Input.Search
                                placeholder="Search campaign records"
                                onSearch={handleSearch}
                                onChange={(e) => handleSearch(e.target.value)}
                                style={{ width: isMobile ? '100%' : 300 }}
                                value={searchText}
                                suffix={searchText && <CloseOutlined onClick={clearSearch} style={{ cursor: 'pointer' }} />}
                            />
                        </div>
                        <Table
                            columns={campaignRecordsColumns}
                            dataSource={filteredCampaigns.filter(c => activeTabKey === 'records')}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                        />
                    </TabPane>
                </Tabs>

                {/* Campaign Details Modal */}
                <Modal
                    title={selectedCampaignForDetails?.title || 'Campaign Details'}
                    visible={isDetailsModalVisible}
                    onCancel={handleDetailsModalCancel}
                    footer={null}
                    width={isMobile ? '95%' : '60%'}
                >
                    {selectedCampaignForDetails && (
                        <div style={{ padding: 16 }}>
                            <Title level={4} style={{ color: 'maroon' }}>Description</Title>
                            <Paragraph>{selectedCampaignForDetails.description}</Paragraph>

                            <div style={{ padding: 16, backgroundColor: '#f7f5f5', borderRadius: 8, marginTop: 16 }}>
                                <Title level={4} style={{ color: 'maroon' }}>Campaign Details</Title>
                                <Paragraph>{selectedCampaignForDetails.details}</Paragraph>
                            </div>

                            <div style={{ padding: 16, backgroundColor: '#f7f5f5', borderRadius: 8, marginTop: 16 }}>
                                <Paragraph>
                                    <Text strong style={{ color: 'maroon' }}>Goal:</Text> Ksh {selectedCampaignForDetails.goalAmount?.toLocaleString() || 0}
                                </Paragraph>
                                <Paragraph>
                                    <Text strong style={{ color: 'maroon' }}>Raised:</Text> Ksh {selectedCampaignForDetails.currentAmount?.toLocaleString() || 0}
                                </Paragraph>
                                <Paragraph>
                                    <Text strong style={{ color: 'maroon' }}>End Date:</Text> {new Date(selectedCampaignForDetails.endDate).toLocaleDateString()}
                                </Paragraph>
                                <Progress
                                    percent={(selectedCampaignForDetails.currentAmount / selectedCampaignForDetails.targetAmount) * 100}
                                    status="active"
                                    strokeColor="maroon"
                                />
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Approval Modal */}
                <Modal
                    title={`Approve/Reject: ${selectedCampaignForApproval?.title || 'Campaign'}`}
                    visible={isApprovalModalVisible}
                    onCancel={handleApprovalModalCancel}
                    footer={null}
                    width={isMobile ? '95%' : '50%'}
                >
                    {selectedCampaignForApproval && (
                        <div style={{ padding: 16 }}>
                            <Title level={4} style={{ color: 'maroon' }}>Campaign Request Details</Title>
                            <Paragraph><strong>Requester:</strong> {selectedCampaignForApproval.requesterName}</Paragraph>
                            <Paragraph><strong>Date Requested:</strong> {new Date(selectedCampaignForApproval.createdAt).toLocaleDateString()}</Paragraph>
                            <Paragraph><strong>Description:</strong> {selectedCampaignForApproval.description}</Paragraph>

                            <div style={{ padding: 16, backgroundColor: '#f7f5f5', borderRadius: 8, marginTop: 16 }}>
                                <Title level={5} style={{ color: 'maroon' }}>Supporting Documents</Title>
                                <Paragraph>{selectedCampaignForApproval.details}</Paragraph>
                            </div>

                            <Form layout="vertical" style={{ marginTop: 24 }}>
                                <Form.Item label="Rejection Reason (Optional)">
                                    <Input.TextArea
                                        rows={3}
                                        placeholder="Enter reason for rejection"
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                    />
                                </Form.Item>
                                <div style={{ textAlign: 'right' }}>
                                    <Button onClick={handleApprovalModalCancel} style={{ marginRight: 8 }}>
                                        Cancel
                                    </Button>
                                    <Button
                                        danger
                                        onClick={() => handleRejectCampaign(selectedCampaignForApproval._id)}
                                        loading={isActionLoading}
                                        style={{ marginRight: 8 }}
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        type="primary"
                                        style={{ backgroundColor: 'maroon', borderColor: 'maroon' }}
                                        onClick={() => { // <-- Modified to an arrow function block
                                            console.log("Approve Button Clicked - selectedCampaignForApproval:", selectedCampaignForApproval); // <-- ADD THIS LOG
                                            console.log("Approve Button Clicked - selectedCampaignForApproval._id:", selectedCampaignForApproval?._id); // <-- ADD THIS LOG - Safe access with ?.
                                            handleApproveCampaign(selectedCampaignForApproval._id); // Call handleApproveCampaign as before
                                        }}
                                        loading={isActionLoading}
                                    >
                                        Approve
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