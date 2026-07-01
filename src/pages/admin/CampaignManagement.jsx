import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { Typography, Input, Table, Button, Alert, Spin, Space, Progress, Statistic, Row, Col, Empty } from 'antd';
import { PlusOutlined, SearchOutlined, SafetyOutlined, AlertOutlined, AimOutlined, DollarCircleOutlined } from '@ant-design/icons';
import CreateCampaignModal from '../../pages/admin/CreateCampaignModal';
import CampaignDetailsModal from './components/CampaignDetailsModal';
import ApprovalModal from './components/ApprovalModal';
import { useCampaigns } from '../../hooks/useCampaigns';

const { Title, Paragraph, Text } = Typography;

const CampaignManagementPage = () => {
    const { campaigns, loading, error, actionLoading, fetchCampaigns, endCampaign, approveCampaign, rejectCampaign } = useCampaigns();
    
    const [searchText, setSearchText] = useState('');
    const [isMobile, setIsMobile] = useState(false);

    const [selectedCampaignForDetails, setSelectedCampaignForDetails] = useState(null);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    
    const [selectedCampaignForApproval, setSelectedCampaignForApproval] = useState(null);
    const [isApprovalModalVisible, setIsApprovalModalVisible] = useState(false);
    
    const [isCreateCampaignModalVisible, setIsCreateCampaignModalVisible] = useState(false);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Filter campaigns based on search text globally
    const filteredCampaigns = useMemo(() => {
        if (!searchText) return campaigns;
        return campaigns.filter(c =>
            c.title.toLowerCase().includes(searchText.toLowerCase()) ||
            (c.trackingNumber && c.trackingNumber.toLowerCase().includes(searchText.toLowerCase())) ||
            c.description.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [campaigns, searchText]);

    // Categorize campaigns
    const pendingCampaigns = useMemo(() => filteredCampaigns.filter(c => c.status === 'pending_approval'), [filteredCampaigns]);
    const activeCampaigns = useMemo(() => filteredCampaigns.filter(c => c.status === 'active'), [filteredCampaigns]);
    const campaignRecords = useMemo(() => filteredCampaigns.filter(c => c.status !== 'pending_approval' && c.status !== 'active'), [filteredCampaigns]);

    // Calculate metrics
    const metrics = useMemo(() => {
        let activeCount = 0;
        let pendingCount = 0;
        let totalGoal = 0;
        let totalRaised = 0;

        campaigns.forEach(c => {
            if (c.status === 'active') {
                activeCount++;
                totalGoal += c.goalAmount || 0;
                totalRaised += c.currentAmount || 0;
            } else if (c.status === 'pending_approval') {
                pendingCount++;
            }
        });

        return { activeCount, pendingCount, totalGoal, totalRaised };
    }, [campaigns]);

    const showDetailsModal = (record) => {
        setSelectedCampaignForDetails(record);
        setIsDetailsModalVisible(true);
    };

    const showApprovalModal = (record) => {
        setSelectedCampaignForApproval(record);
        setIsApprovalModalVisible(true);
    };

    const handleApprove = async (id) => {
        await approveCampaign(id);
        setIsApprovalModalVisible(false);
    };

    const handleReject = async (id, reason) => {
        await rejectCampaign(id, reason);
        setIsApprovalModalVisible(false);
    };

    const activeCampaignsColumns = [
        { 
            title: 'Campaign Details', 
            dataIndex: 'title', 
            key: 'title', 
            render: (text, record) => (
                <div>
                    <button onClick={() => showDetailsModal(record)} className="text-[#800000] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer text-left text-base">
                        {text}
                    </button>
                    <div className="text-zinc-500 text-xs mt-1.5 bg-zinc-100 w-max px-2.5 py-0.5 rounded-full font-medium">
                        {record.category || 'General'}
                    </div>
                </div>
            )
        },
        { 
            title: 'Funding Goal', 
            key: 'funding', 
            render: (_, record) => (
                <div className="flex flex-col">
                    <span className="font-bold text-green-700 text-base">KES {(record.currentAmount || 0).toLocaleString()}</span>
                    <span className="text-xs text-zinc-400 font-medium mt-0.5">of KES {(record.goalAmount || 0).toLocaleString()}</span>
                </div>
            ) 
        },
        {
            title: 'Progress',
            key: 'progress',
            width: 180,
            render: (_, record) => {
                const percentage = record.goalAmount && record.goalAmount > 0 ? Math.min(Math.round((record.currentAmount / record.goalAmount) * 100), 100) : 0;
                return <Progress percent={percentage} size="small" strokeColor="#800000" trailColor="#f4f4f5" format={(percent) => <span className="text-xs font-bold text-zinc-600">{percent}%</span>} />;
            }
        },
        { 
            title: 'End Date', 
            dataIndex: 'endDate', 
            key: 'endDate', 
            render: (date) => <span className="text-zinc-600 font-medium">{new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span> 
        },
        { 
            title: 'Actions', 
            key: 'actions', 
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showDetailsModal(record)} className="rounded-lg border-zinc-200 text-zinc-600 hover:text-[#800000] hover:border-[#800000] font-medium shadow-sm">View Details</Button>
                    <Button danger onClick={() => endCampaign(record._id)} loading={actionLoading} className="rounded-lg font-bold border-red-200 text-red-600 bg-red-50 hover:bg-red-100 shadow-sm">End</Button>
                </Space>
            )
        },
    ];

    const pendingApprovalColumns = [
        { 
            title: 'Campaign Details', 
            dataIndex: 'title', 
            key: 'title', 
            render: (text, record) => (
                <div>
                    <button onClick={() => showApprovalModal(record)} className="text-[#800000] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer text-left text-base">
                        {text}
                    </button>
                    <div className="text-zinc-500 text-xs mt-1.5 bg-orange-50 text-orange-600 border border-orange-100 w-max px-2.5 py-0.5 rounded-full font-medium">
                        {record.category || 'Welfare'}
                    </div>
                </div>
            )
        },
        { 
            title: 'Date Requested', 
            dataIndex: 'createdAt', 
            key: 'createdAt', 
            render: (date) => (
                <span className="text-zinc-600 font-medium">{new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            ) 
        },
        { 
            title: 'Actions', 
            key: 'actions', 
            render: (_, record) => (
                <Button size="middle" onClick={() => showApprovalModal(record)} className="rounded-xl font-bold border-[#b5e487] text-[#800000] bg-[#b5e487] hover:bg-[#a0d470] hover:text-[#600000] shadow-sm">
                    Review Request
                </Button>
            ) 
        },
    ];

    const campaignRecordsColumns = [
        { 
            title: 'Campaign Details', 
            dataIndex: 'title', 
            key: 'title', 
            render: (text, record) => (
                <div>
                    <button onClick={() => showDetailsModal(record)} className="text-[#800000] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer text-left text-base">
                        {text}
                    </button>
                    <div className="text-zinc-500 text-xs mt-1.5 bg-zinc-100 w-max px-2.5 py-0.5 rounded-full font-medium">
                        {record.category || 'General'}
                    </div>
                </div>
            )
        },
        { 
            title: 'Target (KES)', 
            dataIndex: 'goalAmount', 
            key: 'targetAmount', 
            render: (text) => <span className="font-medium text-zinc-500">{(text || 0).toLocaleString()}</span> 
        },
        { 
            title: 'Final Raised', 
            dataIndex: 'currentAmount', 
            key: 'currentAmount', 
            render: (text) => <span className="font-bold text-zinc-800 text-base">KES {(text || 0).toLocaleString()}</span> 
        },
        { 
            title: 'End Date', 
            dataIndex: 'endDate', 
            key: 'endDate', 
            render: (date) => <span className="text-zinc-600 font-medium">{new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span> 
        },
        { 
            title: 'Status', 
            dataIndex: 'status', 
            key: 'status', 
            render: (status) => {
                let colorClass = 'bg-zinc-50 text-zinc-600 border-zinc-200';
                if (status === 'ended') colorClass = 'bg-blue-50 text-blue-700 border-blue-200';
                if (status === 'approved') colorClass = 'bg-green-50 text-green-700 border-green-200';
                if (status === 'rejected') colorClass = 'bg-red-50 text-red-700 border-red-200';
                return <span className={`${colorClass} border px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide`}>{status.replace('_', ' ')}</span>;
            }
        },
    ];

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                    <div>
                        <Title level={2} className="!text-[#800000] !mb-1">Campaigns Dashboard</Title>
                        <Paragraph className="text-zinc-500 m-0">
                            Comprehensive overview and management of all welfare campaigns.
                        </Paragraph>
                    </div>
                    <Space size="middle" className="w-full md:w-auto">
                        <Input
                            placeholder="Search campaigns..."
                            onChange={(e) => setSearchText(e.target.value)}
                            value={searchText}
                            prefix={<SearchOutlined className="text-zinc-400" />}
                            allowClear
                            className="w-full md:w-64 rounded-xl border-zinc-200 h-11 shadow-sm"
                        />
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            onClick={() => setIsCreateCampaignModalVisible(true)} 
                            className="bg-[#800000] hover:bg-[#600000] border-none font-bold h-11 px-6 rounded-xl shadow-md shadow-[#800000]/20 w-full md:w-auto"
                        >
                            Create Campaign
                        </Button>
                    </Space>
                </div>

                {loading && <div className="flex justify-center my-12"><Spin tip="Loading Dashboard Data..." size="large" /></div>}
                {error && <Alert message={`Error: ${error}`} type="error" closable className="mb-8 rounded-xl" />}

                {!loading && (
                    <div className="space-y-8">
                        {/* Metrics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><AimOutlined className="text-xl" /></div>
                                    <Text className="text-zinc-500 font-semibold">Active Campaigns</Text>
                                </div>
                                <Text className="text-3xl font-bold text-zinc-800">{metrics.activeCount}</Text>
                            </div>
                            <div className={`bg-white p-6 rounded-3xl border shadow-sm flex flex-col ${metrics.pendingCount > 0 ? 'border-orange-200 bg-orange-50/30' : 'border-zinc-200'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-xl ${metrics.pendingCount > 0 ? 'bg-orange-100 text-orange-600' : 'bg-zinc-100 text-zinc-500'}`}><AlertOutlined className="text-xl" /></div>
                                    <Text className="text-zinc-500 font-semibold">Pending Approvals</Text>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Text className="text-3xl font-bold text-zinc-800">{metrics.pendingCount}</Text>
                                    {metrics.pendingCount > 0 && <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">ACTION REQUIRED</span>}
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><SafetyOutlined className="text-xl" /></div>
                                    <Text className="text-zinc-500 font-semibold">Total Target Goal</Text>
                                </div>
                                <Text className="text-2xl font-bold text-zinc-800">KES {metrics.totalGoal.toLocaleString()}</Text>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-green-50 text-green-600 rounded-xl"><DollarCircleOutlined className="text-xl" /></div>
                                    <Text className="text-zinc-500 font-semibold">Total Funds Raised</Text>
                                </div>
                                <Text className="text-2xl font-bold text-green-700">KES {metrics.totalRaised.toLocaleString()}</Text>
                            </div>
                        </div>

                        {/* Pending Approvals Section (High Priority) */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                                <Title level={4} className="!text-zinc-800 !mb-0 flex items-center gap-2">
                                    Pending Approvals
                                    <span className="bg-zinc-100 text-zinc-600 text-xs py-0.5 px-2 rounded-full">{pendingCampaigns.length}</span>
                                </Title>
                            </div>
                            {pendingCampaigns.length > 0 ? (
                                <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
                                    <Table 
                                        columns={pendingApprovalColumns} 
                                        dataSource={pendingCampaigns} 
                                        rowKey="_id" 
                                        pagination={{ pageSize: 5, className: "px-6 py-4" }}
                                        scroll={{ x: 'max-content' }}
                                        className="[&_.ant-table-thead_th]:bg-orange-50/50 [&_.ant-table-thead_th]:text-zinc-600 [&_.ant-table-thead_th]:font-semibold [&_.ant-table-thead_th]:border-b-zinc-200 [&_.ant-table-tbody_td]:border-b-zinc-100"
                                    />
                                </div>
                            ) : (
                                <div className="bg-white border border-dashed border-zinc-300 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                                    <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300 mb-3">
                                        <SafetyOutlined className="text-2xl" />
                                    </div>
                                    <Text className="text-zinc-500 font-medium">No pending requests to review.</Text>
                                </div>
                            )}
                        </div>

                        {/* Active Campaigns Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                                <Title level={4} className="!text-zinc-800 !mb-0 flex items-center gap-2">
                                    Active Campaigns
                                    <span className="bg-zinc-100 text-zinc-600 text-xs py-0.5 px-2 rounded-full">{activeCampaigns.length}</span>
                                </Title>
                            </div>
                            <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
                                <Table 
                                    columns={activeCampaignsColumns} 
                                    dataSource={activeCampaigns} 
                                    rowKey="_id" 
                                    pagination={{ pageSize: 5, className: "px-6 py-4" }}
                                    scroll={{ x: 'max-content' }}
                                    locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No active campaigns found" /> }}
                                    className="[&_.ant-table-thead_th]:bg-zinc-50/80 [&_.ant-table-thead_th]:text-zinc-500 [&_.ant-table-thead_th]:font-semibold [&_.ant-table-thead_th]:border-b-zinc-200 [&_.ant-table-tbody_td]:border-b-zinc-100"
                                />
                            </div>
                        </div>

                        {/* Campaign Records Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                                <Title level={4} className="!text-zinc-800 !mb-0 flex items-center gap-2">
                                    Campaign Records
                                    <span className="bg-zinc-100 text-zinc-600 text-xs py-0.5 px-2 rounded-full">{campaignRecords.length}</span>
                                </Title>
                            </div>
                            <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
                                <Table 
                                    columns={campaignRecordsColumns} 
                                    dataSource={campaignRecords} 
                                    rowKey="_id" 
                                    pagination={{ pageSize: 5, className: "px-6 py-4" }}
                                    scroll={{ x: 'max-content' }}
                                    locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No historical campaigns found" /> }}
                                    className="[&_.ant-table-thead_th]:bg-zinc-50/80 [&_.ant-table-thead_th]:text-zinc-500 [&_.ant-table-thead_th]:font-semibold [&_.ant-table-thead_th]:border-b-zinc-200 [&_.ant-table-tbody_td]:border-b-zinc-100"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <CampaignDetailsModal 
                    visible={isDetailsModalVisible} 
                    campaign={selectedCampaignForDetails} 
                    onCancel={() => setIsDetailsModalVisible(false)} 
                    isMobile={isMobile} 
                />

                <ApprovalModal 
                    visible={isApprovalModalVisible} 
                    campaign={selectedCampaignForApproval} 
                    onCancel={() => setIsApprovalModalVisible(false)} 
                    onApprove={handleApprove} 
                    onReject={handleReject} 
                    loading={actionLoading} 
                    isMobile={isMobile} 
                />

                <CreateCampaignModal
                    visible={isCreateCampaignModalVisible}
                    onCancel={() => setIsCreateCampaignModalVisible(false)}
                    onCreated={fetchCampaigns}
                />
            </div>
        </AdminLayout>
    );
};

export default CampaignManagementPage;