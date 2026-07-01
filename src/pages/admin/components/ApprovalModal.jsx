import React, { useState, useEffect } from 'react';
import { Modal, Typography, Form, Input, Button } from 'antd';

const { Title, Paragraph } = Typography;

const ApprovalModal = ({ visible, campaign, onCancel, onApprove, onReject, loading, isMobile }) => {
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        if (visible) {
            setRejectionReason('');
        }
    }, [visible, campaign]);

    const handleReject = () => {
        onReject(campaign._id, rejectionReason);
    };

    const handleApprove = () => {
        onApprove(campaign._id);
    };

    return (
        <Modal
            title={<Title level={4} className="text-[#800000]! mb-0! text-center">Review Campaign Request</Title>}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={isMobile ? '95%' : 600}
            className="rounded-3xl overflow-hidden [&_.ant-modal-content]:rounded-3xl [&_.ant-modal-header]:bg-zinc-50/50 [&_.ant-modal-header]:border-b [&_.ant-modal-header]:border-zinc-100 [&_.ant-modal-header]:pb-4 [&_.ant-modal-header]:pt-6"
        >
            {campaign && (
                <div className="pt-6">
                    <div className="mb-6 space-y-1">
                        <h3 className="text-xl font-bold text-zinc-900">{campaign.title || 'Untitled Request'}</h3>
                        <p className="text-zinc-500 text-sm">Requested on {campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>

                    <div className="bg-zinc-50 rounded-2xl p-6 mb-6 border border-zinc-100">
                        <h4 className="font-semibold text-zinc-800 mb-2">Description</h4>
                        <Paragraph className="text-zinc-600 leading-relaxed mb-6">{campaign.description}</Paragraph>

                        <h4 className="font-semibold text-zinc-800 mb-2">Supporting Details</h4>
                        <Paragraph className="text-zinc-600 leading-relaxed m-0">{campaign.details || 'No additional details provided.'}</Paragraph>
                    </div>

                    <Form layout="vertical" className="mt-8">
                        <Form.Item label={<span className="font-semibold text-zinc-700">Rejection Reason (Optional)</span>}>
                            <Input.TextArea
                                rows={3}
                                className="rounded-xl border-zinc-300 p-3"
                                placeholder="If rejecting, explain why..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            />
                        </Form.Item>
                        
                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-zinc-100">
                            <Button size="large" onClick={onCancel} className="rounded-xl font-semibold h-12 px-6">
                                Cancel
                            </Button>
                            <Button
                                danger
                                onClick={handleReject}
                                loading={loading}
                                size="large"
                                className="rounded-xl font-bold h-12 px-6"
                            >
                                Reject
                            </Button>
                            <Button
                                type="primary"
                                onClick={handleApprove}
                                loading={loading}
                                size="large"
                                className="bg-[#b5e487] text-[#800000] border-none font-bold rounded-xl h-12 px-8 shadow-sm hover:opacity-90"
                            >
                                Approve
                            </Button>
                        </div>
                    </Form>
                </div>
            )}
        </Modal>
    );
};

export default ApprovalModal;
