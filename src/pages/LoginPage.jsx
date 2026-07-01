import React, { useState } from 'react';
import { Button, Form, Input, Alert, Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import PublicLayout from '../components/PublicLayout';

const LoginPage = () => {
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        setFeedback({ type: '', message: '' });

        try {
            const response = await login(values);
            authLogin(response.user, response.token);
            navigate(response.user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard');
        } catch (error) {
            let errorMessage = 'Login failed. Please try again.';

            if (error.message.includes('Network Error')) {
                errorMessage = 'Unable to connect to the server. Please check your internet connection.';
            } else if (error.response?.status === 401) {
                errorMessage = error.response.data.message || 'Invalid credentials';
            } else if (error.response?.status === 403) {
                errorMessage = 'Your account is inactive. Please contact the administrator.';
            } else if (error.response?.data?.message?.includes('verify your email')) {
                errorMessage = 'Please verify your email address before logging in.';
            }

            setFeedback({
                type: 'error',
                message: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <PublicLayout>
            <div className="flex-1 flex justify-center items-center px-6 py-12">
                <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 shadow-xl p-8 relative overflow-hidden">
                    {loading && (
                        <div className="absolute inset-0 bg-white/80 flex justify-center items-center z-10">
                            <Spin size="large" tip="Authenticating..." />
                        </div>
                    )}

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-[#800000] mb-2">Welcome Back</h2>
                        <p className="text-zinc-500">Log in to your account to continue</p>
                    </div>

                    {feedback.message && (
                        <Alert
                            message={feedback.message}
                            type={feedback.type}
                            showIcon
                            className="mb-6 rounded-xl"
                        />
                    )}

                    <Form name="login_form" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical">
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Please enter your email!' },
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
                                prefix={<UserOutlined className="text-zinc-400 mr-2" />} 
                                placeholder="Student Email (@kabarak.ac.ke)" 
                                className="rounded-xl border-zinc-300 h-12"
                            />
                        </Form.Item>
                        
                        <Form.Item 
                            name="password" 
                            rules={[{ required: true, message: 'Please enter your password!' }]}
                        >
                            <Input.Password 
                                size="large"
                                prefix={<LockOutlined className="text-zinc-400 mr-2" />} 
                                placeholder="Password" 
                                className="rounded-xl border-zinc-300 h-12"
                            />
                        </Form.Item>

                        <div className="flex justify-end mb-6">
                            {/* Can add a Forgot Password link here later */}
                        </div>

                        <Form.Item className="mb-4">
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                className="w-full bg-[#800000] hover:bg-[#600000] border-none rounded-xl h-12 font-bold shadow-md shadow-[#800000]/20"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Log In'}
                            </Button>
                        </Form.Item>
                        
                        <div className="text-center text-zinc-500">
                            Don't have an account? <Link to="/signup" className="text-[#800000] font-semibold hover:underline">Sign up</Link>
                        </div>
                    </Form>
                </div>
            </div>
        </PublicLayout>
    );
};

export default LoginPage;