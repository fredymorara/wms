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
    message,
    Form,        // Import Form
    Input,       // Import Input
    InputNumber, // Import InputNumber
    Tooltip,     // Import Tooltip
} from 'antd';
import {
    FundOutlined,
    HistoryOutlined,
    UserOutlined,
    DollarCircleOutlined, // Import Disburse Icon
    InfoCircleOutlined    // Import Info Icon
} from '@ant-design/icons';
import { API_URL } from '../../services/api'; // Assuming API_URL is correctly exported
import dayjs from 'dayjs';                   // Import dayjs

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input; // Import TextArea

const FundsManagementPage = () => {
    const [campaignFundsData, setCampaignFundsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTabKey, setActiveTabKey] = useState('fundraising'); // Default to fundraising overview
    const [selectedCampaign, setSelectedCampaign] = useState(null);

    // Modal States
    const [isContributorsModalVisible, setIsContributorsModalVisible] = useState(false);
    const [isContributionHistoryModalVisible, setIsContributionHistoryModalVisible] = useState(false);
    const [isDisburseModalVisible, setIsDisburseModalVisible] = useState(false); // State for new modal

    // Modal Data & Loading
    const [contributors, setContributors] = useState([]);
    const [contributionHistory, setContributionHistory] = useState([]);
    const [modalLoading, setModalLoading] = useState(false); // Use this for modal content loading

    // Action Loading (for buttons like the main Disburse button if kept, or modal confirm)
    const [isActionLoading, setIsActionLoading] = useState(false); // Can use this for the modal OK button

    // Mobile State
    const [isMobile, setIsMobile] = useState(false);

    // Form Instance for Disbursement Modal
    const [disburseForm] = Form.useForm();

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        // Ensure Content-Type is set for POST/PUT if sending JSON
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    // Fetch campaign funds data function
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/admin/campaigns`, { // Fetch ALL campaigns for client-side filtering
                headers: getAuthHeaders()
            });
            if (!response.ok) {
                let errorMsg = `HTTP error! status: ${response.status}`;
                try {
                    const errData = await response.json();
                    errorMsg = errData.message || errorMsg;
                } catch (e) { /* ignore json parsing error */ }
                throw new Error(errorMsg);
            }
            const data = await response.json();
            // Ensure data is an array, default to empty array if not
            setCampaignFundsData(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error("Error fetching campaign data:", e);
            setError(e.message);
            message.error(`Error fetching data: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on mount
    useEffect(() => {
        fetchData();
    }, []);

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // --- Contributor & History Modal Handlers (Keep Existing Logic) ---
    const showContributorsModal = async (record) => {
        setSelectedCampaign(record);
        setIsContributorsModalVisible(true);
        setContributors([]);
        setModalLoading(true); // Use modalLoading
        setError(null);
        try {
            const response = await fetch(`${API_URL}/admin/campaign-contributors/${record._id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Simpler header fetch
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setContributors(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e.message);
            message.error(`Failed to load contributors: ${e.message}`);
        } finally {
            setModalLoading(false); // Use modalLoading
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
        setModalLoading(true); // Use modalLoading
        setError(null);
        try {
            const response = await fetch(`${API_URL}/admin/campaign-contribution-history/${record._id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setContributionHistory(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e.message);
            message.error(`Failed to load history: ${e.message}`);
        } finally {
            setModalLoading(false); // Use modalLoading
        }
    };

    const handleContributionHistoryModalCancel = () => {
        setIsContributionHistoryModalVisible(false);
        setSelectedCampaign(null);
        setContributionHistory([]);
        setError(null);
    };

    // --- NEW: Disbursement Modal Handlers ---
    const showDisburseModal = (campaign) => {
        // Check if the campaign object is valid
        if (!campaign || !campaign._id) {
            message.error("Cannot disburse: Invalid campaign data.");
            return;
        }
        setSelectedCampaign(campaign); // Store the whole campaign object
        // Pre-fill form: default amount to currentAmount, clear others
        disburseForm.setFieldsValue({
            amount: campaign.currentAmount || 0,
            recipientPhone: '',
            recipientName: '',
            remarks: '',
        });
        setIsDisburseModalVisible(true); // Show the modal
    };

    const handleDisburseCancel = () => {
        setIsDisburseModalVisible(false);
        setSelectedCampaign(null); // Clear selected campaign
        disburseForm.resetFields(); // Reset form fields
    };

    const handleDisburseOk = async () => {
        try {
            // Validate form fields first
            const values = await disburseForm.validateFields();
            setIsActionLoading(true); // Use isActionLoading for the modal's OK button

            if (!selectedCampaign || !selectedCampaign._id) {
                throw new Error("Selected campaign is invalid or missing.");
            }

            // Prepare data for the API call
            const disbursementData = {
                recipientPhone: values.recipientPhone,
                amount: values.amount,
                recipientName: values.recipientName, // Optional field
                remarks: values.remarks,             // Optional field
            };

            // --- Call the NEW backend endpoint using fetch ---
            const response = await fetch(`${API_URL}/admin/campaigns/${selectedCampaign._id}/initiate-disbursement`, {
                method: 'POST',
                headers: getAuthHeaders(), // Use the helper to get headers
                body: JSON.stringify(disbursementData),
            });

            const result = await response.json(); // Attempt to parse JSON regardless of status

            if (!response.ok) {
                // Throw error with message from backend if available
                throw new Error(result.message || `HTTP error! status: ${response.status}`);
            }
            // --- End of API call ---

            message.success(result.message || 'Disbursement initiated successfully!');
            setIsDisburseModalVisible(false); // Close modal on success
            // Don't clear selectedCampaign here if needed for UI update before fetch
            disburseForm.resetFields(); // Reset form

            // Refresh the main campaign list to show updated status
            fetchData();

        } catch (errorInfo) {
            // Handle form validation errors or API errors
            if (errorInfo.name === 'ValidationError') {
                // Form Validation Error from validateFields()
                console.log('Disbursement Form Validation Failed:', errorInfo);
                message.error('Please check the form fields.');
            } else {
                // API Error or other error
                console.error('Disbursement Initiation Failed:', errorInfo);
                message.error(errorInfo.message || 'Failed to initiate disbursement.');
            }
        } finally {
            setIsActionLoading(false); // Turn off loading state for the OK button
            // Maybe clear selectedCampaign here if not needed after modal closes
            // setSelectedCampaign(null);
        }
    };
    // --- End of NEW Disbursement Handlers ---


    // --- Updated Status Renderer Function ---
    const renderCampaignStatus = (status, record) => {
        let color = 'default';
        // Ensure status is treated as a string, provide default if undefined/null
        let text = typeof status === 'string' ? status : 'unknown';
        let tooltipText = null;

        switch (text) {
            case 'active': color = 'processing'; break; // Use 'processing' for blue animated dot
            case 'pending_approval': color = 'warning'; text = 'Pending'; break;
            case 'ended': color = 'default'; break; // Grey
            case 'rejected': color = 'error'; break; // Red
            case 'disbursing':
                color = 'processing'; // Blue animated dot
                text = 'Disbursing';
                // Use record?.disbursementStatus for safety
                tooltipText = `B2C Status: ${record?.disbursementStatus || 'processing'}`;
                break;
            case 'disbursed':
                color = 'success'; // Green
                text = 'Disbursed';
                tooltipText = `Receipt: ${record?.disbursementMpesaReceipt || 'N/A'}`;
                break;
            case 'disbursement_failed':
                color = 'error'; // Red
                text = 'Failed';
                tooltipText = `Reason: ${record?.disbursementResultDesc || 'Unknown'}`;
                break;
            default: color = 'default'; text = text.toUpperCase(); break; // Default handling
        }

        // Replace underscores and capitalize (moved after switch for default case)
        const displayText = text.replace(/_/g, ' ').toUpperCase();
        const tag = <Tag color={color}>{displayText}</Tag>;

        return tooltipText ? <Tooltip title={tooltipText}>{tag}</Tooltip> : tag;
    };


    // --- Table Columns Definitions ---
    const fundraisingOverviewColumns = [
        { title: 'Campaign Title', dataIndex: 'title', key: 'title', ellipsis: true },
        // { title: 'Tracking #', dataIndex: 'trackingNumber', key: 'trackingNumber' }, // Removed for space maybe? Add back if needed.
        { title: 'Goal (KES)', dataIndex: 'goalAmount', key: 'goalAmount', render: (text) => (text || 0).toLocaleString() },
        { title: 'Raised (KES)', dataIndex: 'currentAmount', key: 'currentAmount', render: (text) => (text || 0).toLocaleString() },
        {
            title: '% Raised',
            key: 'percentageRaised', // Calculate percentage
            render: (_, record) => {
                const percentage = record.goalAmount && record.goalAmount > 0 ? Math.min(Math.round((record.currentAmount / record.goalAmount) * 100), 100) : 0;
                return <Progress percent={percentage || 0} size="small" status="active" />; // Removed strokeColor
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: renderCampaignStatus, // Use the updated shared renderer
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (date) => date ? dayjs(date).format('DD MMM YYYY') : 'N/A'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="small"> {/* Use small space */}
                    <Tooltip title="View Contributors">
                        <Button size="small" icon={<UserOutlined />} onClick={() => showContributorsModal(record)} />
                    </Tooltip>
                    <Tooltip title="View Contribution History">
                        <Button size="small" icon={<HistoryOutlined />} onClick={() => showContributionHistoryModal(record)} />
                    </Tooltip>
                    {/* Info icon for rejected reason */}
                    {record.status === 'rejected' && record.rejectionReason && (
                        <Tooltip title={`Reason: ${record.rejectionReason}`}>
                            <InfoCircleOutlined style={{ color: 'red' }} />
                        </Tooltip>
                    )}
                    {/* Info icon for failed disbursement reason */}
                    {record.status === 'disbursement_failed' && (record.disbursementResultDesc || record.disbursementStatus === 'timeout') && (
                        <Tooltip title={`Reason: ${record.disbursementResultDesc || 'Timeout'}`}>
                            <InfoCircleOutlined style={{ color: 'red' }} />
                        </Tooltip>
                    )}
                </Space>
            ),
        },
    ];

    const awaitingDisbursementColumns = [
        { title: 'Campaign Title', dataIndex: 'title', key: 'title', ellipsis: true },
        // { title: 'Tracking #', dataIndex: 'trackingNumber', key: 'trackingNumber' },
        { title: 'Final Amount Raised (KES)', dataIndex: 'currentAmount', key: 'finalAmountRaised', render: (text) => (text || 0).toLocaleString() },
        { title: 'End Date', dataIndex: 'endDate', key: 'endDate', render: (date) => date ? dayjs(date).format('DD MMM YYYY') : 'N/A' },
        // { title: 'Beneficiary', dataIndex: 'beneficiaryName', key: 'beneficiaryName' }, // Assuming this field exists
        { title: 'Status', dataIndex: 'status', key: 'status', render: renderCampaignStatus }, // Show status here too
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => {
                // Determine if disbursement is possible
                const canDisburse = record.status === 'ended' &&
                    !['disbursing', 'disbursed', 'disbursement_failed'].includes(record.status) &&
                    !['processing', 'completed', 'failed', 'timeout'].includes(record.disbursementStatus); // Check secondary status too

                return (
                    <Space size="small">
                        <Tooltip title={canDisburse ? "Initiate Funds Disbursement" : "Disbursement not available or in progress/completed/failed"}>
                            <Button
                                type="primary"
                                icon={<DollarCircleOutlined />}
                                onClick={() => showDisburseModal(record)}
                                // Disable based on status conditions
                                disabled={!canDisburse || isActionLoading} // Disable if already loading an action
                                loading={selectedCampaign?._id === record._id && isActionLoading} // Show loading only on the clicked button's row maybe? Or use general modal loading
                                style={canDisburse ? { backgroundColor: '#52c41a', borderColor: '#52c41a', color: 'white' } : {}} // Green if ready
                                size="small"
                            >
                                Disburse
                            </Button>
                        </Tooltip>
                        {/* Optionally add view history/contributors buttons here too if needed */}
                        <Tooltip title="View Contribution History">
                            <Button size="small" icon={<HistoryOutlined />} onClick={() => showContributionHistoryModal(record)} />
                        </Tooltip>
                    </Space>
                );
            }
        },
    ];

    // --- Client-Side Filtering Logic ---
    const getFilteredData = () => {
        if (!Array.isArray(campaignFundsData)) return []; // Handle case where data isn't an array

        switch (activeTabKey) {
            case 'fundraising':
                // Show active or pending campaigns in the overview
                return campaignFundsData.filter(c => ['active', 'pending_approval'].includes(c.status));
            case 'disbursement':
                // Show campaigns that are ended AND haven't started/finished/failed disbursement
                return campaignFundsData.filter(c => c.status === 'ended' && !['disbursing', 'disbursed', 'disbursement_failed'].includes(c.status));
            case 'disbursing': // Add tab for campaigns currently disbursing
                return campaignFundsData.filter(c => c.status === 'disbursing');
            case 'disbursed': // Add tab for completed disbursements
                return campaignFundsData.filter(c => c.status === 'disbursed');
            case 'failed': // Add tab for failed disbursements
                return campaignFundsData.filter(c => c.status === 'disbursement_failed');
            default:
                return campaignFundsData; // Or handle other tabs if added
        }
    };


    return (
        // Using AdminLayout assumed from original code
        <AdminLayout>
            <div style={{ padding: isMobile ? '12px' : '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Title level={2} style={{ color: 'maroon' }}>
                        Funds Management
                    </Title>
                    <Paragraph>
                        Overview of campaign fundraising, manage disbursements, and track financial activity.
                    </Paragraph>
                </div>

                {/* Display general loading spinner */}
                {loading && <Spin tip="Loading Funds Data..." style={{ display: 'block', marginBottom: 24 }} />}
                {/* Display fetch error */}
                {error && !loading && <Alert message={`${error}`} type="error" closable onClose={() => setError(null)} style={{ marginBottom: 24 }} />}

                {!loading && !error && ( // Only show tabs and tables if no loading/error
                    <Tabs activeKey={activeTabKey} onChange={setActiveTabKey} centered>
                        <TabPane tab="Fundraising Overview" key="fundraising">
                            <Table
                                // loading={loading} // Loading handled outside Tabs now
                                columns={fundraisingOverviewColumns}
                                dataSource={getFilteredData()} // Use filtered data
                                rowKey="_id"
                                pagination={{ pageSize: 10, current: 1 }} // Add basic pagination config
                                scroll={{ x: 'max-content' }} // Add horizontal scroll
                                size="small"
                            />
                        </TabPane>

                        <TabPane tab="Awaiting Disbursement" key="disbursement">
                            <Table
                                // loading={loading}
                                columns={awaitingDisbursementColumns}
                                dataSource={getFilteredData()} // Use filtered data
                                rowKey="_id"
                                pagination={{ pageSize: 10, current: 1 }}
                                scroll={{ x: 'max-content' }}
                                size="small"
                            />
                        </TabPane>

                        {/* Optional: Add tabs for other states */}
                        <TabPane tab="Disbursing" key="disbursing">
                            <Table columns={fundraisingOverviewColumns} dataSource={getFilteredData()} rowKey="_id" pagination={{ pageSize: 10 }} scroll={{ x: 'max-content' }} size="small" />
                        </TabPane>
                        <TabPane tab="Disbursed" key="disbursed">
                            <Table columns={fundraisingOverviewColumns} dataSource={getFilteredData()} rowKey="_id" pagination={{ pageSize: 10 }} scroll={{ x: 'max-content' }} size="small" />
                        </TabPane>
                        <TabPane tab="Failed/Rejected" key="failed">
                            <Table columns={fundraisingOverviewColumns} dataSource={campaignFundsData.filter(c => ['disbursement_failed', 'rejected'].includes(c.status))} rowKey="_id" pagination={{ pageSize: 10 }} scroll={{ x: 'max-content' }} size="small" />
                        </TabPane>

                    </Tabs>
                )}

                {/* --- Modals --- */}

                {/* Contributors Modal (Uses List - Kept Original Style) */}
                <Modal
                    title={selectedCampaign ? `Contributors to ${selectedCampaign.title}` : 'Contributors'}
                    visible={isContributorsModalVisible}
                    onCancel={handleContributorsModalCancel}
                    footer={null}
                    width={isMobile ? '95%' : '50%'}
                >
                    {/* Use modalLoading state here */}
                    {modalLoading && <Spin tip="Loading Contributors..." style={{ display: 'block', margin: '20px 0' }} />}
                    {/* Display specific modal error if needed, or rely on main error state */}
                    {/* {!modalLoading && error && <Alert message={`Error: ${error}`} type="error" />} */}

                    {!modalLoading && contributors.length > 0 && (
                        <List
                            size="small"
                            dataSource={contributors}
                            renderItem={(contributor) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<UserOutlined />}
                                        title={<Text strong>{contributor.memberName || 'N/A'}</Text>}
                                    // description={contributor.email || ''} // Add description if needed
                                    />
                                </List.Item>
                            )}
                        />
                    )}
                    {!modalLoading && contributors.length === 0 && (
                        <Alert message="No contributions found for this campaign." type="info" showIcon />
                    )}
                </Modal>

                {/* Contribution History Modal (Uses List - Kept Original Style) */}
                <Modal
                    title={selectedCampaign ? `Contribution History for ${selectedCampaign.title}` : 'Contribution History'}
                    visible={isContributionHistoryModalVisible}
                    onCancel={handleContributionHistoryModalCancel}
                    footer={null}
                    width={isMobile ? '95%' : '70%'}
                >
                    {modalLoading && <Spin tip="Loading Contribution History..." style={{ display: 'block', margin: '20px 0' }} />}
                    {/* {!modalLoading && error && <Alert message={`Error: ${error}`} type="error" />} */}

                    {!modalLoading && contributionHistory.length > 0 && (
                        <List
                            size="small"
                            dataSource={contributionHistory}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={<Text strong>{item.memberName || 'N/A'} - KES {item.amount?.toLocaleString() || 0}</Text>}
                                        description={
                                            <div>
                                                <Text>Date: {item.contributionDate ? dayjs(item.contributionDate).format('DD MMM YYYY, HH:mm') : 'N/A'}</Text><br />
                                                <Text>Method: {item.paymentMethod || 'N/A'}</Text> | Status: <Tag color={item.status === 'completed' ? 'success' : 'default'}>{item.status?.toUpperCase() || 'N/A'}</Tag><br />
                                                <Text style={{ fontSize: '0.8em', color: '#888' }}>Trans ID: {item.transactionId || 'N/A'}</Text>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    )}
                    {!modalLoading && contributionHistory.length === 0 && (
                        <Alert message="No contribution history available." type="info" showIcon />
                    )}
                </Modal>

                {/* --- NEW Disbursement Modal --- */}
                <Modal
                    title={`Disburse Funds for: ${selectedCampaign?.title || ''}`}
                    visible={isDisburseModalVisible}
                    onOk={handleDisburseOk} // Trigger validation and API call
                    onCancel={handleDisburseCancel}
                    confirmLoading={isActionLoading} // Show loading state on OK button using isActionLoading
                    okText="Initiate Disbursement"
                    destroyOnClose // Reset form state when modal is closed
                    width={isMobile ? '95%' : '600px'} // Adjust width
                >
                    {/* Modal content loading can be handled by confirmLoading, or add Spin here if needed */}
                    {/* <Spin spinning={modalLoading}> */}
                    <Paragraph>
                        Available Funds: <Text strong>KES {selectedCampaign?.currentAmount?.toLocaleString() || 0}</Text>
                    </Paragraph>
                    <Form
                        form={disburseForm}
                        layout="vertical"
                        name="disbursement_form"
                    // initialValues={{ amount: selectedCampaign?.currentAmount || 0 }} // Handled by setFieldsValue now
                    >
                        <Form.Item
                            name="recipientPhone"
                            label="Recipient M-Pesa Phone Number"
                            rules={[
                                { required: true, message: 'Recipient phone number is required!' },
                                { pattern: /^(07|2547)\d{8}$/, message: 'Enter Kenyan format (e.g., 07... or 2547...)' }
                            ]}
                        >
                            <Input placeholder="e.g., 0712345678" />
                        </Form.Item>

                        <Form.Item
                            name="amount"
                            label="Amount to Disburse (KES)"
                            rules={[
                                { required: true, message: 'Amount is required!' },
                                { type: 'number', min: 1, message: 'Amount must be at least KES 1' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const available = selectedCampaign?.currentAmount || 0;
                                        if (!value || value <= available) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error(`Amount cannot exceed KES ${available.toLocaleString()}`));
                                    },
                                }),
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                min={1}
                                max={selectedCampaign?.currentAmount || 1} // Set max based on campaign
                                step={100} // Optional step
                                precision={0} // No decimals for KES typically
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} // Add comma separators
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')} // Remove formatting on parse
                                placeholder="Enter amount to send"
                            />
                        </Form.Item>

                        <Form.Item
                            name="recipientName"
                            label="Recipient Name (Optional)"
                        >
                            <Input placeholder="Recipient's name (optional)" />
                        </Form.Item>

                        <Form.Item
                            name="remarks"
                            label="Remarks (Optional, max 100 chars)"
                            rules={[{ max: 100, message: 'Remarks exceed 100 characters' }]}
                        >
                            <TextArea rows={2} placeholder="Short note for transaction statement" />
                        </Form.Item>
                    </Form>
                    {/* </Spin> */}
                </Modal>

            </div>
        </AdminLayout>
    );
};

export default FundsManagementPage;