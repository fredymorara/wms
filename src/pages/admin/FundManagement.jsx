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
} from 'antd';
import { FundOutlined, HistoryOutlined, UserOutlined } from '@ant-design/icons';

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

    // Fetch campaign funds data (Placeholder - replace with your API endpoint)
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Replace 'http://localhost:5000/api/admin/funds-overview' with your actual API endpoint to fetch funds data
                const response = await fetch('http://localhost:5000/api/admin/funds-overview');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
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
        setContributors([]); // Clear previous contributors
        setLoading(true); // Start loading in modal
        setError(null);
        try {
            // Replace 'http://localhost:5000/api/admin/campaign-contributors/' + record.id with your actual API endpoint
            const response = await fetch(`http://localhost:5000/api/admin/campaign-contributors/${record.id}`);
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
        setError(null); // Clear error on modal close
    };

    const showContributionHistoryModal = async (record) => {
        setSelectedCampaign(record);
        setIsContributionHistoryModalVisible(true);
        setContributionHistory([]); // Clear previous history
        setLoading(true); // Start loading in modal
        setError(null);
        try {
            // Replace 'http://localhost:5000/api/admin/campaign-contribution-history/' + record.id with your actual API endpoint
            const response = await fetch(`http://localhost:5000/api/admin/campaign-contribution-history/${record.id}`);
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
        setError(null); // Clear error on modal close
    };


    const handleDisburseFunds = async (campaignId) => {
        setIsActionLoading(true);
        // Implement API call to initiate fund disbursement for campaign with campaignId
        console.log(`Disbursing funds for campaign with ID: ${campaignId}`);
        setIsActionLoading(false);
        // After successful disbursement initiation, refresh campaign data or update UI as needed
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
            render: (text) => text.toLocaleString(),
        },
        {
            title: 'Raised (Ksh)',
            dataIndex: 'currentAmount',
            key: 'currentAmount',
            render: (text) => text.toLocaleString(),
        },
        {
            title: '% Raised',
            dataIndex: 'percentageRaised',
            key: 'percentageRaised',
            render: (percentage) => <Progress percent={percentage} status="active" strokeColor="maroon" />,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                let text = status.toUpperCase();
                if (status === 'active') color = 'green';
                if (status === 'nearing_target') { color = 'blue'; text = 'Nearing Target'; } // Example status
                if (status === 'awaiting_disbursement') { color = '#d46b08'; text = 'Awaiting Disbursement'; } // Example status
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
            dataIndex: 'currentAmount', // Assuming 'currentAmount' holds final amount raised
            key: 'finalAmountRaised',
            render: (text) => text.toLocaleString(),
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: 'Beneficiary',
            dataIndex: 'beneficiaryName', // Adjust dataIndex based on your API response
            key: 'beneficiaryName',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => handleDisburseFunds(record.id)} loading={isActionLoading} style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}>Disburse Funds</Button>
                    {/* Add "View Campaign Details" button linking back to Campaign Management page if needed */}
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
                            dataSource={campaignFundsData.filter(campaign => activeTabKey === 'fundraising')} // Adjust filter as needed
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                        />
                    </TabPane>

                    <TabPane tab="Awaiting Disbursement" key="disbursement">
                        <Table
                            loading={loading}
                            columns={awaitingDisbursementColumns}
                            dataSource={campaignFundsData.filter(campaign => activeTabKey === 'disbursement')} // Adjust filter as needed
                            rowKey="id"
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
                                        avatar={<UserOutlined />} // Or Avatar component if you have profile pictures
                                        title={<Text strong>{contributor.memberName || contributor.memberNickname || 'Anonymous'}</Text>} // Adjust data keys
                                        description={`Contributed Ksh ${contributor.amount.toLocaleString()} on ${contributor.contributionDate}`} // Adjust data keys
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
                                        title={`Ksh ${historyItem.amount.toLocaleString()} - Contributed by ${historyItem.memberName || historyItem.memberNickname || 'Anonymous'} on ${historyItem.contributionDate}`} // Adjust data keys
                                    />
                                    <Paragraph>
                                        Transaction ID: {historyItem.transactionId || 'N/A'} {/* Adjust data keys */}
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