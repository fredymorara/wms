import React, { useEffect } from 'react';
import { Modal, Typography, Form, Input, InputNumber, Button } from 'antd';
import { BankOutlined } from '@ant-design/icons';

const { Paragraph, Text, Title } = Typography;
const { TextArea } = Input;

const DisbursementModal = ({ visible, campaign, onCancel, onDisburse, loading, isMobile }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && campaign) {
            form.setFieldsValue({
                amount: campaign.currentAmount || 0,
                recipientPhone: '',
                recipientName: '',
                remarks: '',
            });
        }
    }, [visible, campaign, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const disbursementData = {
                recipientPhone: values.recipientPhone,
                amount: values.amount,
                recipientName: values.recipientName,
                remarks: values.remarks,
            };
            const success = await onDisburse(campaign._id, disbursementData);
            if (success) {
                form.resetFields();
            }
        } catch (errorInfo) {
            console.log('Validation Failed:', errorInfo);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#800000]/10 flex items-center justify-center">
                        <BankOutlined className="text-[#800000] text-xl" />
                    </div>
                    <Title level={4} className="!text-[#800000] !mb-0">Disburse Funds</Title>
                </div>
            }
            visible={visible}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose
            width={isMobile ? '95%' : 600}
            className="rounded-3xl overflow-hidden [&_.ant-modal-content]:rounded-3xl [&_.ant-modal-header]:bg-zinc-50/50 [&_.ant-modal-header]:border-b [&_.ant-modal-header]:border-zinc-100 [&_.ant-modal-header]:pb-4 [&_.ant-modal-header]:pt-6"
        >
            <div className="pt-6">
                <div className="bg-[#b5e487]/20 border border-[#b5e487]/50 rounded-2xl p-6 mb-8 text-center">
                    <div className="text-zinc-600 font-medium mb-1">Available for {campaign?.title || 'Campaign'}</div>
                    <div className="text-3xl font-bold text-[#800000]">KES {campaign?.currentAmount?.toLocaleString() || 0}</div>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    name="disbursement_form"
                    onFinish={handleOk}
                >
                    <Form.Item
                        name="recipientPhone"
                        label={<span className="font-semibold text-zinc-700">Recipient M-Pesa Phone Number</span>}
                        rules={[
                            { required: true, message: 'Recipient phone number is required!' },
                            { pattern: /^(07|2547)\d{8}$/, message: 'Enter Kenyan format (e.g., 07... or 2547...)' }
                        ]}
                    >
                        <Input size="large" className="rounded-xl border-zinc-300 h-12" placeholder="e.g., 0712345678" />
                    </Form.Item>

                    <Form.Item
                        name="amount"
                        label={<span className="font-semibold text-zinc-700">Amount to Disburse (KES)</span>}
                        rules={[
                            { required: true, message: 'Amount is required!' },
                            { type: 'number', min: 1, message: 'Amount must be at least KES 1' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const available = campaign?.currentAmount || 0;
                                    if (!value || value <= available) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(`Amount cannot exceed KES ${available.toLocaleString()}`));
                                },
                            }),
                        ]}
                    >
                        <InputNumber
                            size="large"
                            className="w-full rounded-xl border-zinc-300 [&_.ant-input-number-input]:h-[46px] [&_.ant-input-number-input]:rounded-xl"
                            min={1}
                            max={campaign?.currentAmount || 1}
                            step={100}
                            precision={0}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            placeholder="Enter amount to send"
                        />
                    </Form.Item>

                    <Form.Item
                        name="recipientName"
                        label={<span className="font-semibold text-zinc-700">Recipient Name (Optional)</span>}
                    >
                        <Input size="large" className="rounded-xl border-zinc-300 h-12" placeholder="Recipient's name" />
                    </Form.Item>

                    <Form.Item
                        name="remarks"
                        label={<span className="font-semibold text-zinc-700">Remarks (Optional, max 100 chars)</span>}
                        rules={[{ max: 100, message: 'Remarks exceed 100 characters' }]}
                    >
                        <TextArea rows={2} className="rounded-xl border-zinc-300 p-3" placeholder="Short note for transaction statement" />
                    </Form.Item>

                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-zinc-100">
                        <Button size="large" onClick={handleCancel} className="rounded-xl font-semibold h-12 px-6">
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading} size="large" className="bg-[#800000] hover:bg-[#600000] border-none font-bold rounded-xl h-12 px-8 shadow-md shadow-[#800000]/20">
                            Initiate Disbursement
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
};

export default DisbursementModal;
