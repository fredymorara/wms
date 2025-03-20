import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import {
    Typography,
    Table,
    Tabs,
    Button,
    Modal,
    Spin,
    Alert,
    Progress,
    Tag,
    Space,
    List,
    Card,
    message, // Import message for notifications
} from 'antd';
import { FundOutlined, HistoryOutlined, UserOutlined } from '@ant-design/icons';
import { API_URL } from '../../services/api'; // Assuming you have API_URL defined here

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const FundsManagementPage = () => {
    const [campaignFundsData, setCampaignFundsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTabKey, setActiveTabKey] = useState('fundraising'); // 'fundraising', 'disbursement'
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [isContributorsModalVisible, setIsContributorsModalVisible] = useState(false);
    const [isContributionHistoryModalVisible, setIsContributionHistoryModalVisible] = useState(false);
    const [contributors, setContributors] = useState([]);
    const [contributionHistory, setContributionHistory] = useState([]);
    const [isActionLoading, setIsActionLoading] = useState(false); // For Disburse Funds action
    const [isMobile, setIsMobile] = useState(false);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    // Fetch campaign funds data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/admin/campaigns`, {
                    headers: getAuthHeaders()
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched Campaign Data:', data); // Debug the data
                setCampaignFundsData(data);
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

    const showContributorsModal = async (record) => {
        setSelectedCampaign(record);
        setIsContributorsModalVisible(true);
        setContributors([]);
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/admin/campaign-contributors/${record._id}`, {
                headers: getAuthHeaders()
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setContributors(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleContributorsModalCancel = () => {
        setIsContributorsModalVisible(false);
        setSelectedCampaign(null);
        setContributors([]);
        setError(null);
    };

    const showContributionHistoryModal = async (record) => {
        setSelectedCampaign(record);
        setIsContributionHistoryModalVisible(true);
        setContributionHistory([]);
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/admin/campaign-contribution-history/${record._id}`, {
                headers: getAuthHeaders()
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setContributionHistory(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleContributionHistoryModalCancel = () => {
        setIsContributionHistoryModalVisible(false);
        setSelectedCampaign(null);
        setContributionHistory([]);
        setError(null);
    };

    const handleDisburseFunds = async (campaignId) => {
        setIsActionLoading(true);
        try {
            const response = await fetch(`${API_URL}/admin/campaigns/${campaignId}/disburse`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ /* disbursement details if needed */ }), // Add disbursement details if required by API
            });
            if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.message || 'Failed to disburse funds'); }

            message.success(`Funds disbursement initiated for campaign ${campaignId}`);
            // Optionally refresh campaign data after disbursement
            fetchData(); // Re-fetch campaign data to update UI
        } catch (error) {
            setError(`Error disbursing funds: ${error.message}`);
            message.error(`Error disbursing funds: ${error.message}`);
        } finally {
            setIsActionLoading(false);
        }
    };

    const fundraisingOverviewColumns = [
        {
            title: 'Campaign Title',
            dataIndex: 'title',
            key: 'title',
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
            render: (text) => (text || 0).toLocaleString(), // Add default value
        },
        {
            title: 'Raised (Ksh)',
            dataIndex: 'currentAmount',
            key: 'currentAmount',
            render: (text) => (text || 0).toLocaleString(), // Add default value
        },
        {
            title: '% Raised',
            dataIndex: 'percentageRaised',
            key: 'percentageRaised',
            render: (percentage) => <Progress percent={percentage || 0} status="active" strokeColor="maroon" />, // Add default value
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                let text = status?.toUpperCase() || 'N/A'; // Add default value
                if (status === 'active') color = 'green';
                if (status === 'nearing_target') { color = 'blue'; text = 'Nearing Target'; }
                if (status === 'awaiting_disbursement') { color = '#d46b08'; text = 'Awaiting Disbursement'; }
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button size="small" icon={<UserOutlined />} onClick={() => showContributorsModal(record)}>View Contributors</Button>
                    <Button size="small" icon={<HistoryOutlined />} onClick={() => showContributionHistoryModal(record)}>Contribution History</Button>
                </Space>
            ),
        },
    ];

    const awaitingDisbursementColumns = [
        {
            title: 'Campaign Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Tracking #',
            dataIndex: 'trackingNumber',
            key: 'trackingNumber',
        },
        {
            title: 'Final Amount Raised (Ksh)',
            dataIndex: 'currentAmount',
            key: 'finalAmountRaised',
            render: (text) => (text || 0).toLocaleString(), // Add default value
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: 'Beneficiary',
            dataIndex: 'beneficiaryName',
            key: 'beneficiaryName',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => handleDisburseFunds(record._id)} loading={isActionLoading} style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}>Disburse Funds</Button>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout>
            <div style={{ padding: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Title level={2} style={{ color: 'maroon' }}>
                        Funds Management
                    </Title>
                    <Paragraph>
                        Overview of campaign fundraising, manage disbursements, and track financial activity.
                    </Paragraph>
                </div>

                {loading && <Spin tip="Loading Funds Data..." style={{ display: 'block', marginBottom: 24 }} />}
                {error && <Alert message={`Error fetching funds data: ${error}`} type="error" closable onClose={() => setError(null)} style={{ marginBottom: 24 }} />}

                <Tabs activeKey={activeTabKey} onChange={setActiveTabKey} centered>
                    <TabPane tab="Campaign Fundraising Overview" key="fundraising">
                        <Table
                            loading={loading}
                            columns={fundraisingOverviewColumns}
                            dataSource={campaignFundsData.filter(campaign => activeTabKey === 'fundraising')}
                            rowKey="_id"
                            pagination={{ pageSize: 10 }}
                        />
                    </TabPane>

                    <TabPane tab="Awaiting Disbursement" key="disbursement">
                        <Table
                            loading={loading}
                            columns={awaitingDisbursementColumns}
                            dataSource={campaignFundsData.filter(campaign => activeTabKey === 'disbursement')}
                            rowKey="_id"
                            pagination={{ pageSize: 10 }}
                        />
                    </TabPane>
                </Tabs>

                {/* Contributors Modal */}
                <Modal
                    title={selectedCampaign ? `Contributors to ${selectedCampaign.title}` : 'Contributors'}
                    visible={isContributorsModalVisible}
                    onCancel={handleContributorsModalCancel}
                    footer={null}
                    width={isMobile ? '95%' : '50%'}
                >
                    {loading && <Spin tip="Loading Contributors..." style={{ display: 'block', margin: '20px 0' }} />}
                    {error && <Alert message={`Error fetching contributors: ${error}`} type="error" closable onClose={handleContributorsModalCancel} />}

                    {!loading && !error && contributors.length > 0 && (
                        <List
                            itemLayout="vertical"
                            dataSource={contributors}
                            renderItem={(contributor) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<UserOutlined />}
                                        title={<Text strong>{contributor.memberName || contributor.memberNickname || 'Anonymous'}</Text>}
                                        description={`Contributed Ksh ${(contributor.amount || 0).toLocaleString()} on ${contributor.contributionDate || 'N/A'}`} // Add default values
                                    />
                                </List.Item>
                            )}
                        />
                    )}
                    {!loading && !error && contributors.length === 0 && (
                        <Alert message="No contributions yet for this campaign." type="info" showIcon />
                    )}
                </Modal>

                {/* Contribution History Modal */}
                <Modal
                    title={selectedCampaign ? `Contribution History for ${selectedCampaign.title}` : 'Contribution History'}
                    visible={isContributionHistoryModalVisible}
                    onCancel={handleContributionHistoryModalCancel}
                    footer={null}
                    width={isMobile ? '95%' : '70%'}
                >
                    {loading && <Spin tip="Loading Contribution History..." style={{ display: 'block', margin: '20px 0' }} />}
                    {error && <Alert message={`Error fetching contribution history: ${error}`} type="error" closable onClose={handleContributionHistoryModalCancel} />}

                    {!loading && !error && contributionHistory.length > 0 && (
                        <List
                            itemLayout="vertical"
                            dataSource={contributionHistory}
                            renderItem={(historyItem) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={`Ksh ${(historyItem.amount || 0).toLocaleString()} - Contributed by ${historyItem.memberName || historyItem.memberNickname || 'Anonymous'} on ${historyItem.contributionDate || 'N/A'}`} // Add default values
                                    />
                                    <Paragraph>
                                        Transaction ID: {historyItem.transactionId || 'N/A'}
                                    </Paragraph>
                                </List.Item>
                            )}
                        />
                    )}
                    {!loading && !error && contributionHistory.length === 0 && (
                        <Alert message="No contribution history available for this campaign." type="info" showIcon />
                    )}
                </Modal>
            </div>
        </AdminLayout>
    );
};

export default FundsManagementPage;