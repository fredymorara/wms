import React, { useState, useEffect } from 'react';
import { Row, Col, Progress, Button, Statistic, Alert, Typography, Modal, Form, Select, InputNumber } from 'antd';
import { Link } from 'react-router-dom';
import MemberLayout from '../../layout/MemberLayout';
import { API_URL } from '../../services/api';
import MpesaPaymentForm from '../../components/MpesaPaymentForm';
import MemberCampaignApplicationModal from '../../components/MemberCampaignApplicationModal';
import { HeartFilled, RocketOutlined, NotificationOutlined, FormOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

const MemberDashboardPage = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [quickContributionAmount, setQuickContributionAmount] = useState(100);
    const [isMobile, setIsMobile] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isApplyModalVisible, setIsApplyModalVisible] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const campaignsResponse = await fetch(`${API_URL}/member/campaigns`, { headers: getAuthHeaders() });
                if (campaignsResponse.ok) {
                    const campaignsData = await campaignsResponse.json();
                    const data = campaignsData.data || campaignsData;
                    setCampaigns(data.map(c => ({
                        id: c._id,
                        title: c.title,
                        category: c.category,
                        goal: c.goalAmount,
                        raised: c.currentAmount,
                        description: c.description,
                        endDate: c.endDate,
                        status: c.status,
                        details: c.details,
                    })));
                }

                const contributionsResponse = await fetch(`${API_URL}/member/my-recent-activity`, { headers: getAuthHeaders() });
                if (contributionsResponse.ok) {
                    const contributionsData = await contributionsResponse.json();
                    const completedContributions = contributionsData.data
                        .filter(contribution => contribution.status === 'completed')
                        .map(c => ({
                            id: c._id,
                            description: `Contributed KES ${c.amount} to ${c.campaign?.title}`,
                            date: c.paymentDate || c.createdAt || new Date().toISOString(),
                            mpesaCode: c.mpesaCode,
                            status: c.status
                        }));
                    setRecentActivity(completedContributions);
                }
            } catch (e) {
                setError("Error loading data: " + e.message);
            }
            setLoading(false);
        };
        fetchData();
    }, [refreshKey]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const showApplyModal = () => {
        setIsApplyModalVisible(true);
    };

    const handleApplyModalCancel = () => {
        setIsApplyModalVisible(false);
    };

    const handleApplicationCreated = () => {
        setIsApplyModalVisible(false);
        // We could refresh campaigns here if needed, but typically they go to pending
    };

    return (
        <MemberLayout>
            <div className="max-w-7xl mx-auto space-y-8 pb-12">
                {/* Header */}
                <div className="text-center space-y-2 mb-12">
                    <Title level={2} className="!text-[#800000] !mb-0">Student Dashboard</Title>
                    <Paragraph className="text-zinc-500">
                        Easily contribute to campaigns and view announcements.
                    </Paragraph>
                </div>

                {loading && <div className="flex justify-center my-12"><Alert message="Loading Dashboard..." type="info" /></div>}
                {error && <Alert message={`Error: ${error}`} type="error" closable onClose={() => setError(null)} className="mb-6" />}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Campaigns & Announcements */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Announcements */}
                        <div className="bg-[#800000]/5 border border-[#800000]/10 rounded-2xl p-6 flex items-start gap-4">
                            <div className="bg-white p-3 rounded-full shadow-sm text-[#800000]">
                                <NotificationOutlined className="text-xl" />
                            </div>
                            <div>
                                <h3 className="text-[#800000] font-bold text-lg mb-1">Welcome to the Student Welfare System!</h3>
                                <p className="text-zinc-600">Check out our active campaigns and support your fellow students. Every contribution counts towards building a stronger community.</p>
                            </div>
                        </div>

                        {/* Active Campaigns */}
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <Title level={4} className="!text-zinc-800 !mb-0">Active Campaigns</Title>
                                <Link to="/member/campaigns" className="text-[#800000] font-medium hover:underline">View All →</Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {campaigns.slice(0, 4).map(campaign => {
                                    const percent = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);
                                    return (
                                        <div key={campaign.id} className="bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-lg transition-shadow flex flex-col justify-between h-full">
                                            <div>
                                                <h4 className="font-bold text-lg text-zinc-900 mb-1 line-clamp-1">{campaign.title}</h4>
                                                <span className="inline-block px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-semibold rounded-full mb-4">
                                                    {campaign.category}
                                                </span>
                                                <div className="mb-6">
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="font-semibold text-zinc-700">KES {campaign.raised.toLocaleString()}</span>
                                                        <span className="text-zinc-400">of KES {campaign.goal.toLocaleString()}</span>
                                                    </div>
                                                    <Progress 
                                                        percent={percent} 
                                                        showInfo={false} 
                                                        strokeColor="#800000" 
                                                        trailColor="#f4f4f5"
                                                        size="small"
                                                    />
                                                </div>
                                            </div>
                                            <Button
                                                type="primary"
                                                icon={<HeartFilled />}
                                                className="w-full bg-[#b5e487] text-[#800000] border-none font-semibold h-10 hover:opacity-90 rounded-xl shadow-sm"
                                                onClick={() => { setSelectedCampaign(campaign); setIsModalVisible(true); }}
                                            >
                                                Donate Now
                                            </Button>
                                        </div>
                                    );
                                })}
                                {campaigns.length === 0 && !loading && (
                                    <div className="col-span-full text-center py-12 bg-zinc-50 rounded-2xl border border-zinc-200">
                                        <Text className="text-zinc-500">No active campaigns at the moment.</Text>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Quick Contribute, Request Aid & Activity */}
                    <div className="space-y-8">
                        
                        {/* Request Aid Widget */}
                        <div className="bg-white border border-[#800000]/20 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-[#800000]/10 rounded-full flex items-center justify-center text-[#800000] mb-4">
                                <FormOutlined className="text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-800 mb-2">Need Financial Assistance?</h3>
                            <p className="text-zinc-500 text-sm mb-6">
                                If you are facing financial difficulties, you can request aid by applying for a new welfare campaign.
                            </p>
                            <Button 
                                type="primary"
                                onClick={showApplyModal}
                                className="w-full bg-[#800000] hover:bg-[#600000] border-none font-bold h-12 rounded-xl shadow-md shadow-[#800000]/20 text-base"
                            >
                                Apply for Funding
                            </Button>
                        </div>

                        {/* Quick Contribution Widget */}
                        <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5 text-[#800000]">
                                <RocketOutlined className="text-8xl" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-6 text-zinc-800">Quick Contribution</h3>
                                <Form layout="vertical" className="mb-0">
                                    <Form.Item className="mb-4">
                                        <Select
                                            placeholder="Select a campaign"
                                            onChange={(value) => setSelectedCampaign(campaigns.find(c => c.id === value))}
                                            disabled={loading}
                                            size="large"
                                            className="w-full h-12 [&_.ant-select-selector]:rounded-xl [&_.ant-select-selector]:border-zinc-300 [&_.ant-select-selector]:items-center"
                                            dropdownStyle={{ borderRadius: '12px' }}
                                        >
                                            {campaigns.map(campaign => (
                                                <Option key={campaign.id} value={campaign.id}>{campaign.title}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item className="mb-6">
                                        <InputNumber
                                            min={100}
                                            step={100}
                                            defaultValue={100}
                                            onChange={setQuickContributionAmount}
                                            size="large"
                                            className="w-full h-12 rounded-xl border-zinc-300 flex items-center"
                                            prefix={<span className="text-zinc-400 font-medium mr-2">KES</span>}
                                        />
                                    </Form.Item>
                                    <Button
                                        block
                                        type="primary"
                                        size="large"
                                        className="bg-[#800000] hover:bg-[#600000] border-none font-bold h-12 rounded-xl shadow-md shadow-[#800000]/20"
                                        onClick={() => {
                                            if (!selectedCampaign) {
                                                setError('Please select a campaign');
                                                return;
                                            }
                                            if (!quickContributionAmount || quickContributionAmount < 100) {
                                                setError('Amount must be at least KES 100');
                                                return;
                                            }
                                            setIsModalVisible(true);
                                        }}
                                    >
                                        Contribute Now
                                    </Button>
                                </Form>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white border border-zinc-200 rounded-3xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <Title level={4} className="!text-zinc-800 !mb-0">Recent Activity</Title>
                                <Link to="/member/history" className="text-zinc-400 hover:text-[#800000] text-sm">View All</Link>
                            </div>
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {recentActivity.length > 0 ? (
                                    recentActivity.map(activity => (
                                        <div key={activity.id} className="flex justify-between items-start pb-4 border-b border-zinc-100 last:border-0 last:pb-0">
                                            <div className="pr-4">
                                                <p className="text-zinc-700 font-medium text-sm line-clamp-2">{activity.description}</p>
                                                {activity.mpesaCode && (
                                                    <p className="text-xs text-zinc-400 mt-1 font-mono">{activity.mpesaCode}</p>
                                                )}
                                            </div>
                                            <div className="text-xs text-zinc-400 whitespace-nowrap pt-1">
                                                {new Date(activity.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <Text className="text-zinc-400">No recent contributions.</Text>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* M-Pesa Payment Modal */}
                <Modal
                    title={<Title level={3} className="!text-[#800000] !mb-0 text-center">Contribution Form</Title>}
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    width={isMobile ? '95%' : '60%'}
                    className="rounded-2xl overflow-hidden"
                >
                    {selectedCampaign && (
                        <div className="mt-6">
                            <MpesaPaymentForm
                                campaign={selectedCampaign}
                                initialAmount={quickContributionAmount}
                                onPaymentSuccess={() => {
                                    setIsModalVisible(false);
                                    setRefreshKey(prev => prev + 1);
                                }}
                                onPaymentError={setError}
                            />
                        </div>
                    )}
                </Modal>

                {/* Member Campaign Application Modal */}
                <MemberCampaignApplicationModal
                    visible={isApplyModalVisible}
                    onCancel={handleApplyModalCancel}
                    onCreated={handleApplicationCreated}
                />
            </div>
        </MemberLayout>
    );
};

export default MemberDashboardPage;