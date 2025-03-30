import React, { useState } from 'react';
import { Layout, Button, Typography, Form, Input, Alert, Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import logo from '../assets/kabu-logo-Beveled-shadow.png';
import { login } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

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
        <Layout style={{ minHeight: '100vh' }}>
            <Header
                style={{
                    background: 'maroon',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 20px',
                    height: '80px',
                }}
            >
                <img
                    src={logo}
                    alt="Kabarak University Logo"
                    style={{ height: '60px' }}
                />
                <Title
                    level={4}
                    className="text-white mx-auto text-center flex-1"
                >
                    <span className="hidden sm:inline text-white text-xl md:text-2xl lg:text-3xl">Kabarak Student Welfare Management System</span>
                    <span className="sm:hidden text-white text-lg md:text-xl">Student Welfare</span>
                </Title>
                <div className="ml-4">
                    <Button type="primary" style={{ backgroundColor: '#b5e487', borderColor: '#b5e487', color: 'black' }}>
                        <Link to="/">Back to Home</Link>
                    </Button>
                </div>
            </Header>

            <Content
                style={{
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        maxWidth: '400px',
                        width: '95%',
                        padding: '1.3rem',
                        borderRadius: 10,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        position: 'relative',
                    }}
                >
                    {loading && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 1,
                                borderRadius: 10,
                            }}
                        >
                            <Spin size="large" tip="Authenticating..." />
                        </div>
                    )}

                    <div>
                        <Title level={3} style={{ color: 'maroon', textAlign: 'center', marginBottom: '0.3rem' }}>
                            Login
                        </Title>
                        <img
                            src={logo}
                            alt="Kabarak University Logo"
                            style={{
                                height: '45px',
                                margin: 'auto',
                                marginBottom: '1.5rem',
                            }}
                        />
                    </div>

                    {feedback.message && (
                        <Alert
                            message={feedback.message}
                            type={feedback.type}
                            showIcon
                            style={{ marginBottom: '1.5rem' }}
                        />
                    )}

                    <Form name="login_form" initialValues={{ remember: true }} onFinish={onFinish}>
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
                            <Input prefix={<UserOutlined />} placeholder="Email" />
                        </Form.Item>
                        <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password!' }]}>
                            <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ width: '100%', backgroundColor: '#b5e487', color: "black", borderColor: 'maroon' }}
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Log In'}
                            </Button>
                        </Form.Item>
                        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                            <Link to="/signup">Not a member? Sign up</Link>
                        </div>
                    </Form>
                </div>
            </Content>

            <Footer style={{ textAlign: 'center', backgroundColor: '#b5e487', padding: '24px' }}>
                KABU Student Welfare Management System ©2025 Team Project
            </Footer>
        </Layout>
    );
};

export default LoginPage;