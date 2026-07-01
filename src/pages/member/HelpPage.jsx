import React, { useState } from 'react';
import { Form, Input, Button, Alert, Typography } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import MemberLayout from '../../layout/MemberLayout';
import api from '../../services/api';

const { Title, Paragraph } = Typography;

function HelpPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const onFinish = async (values) => {
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');
        try {
            await api.submitHelpInquiry(values);
            setSuccessMessage('Your inquiry has been submitted successfully!');
            form.resetFields();
        } catch (error) {
            setErrorMessage(error.message || 'An error occurred while submitting your inquiry.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MemberLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-12">
                <div className="text-center space-y-2 mb-12">
                    <Title level={2} className="text-[#800000]! mb-0!">Need Help?</Title>
                    <Paragraph className="text-zinc-500 max-w-2xl mx-auto">
                        We're here to support you. Submit your inquiry below, and our team will get back to you as soon as possible.
                    </Paragraph>
                </div>

                <div className="flex justify-center">
                    <div className="w-full max-w-2xl bg-white border border-zinc-200 rounded-3xl p-8 md:p-12 shadow-md">
                        {successMessage && <Alert message={successMessage} type="success" showIcon className="mb-8 rounded-xl" />}
                        {errorMessage && <Alert message={errorMessage} type="error" showIcon className="mb-8 rounded-xl" />}

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                <Form.Item
                                    label={<span className="text-zinc-700 font-semibold">Your Name</span>}
                                    name="name"
                                    rules={[{ required: true, message: 'Please enter your name!' }]}
                                >
                                    <Input size="large" className="rounded-xl border-zinc-300 h-12" placeholder="Jane Doe" />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="text-zinc-700 font-semibold">Your Email</span>}
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Please enter your email!' },
                                        { type: 'email', message: 'Please enter a valid email!' },
                                    ]}
                                >
                                    <Input size="large" className="rounded-xl border-zinc-300 h-12" placeholder="student@kabarak.ac.ke" />
                                </Form.Item>
                            </div>

                            <Form.Item
                                label={<span className="text-zinc-700 font-semibold">Subject</span>}
                                name="subject"
                                rules={[{ required: true, message: 'Please enter the subject!' }]}
                            >
                                <Input size="large" className="rounded-xl border-zinc-300 h-12" placeholder="What is this regarding?" />
                            </Form.Item>

                            <Form.Item
                                label={<span className="text-zinc-700 font-semibold">Message</span>}
                                name="message"
                                rules={[{ required: true, message: 'Please enter your message!' }]}
                            >
                                <Input.TextArea 
                                    rows={6} 
                                    className="rounded-xl border-zinc-300 p-4" 
                                    placeholder="Provide detailed information about your inquiry..."
                                />
                            </Form.Item>

                            <Form.Item className="mb-0 mt-8">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    size="large"
                                    icon={!loading && <SendOutlined />}
                                    className="w-full bg-[#800000] hover:bg-[#600000] border-none rounded-xl h-14 font-bold shadow-md shadow-[#800000]/20 text-lg"
                                >
                                    Submit Inquiry
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </MemberLayout>
    );
}

export default HelpPage;