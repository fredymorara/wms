import React, { useState, useEffect } from 'react';
import { Input, Button, Alert, Typography, Pagination } from 'antd';
import { SearchOutlined, CloseOutlined, CalendarOutlined, BankOutlined, CheckCircleFilled } from '@ant-design/icons';
import moment from 'moment';
import MemberLayout from '../../layout/MemberLayout';
import { API_URL } from '../../services/api';

const { Title, Paragraph, Text } = Typography;

function ContributionHistoryPage() {
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredContributions, setFilteredContributions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/member/my-contributions`, {
                    headers: getAuthHeaders(),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    if (response.status === 404 && errorData.message === "No contributions found for this user") {
                        setContributions([]);
                        setFilteredContributions([]);
                        setError(null);
                    } else {
                        throw new Error(errorData.message || 'Failed to fetch contributions');
                    }
                } else {
                    const data = await response.json();
                    const completedContributions = data.data
                        .filter(contribution => contribution.status === 'completed')
                        .map(contribution => ({
                            id: contribution._id,
                            campaign: contribution.campaign?.title || 'Unknown Campaign',
                            date: contribution.paymentDate || contribution.createdAt,
                            amount: contribution.amount,
                            paymentMethod: contribution.paymentMethod,
                            mpesaCode: contribution.mpesaCode,
                            transactionId: contribution.transactionId,
                            status: contribution.status
                        }));

                    setContributions(completedContributions);
                    setFilteredContributions(completedContributions);
                }
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearch = (value) => {
        setSearchText(value);
        const filteredData = contributions.filter((contribution) =>
            contribution.campaign.toLowerCase().includes(value.toLowerCase()) ||
            (contribution.date && moment(contribution.date).format('MMMM DD, YYYY').toLowerCase().includes(value.toLowerCase())) ||
            contribution.amount.toString().includes(value) ||
            (contribution.mpesaCode && contribution.mpesaCode.toLowerCase().includes(value.toLowerCase()))
        );
        setFilteredContributions(filteredData);
    };

    const clearSearch = () => {
        setSearchText('');
        setFilteredContributions(contributions);
    };

    return (
        <MemberLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-12">
                <div className="text-center space-y-2 mb-8">
                    <Title level={2} className="!text-[#800000] !mb-0">Contribution History</Title>
                    <Paragraph className="text-zinc-500 max-w-2xl mx-auto">
                        View and track all your completed contributions to active campaigns.
                    </Paragraph>
                </div>

                {loading && <div className="flex justify-center mb-8"><Alert message="Loading history..." type="info" /></div>}
                {error && <Alert message={`Error: ${error}`} type="error" closable onClose={() => setError(null)} className="mb-8" />}

                <div className="flex justify-center mb-10">
                    <div className="flex w-full max-w-2xl gap-2">
                        <Input
                            size="large"
                            placeholder="Search by campaign, date, amount or M-Pesa code..."
                            prefix={<SearchOutlined className="text-zinc-400" />}
                            value={searchText}
                            onChange={(e) => handleSearch(e.target.value)}
                            disabled={error || loading}
                            className="rounded-2xl border-zinc-200"
                            allowClear
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredContributions.length === 0 ? (
                        <div className="text-center py-16 bg-white border border-zinc-200 rounded-3xl">
                            <Title level={4} className="!text-zinc-400">No contributions found</Title>
                            <p className="text-zinc-500">
                                {loading ? 'Loading your data...' : 'You have not made any completed contributions yet, or none match your search.'}
                            </p>
                        </div>
                    ) : (
                        <>
                            {filteredContributions.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((contribution) => (
                                <div key={contribution.id} className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        {/* Campaign Info */}
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-[#800000] mb-2">{contribution.campaign}</h3>
                                            <div className="flex items-center text-sm text-zinc-500 gap-4">
                                                <span className="flex items-center gap-1.5">
                                                    <CalendarOutlined /> {moment(contribution.date).format('MMMM DD, YYYY')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Amount Info */}
                                        <div className="flex-1">
                                            <div className="flex flex-col text-sm space-y-1">
                                                <div>
                                                    <span className="text-zinc-500">Amount:</span>
                                                    <span className="ml-2 font-bold text-zinc-900 text-lg">KES {contribution.amount.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-zinc-500">
                                                    <BankOutlined /> {contribution.paymentMethod}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status & Code Info */}
                                        <div className="flex-1 flex flex-col md:items-end space-y-2">
                                            {contribution.mpesaCode && (
                                                <div className="bg-zinc-100 text-zinc-600 px-3 py-1 rounded-md font-mono text-sm border border-zinc-200">
                                                    {contribution.mpesaCode}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5 text-[#389e0d] font-medium bg-[#389e0d]/10 px-3 py-1 rounded-full text-sm">
                                                <CheckCircleFilled /> Completed
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            <div className="flex justify-center mt-10">
                                <Pagination
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={filteredContributions.length}
                                    onChange={(page, size) => { setCurrentPage(page); setPageSize(size); }}
                                    showSizeChanger={true}
                                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                                    className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-zinc-200"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </MemberLayout>
    );
}

export default ContributionHistoryPage;