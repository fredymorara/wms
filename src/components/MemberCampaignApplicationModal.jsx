// frontend/src/components/MemberCampaignApplicationModal.jsx
import React, { useState } from 'react';
import { Modal, Typography, Form, Input, Select, DatePicker, Button, Spin, Alert, message } from 'antd';
import { API_URL } from '../services/api';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const MemberCampaignApplicationModal = ({ visible, onCancel, onCreated }) => { // Receive visible, onCancel, onCreated props
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
            const response = await fetch(`${API_URL}/member/campaigns/apply`, { // <-- Changed API endpoint to member's apply route
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    ...values,
                    endDate: values.endDate.format('YYYY-MM-DD'),
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Campaign application failed');
            }
            message.success('Campaign application submitted successfully. Awaiting Admin approval.');
            onCancel(); // Close modal on success
            if (onCreated) {
                onCreated(); // Call the onCreated callback if provided (optional - might not need refresh for member view)
            }
            form.resetFields(); // Clear form fields after successful creation
        } catch (e) {
            setError(e.message);
            message.error(`Campaign application failed: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        setError('Campaign application form submission failed. Please check the fields.');
    };

    return (
        <Modal
            title={<Title level={3} style={{ color: 'maroon', marginBottom: '0', textAlign: 'center' }}>Apply for Welfare Campaign Funding</Title>}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width="90%" // Adjust width as needed
        >
            {error && <Alert message={`Error: ${error}`} type="error" closable onClose={() => setError(null)} style={{ marginBottom: 24 }} />}

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={{ category: 'Other' }}
            >
                {/* Form Fields - Adjusted for Member Application */}
                <Form.Item
                    label="Campaign Title"
                    name="title"
                    rules={[{ required: true, message: 'Please enter campaign title!' }]}
                >
                    <Input placeholder="Campaign Title" />
                </Form.Item>

                <Form.Item
                    label="Campaign Description"
                    name="description"
                    rules={[{ required: true, message: 'Please enter campaign description!' }]}
                >
                    <TextArea rows={3} placeholder="Brief description of the campaign" />
                </Form.Item>

                <Form.Item
                    label="Detailed Information"
                    name="details"
                >
                    <TextArea rows={6} placeholder="Detailed information about your need and campaign (optional)" />
                </Form.Item>

                <Form.Item
                    label="Category"
                    name="category"
                >
                    <Select placeholder="Select category">
                        <Option value="Medical">Medical</Option>
                        <Option value="Academic">Academic</Option>
                        <Option value="Emergency">Emergency</Option>
                        <Option value="Other">Other</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Required Amount (Ksh)"
                    name="goalAmount"
                    rules={[{ required: true, message: 'Please enter the required amount!' }]}
                >
                    <Input type="number" placeholder="Amount you are requesting" />
                </Form.Item>

                <Form.Item
                    label="Campaign End Date (Desired)"
                    name="endDate"
                    rules={[{ required: true, message: 'Please select desired campaign end date!' }]}
                >
                    <DatePicker format="YYYY-MM-DD" disabledDate={(current) => current && current < dayjs().startOf('day')} />
                </Form.Item>


                <Form.Item style={{ textAlign: 'right' }}>
                    <Button onClick={onCancel} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ backgroundColor: '#b5e487', borderColor: 'maroon', color: 'black' }}>
                        Submit Application
                    </Button>
                </Form.Item>
            </Form>
            {loading && <Spin tip="Submitting Application..." style={{ display: 'block', marginTop: 24 }} />}
        </Modal>
    );
};

export default MemberCampaignApplicationModal;