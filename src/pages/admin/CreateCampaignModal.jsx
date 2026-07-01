import React, { useState } from 'react';
import { Modal, Typography, Form, Input, Select, DatePicker, Button, Spin, Alert, message } from 'antd';
import { API_URL } from '../../services/api';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CreateCampaignModal = ({ visible, onCancel, onCreated }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    const onFinish = async (values) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/admin/campaigns`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    ...values,
                    endDate: values.endDate.format('YYYY-MM-DD'),
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Campaign creation failed');
            }
            message.success({ content: 'Campaign created successfully', className: 'rounded-xl font-medium' });
            onCancel();
            if (onCreated) {
                onCreated();
            }
            form.resetFields();
        } catch (e) {
            setError(e.message);
            message.error({ content: `Campaign creation failed: ${e.message}`, className: 'rounded-xl font-medium' });
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        setError('Campaign creation form submission failed. Please check the fields.');
    };

    return (
        <Modal
            title={<Title level={4} className="!text-[#800000] !mb-0 text-center">Create New Campaign</Title>}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={700}
            className="rounded-3xl overflow-hidden [&_.ant-modal-content]:rounded-3xl [&_.ant-modal-header]:bg-zinc-50/50 [&_.ant-modal-header]:border-b [&_.ant-modal-header]:border-zinc-100 [&_.ant-modal-header]:pb-4 [&_.ant-modal-header]:pt-6"
        >
            <div className="pt-6">
                {error && <Alert message={`Error: ${error}`} type="error" closable onClose={() => setError(null)} className="mb-6 rounded-xl" />}

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={{ category: 'Other' }}
                >
                    <Form.Item
                        label={<span className="font-semibold text-zinc-700">Campaign Title</span>}
                        name="title"
                        rules={[{ required: true, message: 'Please enter campaign title!' }]}
                    >
                        <Input size="large" className="rounded-xl border-zinc-300 h-12" placeholder="e.g., Emergency Medical Fund" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-semibold text-zinc-700">Short Description</span>}
                        name="description"
                        rules={[{ required: true, message: 'Please enter campaign description!' }]}
                    >
                        <TextArea rows={3} className="rounded-xl border-zinc-300 p-3" placeholder="Brief summary for the campaign card" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-semibold text-zinc-700">Detailed Information (Optional)</span>}
                        name="details"
                    >
                        <TextArea rows={5} className="rounded-xl border-zinc-300 p-3" placeholder="Full details, background, and breakdown of needs" />
                    </Form.Item>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <Form.Item
                            label={<span className="font-semibold text-zinc-700">Category</span>}
                            name="category"
                        >
                            <Select size="large" className="h-12 [&_.ant-select-selector]:rounded-xl [&_.ant-select-selector]:border-zinc-300 [&_.ant-select-selector]:items-center">
                                <Option value="Medical">Medical</Option>
                                <Option value="Academic">Academic</Option>
                                <Option value="Emergency">Emergency</Option>
                                <Option value="Other">Other</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={<span className="font-semibold text-zinc-700">Goal Amount (KES)</span>}
                            name="goalAmount"
                            rules={[{ required: true, message: 'Please enter goal amount!' }]}
                        >
                            <Input type="number" size="large" className="rounded-xl border-zinc-300 h-12" placeholder="e.g., 50000" />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label={<span className="font-semibold text-zinc-700">End Date</span>}
                        name="endDate"
                        rules={[{ required: true, message: 'Please select campaign end date!' }]}
                    >
                        <DatePicker size="large" className="w-full rounded-xl border-zinc-300 h-12" format="YYYY-MM-DD" disabledDate={(current) => current && current < dayjs().startOf('day')} />
                    </Form.Item>

                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-zinc-100">
                        <Button size="large" onClick={onCancel} className="rounded-xl font-semibold h-12 px-6">
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading} size="large" className="bg-[#800000] hover:bg-[#600000] border-none font-bold rounded-xl h-12 px-8 shadow-md shadow-[#800000]/20">
                            Create Campaign
                        </Button>
                    </div>
                </Form>
                {loading && <div className="flex justify-center mt-6"><Spin tip="Creating Campaign..." /></div>}
            </div>
        </Modal>
    );
};

export default CreateCampaignModal;