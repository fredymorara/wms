import React, { useState } from 'react';
import { Layout, Button, Typography, Form, Input, Alert } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import logo from '../assets/kabu-logo-Beveled-shadow.png';
import { login } from '../services/api'; // Import the login function from api.js
import { useAuth } from '../contexts/AuthContext';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const LoginPage = () => {
    const { login: authLogin } = useAuth(); // Rename to avoid conflict
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const onFinish = async (values) => {
        try {
            const response = await login(values); // Call the login function from api.js
            authLogin(response.user, response.token); // Use AuthContext's login method
            navigate(response.user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard');
        } catch (error) {
            setFeedback({
                type: 'error',
                message: error.response?.data?.message || 'Login failed. Check your credentials.',
            });
        }
    };

    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
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
                    style={{
                        height: '60px',
                    }}
                />
                <Title
                    level={4}
                    className="text-white mx-auto text-center flex-1"
                >
                    <span className="hidden sm:inline text-white text-xl md:text-2xl lg:text-3xl">Kabarak Student Welfare Management System</span>
                    <span className="sm:hidden text-white text-lg md:text-xl">KSW System</span>
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
                    }}
                >
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


                    {/* Feedback Message */}
                    {feedback.message && (
                        <Alert
                            message={feedback.message}
                            type={feedback.type} // "success" or "error"
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
                            >
                                Log In
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