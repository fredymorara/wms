import React, { useState } from 'react';
import { Button, Form, Input, Alert, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { register } from '../services/api';
import PublicLayout from '../components/PublicLayout';

const SignupPage = () => {
    const [form] = Form.useForm();
    const [feedback, setFeedback] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        setFeedback({ type: '', message: '' });

        try {
            if (values.password !== values.confirmPassword) {
                throw new Error('The two passwords do not match!');
            }

            const response = await register({
                email: values.email,
                password: values.password,
                fullName: values.fullName,
                admissionNumber: values.admissionNumber,
                role: 'member',
            });

            setFeedback({
                type: 'success',
                message: 'Registration successful! Please check your email to verify your account. Also check Spam!'
            });
            form.resetFields();
        } catch (error) {
            let errorMessage = 'Registration failed. Please try again.';

            if (error.message.includes('Network Error')) {
                errorMessage = 'Unable to connect to the server. Please check your internet connection.';
            } else if (error.response?.data?.message === 'User already exists') {
                errorMessage = 'A user with this email or admission number already exists.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message.includes('@kabarak.ac.ke')) {
                errorMessage = 'Only @kabarak.ac.ke emails are allowed.';
            } else {
                errorMessage = error.message || errorMessage;
            }

            setFeedback({ type: 'error', message: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <PublicLayout>
            <div className="flex-1 flex justify-center items-center px-6 py-12">
                <div className="w-full max-w-lg bg-white rounded-3xl border border-zinc-200 shadow-xl p-8 md:p-10 relative overflow-hidden">
                    {loading && (
                        <div className="absolute inset-0 bg-white/80 flex justify-center items-center z-10">
                            <Spin size="large" tip="Registering..." />
                        </div>
                    )}

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-[#800000] mb-2">Create an Account</h2>
                        <p className="text-zinc-500">Join the KABU student welfare community</p>
                    </div>

                    {feedback.message && (
                        <Alert
                            message={feedback.message}
                            type={feedback.type}
                            showIcon
                            className="mb-6 rounded-xl"
                        />
                    )}

                    <Form form={form} name="signup_form" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                            <Form.Item
                                name="fullName"
                                rules={[{ required: true, message: 'Please enter your full name!' }]}
                            >
                                <Input 
                                    size="large"
                                    prefix={<UserOutlined className="text-zinc-400 mr-2" />} 
                                    placeholder="Full Name" 
                                    className="rounded-xl border-zinc-300 h-12"
                                />
                            </Form.Item>
                            
                            <Form.Item
                                name="admissionNumber"
                                rules={[{ required: true, message: 'Please enter your admission number!' }]}
                            >
                                <Input 
                                    size="large"
                                    prefix={<IdcardOutlined className="text-zinc-400 mr-2" />} 
                                    placeholder="Admission Number" 
                                    className="rounded-xl border-zinc-300 h-12"
                                />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Please enter your email!' },
                                { type: 'email', message: 'Please enter a valid email!' },
                                {
                                    validator: (_, value) => {
                                        if (value && !value.endsWith('@kabarak.ac.ke')) {
                                            return Promise.reject('Only @kabarak.ac.ke emails are allowed.');
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <Input 
                                size="large"
                                prefix={<MailOutlined className="text-zinc-400 mr-2" />} 
                                placeholder="Student Email (@kabarak.ac.ke)" 
                                className="rounded-xl border-zinc-300 h-12"
                            />
                        </Form.Item>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                            <Form.Item
                                name="password"
                                rules={[
                                    { required: true, message: 'Please enter your password!' },
                                    { min: 6, message: 'Password must be at least 6 characters long.' },
                                ]}
                            >
                                <Input.Password 
                                    size="large"
                                    prefix={<LockOutlined className="text-zinc-400 mr-2" />} 
                                    placeholder="Password" 
                                    className="rounded-xl border-zinc-300 h-12"
                                />
                            </Form.Item>
                            
                            <Form.Item
                                name="confirmPassword"
                                dependencies={['password']}
                                rules={[
                                    { required: true, message: 'Please confirm your password!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('The two passwords do not match!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password 
                                    size="large"
                                    prefix={<LockOutlined className="text-zinc-400 mr-2" />} 
                                    placeholder="Confirm Password" 
                                    className="rounded-xl border-zinc-300 h-12"
                                />
                            </Form.Item>
                        </div>

                        <Form.Item className="mt-4 mb-4">
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                className="w-full bg-[#800000] hover:bg-[#600000] border-none rounded-xl h-12 font-bold shadow-md shadow-[#800000]/20"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </Button>
                        </Form.Item>
                        
                        <div className="text-center text-zinc-500">
                            Already have an account? <Link to="/login" className="text-[#800000] font-semibold hover:underline">Log in</Link>
                        </div>
                    </Form>
                </div>
            </div>
        </PublicLayout>
    );
};

export default SignupPage;