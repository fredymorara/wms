import React, { useState, useEffect } from 'react';
import { Row, Pagination, Col, Input, Button, Modal, Alert, Typography, Progress } from 'antd';
import { SearchOutlined, CloseOutlined, HeartFilled } from '@ant-design/icons';
import MemberLayout from '../../layout/MemberLayout';
import { API_URL } from '../../services/api';
import MpesaPaymentForm from '../../components/MpesaPaymentForm';

const { Title, Paragraph, Text } = Typography;

function CampaignsPage() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(9);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    };

    const fetchData = async () => {
        try {
            const response = await fetch(`${API_URL}/member/campaigns`, { headers: getAuthHeaders() });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            const formattedCampaigns = data.map(campaign => ({
                id: campaign._id,
                title: campaign.title,
                category: campaign.category,
                goal: campaign.goalAmount,
                raised: campaign.currentAmount,
                description: campaign.description,
                endDate: campaign.endDate,
                status: campaign.status,
                details: campaign.details,
            }));

            setCampaigns(formattedCampaigns);
            setFilteredCampaigns(formattedCampaigns);
            setLoading(false);
        } catch (e) {
            setError(e.message);
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleSearch = (value) => {
        setSearchText(value);
        setFilteredCampaigns(campaigns.filter(campaign =>
            campaign.title.toLowerCase().includes(value.toLowerCase()) ||
            campaign.category.toLowerCase().includes(value.toLowerCase()) ||
            campaign.description.toLowerCase().includes(value.toLowerCase())
        ));
    };

    const showModal = (campaign) => {
        setSelectedCampaign(campaign);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setError(null);
    };

    const handlePaymentSuccess = () => {
        fetchData();
        setIsModalVisible(false);
    };

    const handlePaymentError = (errorMessage) => {
        setError(errorMessage);
    };

    const handlePageChange = (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
    };

    const paginatedCampaigns = filteredCampaigns.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <MemberLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-12">
                {/* Header Section */}
                <div className="text-center space-y-2 mb-8">
                    <Title level={2} className="!text-[#800000] !mb-0">Active Campaigns</Title>
                    <Paragraph className="text-zinc-500 max-w-2xl mx-auto">
                        Browse active campaigns and contribute to causes you care about.
                    </Paragraph>
                </div>

                {loading && <div className="flex justify-center"><Alert message="Loading Campaigns..." type="info" /></div>}
                {error && <Alert message={`Error: ${error}`} type="error" closable onClose={() => setError(null)} className="mb-6" />}

                {/* Search Bar */}
                <div className="flex justify-center mb-10">
                    <div className="flex w-full max-w-2xl gap-2">
                        <Input
                            size="large"
                            placeholder="Search campaigns by title or category..."
                            prefix={<SearchOutlined className="text-zinc-400" />}
                            value={searchText}
                            onChange={(e) => handleSearch(e.target.value)}
                            disabled={error}
                            className="rounded-2xl border-zinc-200"
                            allowClear
                        />
                    </div>
                </div>

                {/* Campaign Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {paginatedCampaigns.length > 0 ? (
                        paginatedCampaigns.map(campaign => {
                            const percent = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);
                            return (
                                <div key={campaign.id} className="bg-white border border-zinc-200 rounded-3xl p-6 hover:shadow-xl transition-shadow flex flex-col justify-between h-full group">
                                    <div>
                                        <h4 className="font-bold text-xl text-zinc-900 mb-2 line-clamp-2 group-hover:text-[#800000] transition-colors">{campaign.title}</h4>
                                        <span className="inline-block px-3 py-1 bg-[#800000]/5 text-[#800000] text-xs font-semibold rounded-full mb-6">
                                            {campaign.category}
                                        </span>
                                        <p className="text-zinc-500 text-sm mb-8 line-clamp-3">
                                            {campaign.description}
                                        </p>
                                        <div className="mb-8">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="font-bold text-zinc-800">KES {campaign.raised.toLocaleString()}</span>
                                                <span className="text-zinc-400">of KES {campaign.goal.toLocaleString()}</span>
                                            </div>
                                            <Progress 
                                                percent={percent} 
                                                showInfo={false} 
                                                strokeColor="#800000" 
                                                trailColor="#f4f4f5"
                                                size="default"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="primary"
                                        icon={<HeartFilled />}
                                        size="large"
                                        className="w-full bg-[#b5e487] text-[#800000] border-none font-bold h-12 hover:opacity-90 rounded-2xl shadow-sm hover:-translate-y-1 transition-transform"
                                        onClick={() => showModal(campaign)}
                                    >
                                        Contribute Now
                                    </Button>
                                </div>
                            );
                        })
                    ) : (
                        !loading && (
                            <div className="col-span-full text-center py-16 bg-white border border-zinc-200 rounded-3xl">
                                <Title level={4} className="!text-zinc-400">No campaigns found</Title>
                                <p className="text-zinc-500">Try adjusting your search criteria.</p>
                            </div>
                        )
                    )}
                </div>

                {/* Pagination */}
                {filteredCampaigns.length > 0 && (
                    <div className="flex justify-center mt-12">
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={filteredCampaigns.length}
                            onChange={handlePageChange}
                            showSizeChanger={true}
                            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                            className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-zinc-200"
                        />
                    </div>
                )}

                {/* Payment Modal */}
                <Modal
                    title={<Title level={3} className="!text-[#800000] !mb-0 text-center">Contribution Form</Title>}
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                    width={isMobile ? '95%' : '60%'}
                    className="rounded-3xl overflow-hidden"
                >
                    {selectedCampaign && (
                        <div className="mt-6">
                            <MpesaPaymentForm
                                campaign={selectedCampaign}
                                onPaymentSuccess={handlePaymentSuccess}
                                onPaymentError={handlePaymentError}
                            />
                        </div>
                    )}
                </Modal>
            </div>
        </MemberLayout>
    );
}

export default CampaignsPage;