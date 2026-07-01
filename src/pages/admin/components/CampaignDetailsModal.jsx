import React from 'react';
import { Modal, Typography, Progress } from 'antd';

const { Title, Paragraph, Text } = Typography;

const CampaignDetailsModal = ({ visible, campaign, onCancel, isMobile }) => {
    return (
        <Modal
            title={<Title level={4} className="text-[#800000]! mb-0! text-center">Campaign Details</Title>}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={isMobile ? '95%' : 600}
            className="rounded-3xl overflow-hidden [&_.ant-modal-content]:rounded-3xl [&_.ant-modal-header]:bg-zinc-50/50 [&_.ant-modal-header]:border-b [&_.ant-modal-header]:border-zinc-100 [&_.ant-modal-header]:pb-4 [&_.ant-modal-header]:pt-6"
        >
            {campaign && (
                <div className="pt-6 space-y-8">
                    <div>
                        <h3 className="text-2xl font-bold text-zinc-900 mb-2">{campaign.title || 'Untitled Campaign'}</h3>
                        <Paragraph className="text-zinc-600 leading-relaxed text-lg">{campaign.description}</Paragraph>
                    </div>

                    <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                        <h4 className="font-semibold text-zinc-800 mb-3 text-lg">Detailed Information</h4>
                        <Paragraph className="text-zinc-600 leading-relaxed m-0 whitespace-pre-wrap">{campaign.details || 'No detailed information provided.'}</Paragraph>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                        <h4 className="font-semibold text-zinc-800 mb-4 text-lg">Funding Progress</h4>
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <div className="text-sm text-zinc-500 font-medium mb-1">Raised</div>
                                <div className="text-2xl font-bold text-green-700">KES {campaign.currentAmount?.toLocaleString() || 0}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-zinc-500 font-medium mb-1">Target Goal</div>
                                <div className="text-lg font-semibold text-zinc-800">KES {campaign.goalAmount?.toLocaleString() || 0}</div>
                            </div>
                        </div>
                        <Progress
                            percent={campaign.goalAmount ? Math.min(Math.round((campaign.currentAmount / campaign.goalAmount) * 100), 100) : 0}
                            status="active"
                            strokeColor="#800000"
                            trailColor="#f4f4f5"
                            size={["100%", 12]}
                            className="mb-4"
                        />
                        <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
                            <Text className="text-zinc-500 font-medium">Campaign Deadline:</Text>
                            <Text className="font-semibold text-zinc-800">{campaign.endDate ? new Date(campaign.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</Text>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default CampaignDetailsModal;
