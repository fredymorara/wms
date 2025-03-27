import React, { useState, useEffect } from 'react';
import { Row, Pagination, Col, Input, Button, Modal, Alert, Spin, Typography, Card, Progress, Statistic } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
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

    // Fetch campaigns data
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

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Search functionality
    const handleSearch = (value) => {
        setSearchText(value);
        setFilteredCampaigns(campaigns.filter(campaign =>
            campaign.title.toLowerCase().includes(value.toLowerCase()) ||
            campaign.category.toLowerCase().includes(value.toLowerCase()) ||
            campaign.description.toLowerCase().includes(value.toLowerCase())
        ));
    };

    // Modal handlers
    const showModal = (campaign) => {
        setSelectedCampaign(campaign);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setError(null);
    };

    // Payment handlers
    const handlePaymentSuccess = () => {
        fetchData(); // Refresh campaign data
        setIsModalVisible(false);
    };

    const handlePaymentError = (errorMessage) => {
        setError(errorMessage);
    };

    // Pagination handlers
    const handlePageChange = (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
    };

    // Calculate paginated campaigns
    const paginatedCampaigns = filteredCampaigns.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <MemberLayout>
            <div style={{ width: '100%', maxWidth: 1600, margin: '0 auto', backgroundColor: '#fff', minHeight: '100vh' }}>
                {/* Header Section */}
                <div style={{ padding: isMobile ? '24px 16px' : '32px 24px', textAlign: 'center' }}>
                    <Title level={1} style={{ color: 'maroon', fontSize: isMobile ? '1.75rem' : '2.5rem', marginBottom: 0 }}>
                        Active Campaigns
                    </Title>
                    <Paragraph style={{ marginBottom: '20px', textAlign: 'center' }}>
                        Browse active campaigns and contribute to causes you care about.
                    </Paragraph>
                </div>

                {/* Loading/Error States */}
                {loading && <Alert message="Loading..." type="info" showIcon style={{ marginBottom: 24 }} />}
                {error && <Alert message={`Error: ${error}`} type="error" closable onClose={() => setError(null)} style={{ marginBottom: 24 }} />}

                {/* Search Input */}
                <div style={{ padding: isMobile ? '24px 16px' : '32px 24px', textAlign: 'center' }}>
                    <Input
                        placeholder="Search campaigns"
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                        disabled={error}
                        style={{ maxWidth: 600, marginBottom: 16 }}
                    />
                    {searchText && <Button icon={<CloseOutlined />} onClick={() => handleSearch('')} style={{ marginLeft: 8 }} />}
                </div>

                {/* Campaign Cards */}
                <div style={{ padding: isMobile ? '0px' : '32px 24px' }}>
                    <Row gutter={[16, 16]}>
                        {paginatedCampaigns.length > 0 ? (
                            paginatedCampaigns.map(campaign => (
                                <Col key={campaign.id} xs={24} sm={24} md={12} lg={8}>
                                    <Card style={{ borderRadius: 6, border: '1px solid green', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', marginBottom: 16, padding: isMobile ? '0px' : '24px' }}>
                                        <Title level={4} style={{ marginBottom: 8 }}>{campaign.title}</Title>
                                        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>{campaign.category}</Text>
                                        <Progress
                                            percent={Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100)}
                                            status={campaign.raised >= campaign.goal ? "success" : "active"}
                                            strokeColor="maroon"
                                            style={{ margin: '16px 0' }}
                                        />
                                        <Row gutter={16}>
                                            <Col span={12}><Statistic title="Target" value={campaign.goal} prefix="KES" /></Col>
                                            <Col span={12}><Statistic title="Raised" value={campaign.raised} prefix="KES" /></Col>
                                        </Row>
                                        <Button
                                            type="primary"
                                            onClick={() => showModal(campaign)}
                                            style={{ backgroundColor: '#b5e487', borderColor: 'maroon', color: 'black', marginTop: 16, width: '100%', height: isMobile ? 48 : 40 }}
                                        >
                                            Contribute
                                        </Button>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <Col span={24}>
                                <Alert message="No active campaigns" description="There are currently no active campaigns to display." type="info" />
                            </Col>
                        )}
                    </Row>

                    {/* Pagination Controls */}
                    {filteredCampaigns.length > pageSize && (
                        <div style={{ marginTop: 32, textAlign: 'center' }}>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={filteredCampaigns.length}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                responsive={true}
                                showQuickJumper={!isMobile}
                                itemRender={(current, type, originalElement) => {
                                    if (isMobile && type === 'page') {
                                        return current === currentPage ? originalElement : null;
                                    }
                                    return originalElement;
                                }}
                            />
                        </div>
                    )}

                </div>

                {/* Campaign Details Modal */}
                <Modal
                    title={<Title level={3} style={{ color: 'maroon', marginBottom: '0', textAlign: 'center' }}>Contribution Form</Title>}
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                    width={isMobile ? '95%' : '60%'}
                >
                    {selectedCampaign && (
                        <MpesaPaymentForm
                            campaign={selectedCampaign}
                            onPaymentSuccess={handlePaymentSuccess}
                            onPaymentError={handlePaymentError}
                        />
                    )}
                </Modal>
            </div>
        </MemberLayout>
    );
}

export default CampaignsPage;