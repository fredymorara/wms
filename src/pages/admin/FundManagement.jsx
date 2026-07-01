import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { Typography, Table, Button, Spin, Alert, Progress, Tag, Space, Tooltip, Modal, List } from 'antd';
import { HistoryOutlined, UserOutlined, DollarCircleOutlined, InfoCircleOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import DisbursementModal from './components/DisbursementModal';
import { useFunds } from '../../hooks/useFunds';

const { Title, Paragraph, Text } = Typography;

const FundsManagementPage = () => {
    const { campaignFundsData, loading, error, actionLoading, fetchCampaignFundsData, fetchContributors, fetchContributionHistory, disburseFunds } = useFunds();
    
    const [activeTabKey, setActiveTabKey] = useState('fundraising');
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    
    const [isContributorsModalVisible, setIsContributorsModalVisible] = useState(false);
    const [contributors, setContributors] = useState([]);
    
    const [isContributionHistoryModalVisible, setIsContributionHistoryModalVisible] = useState(false);
    const [contributionHistory, setContributionHistory] = useState([]);
    
    const [isDisburseModalVisible, setIsDisburseModalVisible] = useState(false);
    
    const [modalLoading, setModalLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        fetchCampaignFundsData();
    }, [fetchCampaignFundsData]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const showContributorsModal = async (record) => {
        setSelectedCampaign(record);
        setIsContributorsModalVisible(true);
        setModalLoading(true);
        const data = await fetchContributors(record._id);
        setContributors(data);
        setModalLoading(false);
    };

    const showContributionHistoryModal = async (record) => {
        setSelectedCampaign(record);
        setIsContributionHistoryModalVisible(true);
        setModalLoading(true);
        const data = await fetchContributionHistory(record._id);
        setContributionHistory(data);
        setModalLoading(false);
    };

    const showDisburseModal = (campaign) => {
        setSelectedCampaign(campaign);
        setIsDisburseModalVisible(true);
    };

    const handleDisburse = async (campaignId, disbursementData) => {
        const success = await disburseFunds(campaignId, disbursementData);
        if (success) {
            setIsDisburseModalVisible(false);
        }
        return success;
    };

    const renderCampaignStatus = (status, record) => {
        let color = 'default';
        let text = typeof status === 'string' ? status : 'unknown';
        let tooltipText = null;
        let colorClass = 'bg-zinc-100 text-zinc-700'; // Default Tailwind

        switch (text) {
            case 'active': 
                colorClass = 'bg-blue-100 text-blue-700'; 
                break;
            case 'pending_approval': 
                colorClass = 'bg-yellow-100 text-yellow-800'; 
                text = 'Pending'; 
                break;
            case 'ended': 
                colorClass = 'bg-zinc-100 text-zinc-700'; 
                break;
            case 'rejected': 
                colorClass = 'bg-red-100 text-red-700'; 
                break;
            case 'disbursing':
                colorClass = 'bg-blue-100 text-blue-700';
                text = 'Disbursing';
                tooltipText = `B2C Status: ${record?.disbursementStatus || 'processing'}`;
                break;
            case 'disbursed':
                colorClass = 'bg-green-100 text-green-700';
                text = 'Disbursed';
                tooltipText = `Receipt: ${record?.disbursementMpesaReceipt || 'N/A'}`;
                break;
            case 'disbursement_failed':
                colorClass = 'bg-red-100 text-red-700';
                text = 'Failed';
                tooltipText = `Reason: ${record?.disbursementResultDesc || 'Unknown'}`;
                break;
            default: 
                text = text.toUpperCase(); 
                break;
        }

        const displayText = text.replace(/_/g, ' ').toUpperCase();
        const tag = <span className={`${colorClass} px-2.5 py-1 rounded-full text-xs font-bold tracking-wide`}>{displayText}</span>;
        return tooltipText ? <Tooltip title={tooltipText}>{tag}</Tooltip> : tag;
    };

    const commonColumns = [
        { title: 'Campaign Title', dataIndex: 'title', key: 'title', ellipsis: true, render: (text) => <span className="font-semibold text-zinc-800">{text}</span> },
        { title: 'Goal (KES)', dataIndex: 'goalAmount', key: 'goalAmount', render: (text) => <span className="text-zinc-600 font-medium">{(text || 0).toLocaleString()}</span> },
        { title: 'Raised (KES)', dataIndex: 'currentAmount', key: 'currentAmount', render: (text) => <span className="font-bold text-green-700">{(text || 0).toLocaleString()}</span> },
        {
            title: '% Raised',
            key: 'percentageRaised',
            width: 150,
            render: (_, record) => {
                const percentage = record.goalAmount && record.goalAmount > 0 ? Math.min(Math.round((record.currentAmount / record.goalAmount) * 100), 100) : 0;
                return <Progress percent={percentage || 0} size="small" status="active" strokeColor="#800000" trailColor="#f4f4f5" />;
            }
        },
        { title: 'End Date', dataIndex: 'endDate', key: 'endDate', render: (date) => <span className="text-zinc-500">{date ? dayjs(date).format('DD MMM YYYY') : 'N/A'}</span> },
        { title: 'Status', dataIndex: 'status', key: 'status', render: renderCampaignStatus },
        { title: 'Actions', key: 'actions', render: (_, record) => (
            <Space size="small">
                <Tooltip title="View Contributors">
                    <Button size="small" icon={<UserOutlined />} onClick={() => showContributorsModal(record)} className="rounded-md border-zinc-200 text-zinc-600 hover:text-[#800000] hover:border-[#800000]" />
                </Tooltip>
                <Tooltip title="View Contribution History">
                    <Button size="small" icon={<HistoryOutlined />} onClick={() => showContributionHistoryModal(record)} className="rounded-md border-zinc-200 text-zinc-600 hover:text-[#800000] hover:border-[#800000]" />
                </Tooltip>
                {record.status === 'rejected' && record.rejectionReason && <Tooltip title={`Reason: ${record.rejectionReason}`}><InfoCircleOutlined className="text-red-500" /></Tooltip>}
                {record.status === 'disbursement_failed' && (record.disbursementResultDesc || record.disbursementStatus === 'timeout') && <Tooltip title={`Reason: ${record.disbursementResultDesc || 'Timeout'}`}><InfoCircleOutlined className="text-red-500" /></Tooltip>}
            </Space>
        )},
    ];

    const awaitingDisbursementColumns = [
        { title: 'Campaign Title', dataIndex: 'title', key: 'title', ellipsis: true, render: (text) => <span className="font-semibold text-zinc-800">{text}</span> },
        { title: 'Final Amount Raised (KES)', dataIndex: 'currentAmount', key: 'finalAmountRaised', render: (text) => <span className="font-bold text-green-700">{(text || 0).toLocaleString()}</span> },
        { title: 'End Date', dataIndex: 'endDate', key: 'endDate', render: (date) => <span className="text-zinc-500">{date ? dayjs(date).format('DD MMM YYYY') : 'N/A'}</span> },
        { title: 'Status', dataIndex: 'status', key: 'status', render: renderCampaignStatus },
        { title: 'Actions', key: 'actions', render: (_, record) => {
            const canDisburse = record.status === 'ended' && !['disbursing', 'disbursed', 'disbursement_failed'].includes(record.status) && !['processing', 'completed', 'failed', 'timeout'].includes(record.disbursementStatus);
            return (
                <Space size="small">
                    <Tooltip title={canDisburse ? "Initiate Funds Disbursement" : "Disbursement not available or in progress/completed/failed"}>
                        <Button 
                            icon={<DollarCircleOutlined />} 
                            onClick={() => showDisburseModal(record)} 
                            disabled={!canDisburse || actionLoading} 
                            loading={selectedCampaign?._id === record._id && actionLoading} 
                            className={canDisburse ? "bg-[#b5e487] text-[#800000] border-none font-bold shadow-sm rounded-lg hover:opacity-90 text-xs h-7 px-3" : "rounded-lg text-xs h-7 px-3"}
                            size="small"
                        >
                            Disburse
                        </Button>
                    </Tooltip>
                    <Tooltip title="View Contribution History">
                        <Button size="small" icon={<HistoryOutlined />} onClick={() => showContributionHistoryModal(record)} className="rounded-lg border-zinc-200 text-zinc-600 hover:text-[#800000] hover:border-[#800000] h-7" />
                    </Tooltip>
                </Space>
            );
        }},
    ];

    const getFilteredData = () => {
        if (!Array.isArray(campaignFundsData)) return [];
        switch (activeTabKey) {
            case 'fundraising': return campaignFundsData.filter(c => ['active', 'pending_approval'].includes(c.status));
            case 'disbursement': return campaignFundsData.filter(c => c.status === 'ended' && !['disbursing', 'disbursed', 'disbursement_failed'].includes(c.status));
            case 'disbursing': return campaignFundsData.filter(c => c.status === 'disbursing');
            case 'disbursed': return campaignFundsData.filter(c => c.status === 'disbursed');
            case 'failed': return campaignFundsData.filter(c => ['disbursement_failed', 'rejected'].includes(c.status));
            default: return campaignFundsData;
        }
    };

    const tabs = [
        { key: 'fundraising', label: 'Fundraising Overview' },
        { key: 'disbursement', label: 'Awaiting Disbursement' },
        { key: 'disbursing', label: 'Disbursing' },
        { key: 'disbursed', label: 'Disbursed' },
        { key: 'failed', label: 'Failed/Rejected' }
    ];

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-12">
                <div className="text-center space-y-2 mb-10">
                    <Title level={2} className="!text-[#800000] !mb-0">Funds Management</Title>
                    <Paragraph className="text-zinc-500 max-w-2xl mx-auto">
                        Overview of campaign fundraising, manage disbursements, and track financial activity.
                    </Paragraph>
                </div>

                {loading && <div className="flex justify-center my-12"><Spin tip="Loading Funds Data..." size="large" /></div>}
                {error && !loading && <Alert message={`${error}`} type="error" closable className="mb-8 rounded-xl" />}

                {!loading && !error && (
                    <div className="space-y-6">
                        {/* Modern Pill Tabs - Responsive scrollable */}
                        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                            <div className="flex p-1.5 bg-white border border-zinc-200 rounded-2xl shadow-sm w-fit min-w-min">
                                {tabs.map(tab => (
                                    <button 
                                        key={tab.key}
                                        onClick={() => setActiveTabKey(tab.key)}
                                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTabKey === tab.key ? 'bg-[#800000] text-white shadow-md' : 'text-zinc-600 hover:bg-zinc-50'}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Direct Table Container (No outer card) */}
                        <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
                            <Table 
                                columns={activeTabKey === 'disbursement' ? awaitingDisbursementColumns : commonColumns} 
                                dataSource={getFilteredData()} 
                                rowKey="_id" 
                                pagination={{ pageSize: 10, className: "px-6 py-4" }} 
                                scroll={{ x: 'max-content' }} 
                                className="[&_.ant-table-thead_th]:bg-zinc-50/80 [&_.ant-table-thead_th]:text-zinc-500 [&_.ant-table-thead_th]:font-semibold [&_.ant-table-thead_th]:border-b-zinc-200 [&_.ant-table-tbody_td]:border-b-zinc-100"
                            />
                        </div>
                    </div>
                )}

                {/* Modals with matching styling */}
                <Modal 
                    title={<Title level={4} className="!text-[#800000] !mb-0">{selectedCampaign ? `Contributors to ${selectedCampaign.title}` : 'Contributors'}</Title>} 
                    visible={isContributorsModalVisible} 
                    onCancel={() => setIsContributorsModalVisible(false)} 
                    footer={null} 
                    width={isMobile ? '95%' : 600} 
                    className="rounded-3xl overflow-hidden [&_.ant-modal-content]:rounded-3xl [&_.ant-modal-header]:bg-zinc-50/50 [&_.ant-modal-header]:border-b [&_.ant-modal-header]:border-zinc-100 [&_.ant-modal-header]:pb-4 [&_.ant-modal-header]:pt-6"
                >
                    <div className="pt-6">
                        {modalLoading && <div className="flex justify-center my-8"><Spin tip="Loading Contributors..." /></div>}
                        {!modalLoading && contributors.length > 0 && (
                            <List 
                                size="large" 
                                dataSource={contributors} 
                                className="[&_.ant-list-item]:border-b-zinc-100"
                                renderItem={(c) => (
                                    <List.Item>
                                        <List.Item.Meta 
                                            avatar={<div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center"><UserOutlined className="text-zinc-400" /></div>} 
                                            title={<span className="font-semibold text-zinc-800 text-base">{c.memberName || 'N/A'}</span>} 
                                        />
                                    </List.Item>
                                )} 
                            />
                        )}
                        {!modalLoading && contributors.length === 0 && <Alert message="No contributions found." type="info" showIcon className="rounded-xl" />}
                    </div>
                </Modal>

                <Modal 
                    title={<Title level={4} className="!text-[#800000] !mb-0">{selectedCampaign ? `Contribution History: ${selectedCampaign.title}` : 'Contribution History'}</Title>} 
                    visible={isContributionHistoryModalVisible} 
                    onCancel={() => setIsContributionHistoryModalVisible(false)} 
                    footer={null} 
                    width={isMobile ? '95%' : 700} 
                    className="rounded-3xl overflow-hidden [&_.ant-modal-content]:rounded-3xl [&_.ant-modal-header]:bg-zinc-50/50 [&_.ant-modal-header]:border-b [&_.ant-modal-header]:border-zinc-100 [&_.ant-modal-header]:pb-4 [&_.ant-modal-header]:pt-6"
                >
                    <div className="pt-6">
                        {modalLoading && <div className="flex justify-center my-8"><Spin tip="Loading Contribution History..." /></div>}
                        {!modalLoading && contributionHistory.length > 0 && (
                            <List 
                                size="large" 
                                dataSource={contributionHistory} 
                                className="[&_.ant-list-item]:border-b-zinc-100"
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-bold text-zinc-800">{item.memberName || 'N/A'}</span>
                                                    <span className="font-bold text-green-700">KES {item.amount?.toLocaleString() || 0}</span>
                                                </div>
                                            }
                                            description={
                                                <div className="flex justify-between items-center text-sm">
                                                    <div className="text-zinc-500">
                                                        <span>{item.contributionDate ? dayjs(item.contributionDate).format('DD MMM YYYY, HH:mm') : 'N/A'}</span>
                                                        <span className="mx-2">•</span>
                                                        <span className="font-mono text-xs">{item.transactionId || 'N/A'}</span>
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                                        {item.status || 'N/A'}
                                                    </span>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )} 
                            />
                        )}
                        {!modalLoading && contributionHistory.length === 0 && <Alert message="No contribution history available." type="info" showIcon className="rounded-xl" />}
                    </div>
                </Modal>

                <DisbursementModal 
                    visible={isDisburseModalVisible} 
                    campaign={selectedCampaign} 
                    onCancel={() => setIsDisburseModalVisible(false)} 
                    onDisburse={handleDisburse} 
                    loading={actionLoading} 
                    isMobile={isMobile} 
                />
            </div>
        </AdminLayout>
    );
};

export default FundsManagementPage;