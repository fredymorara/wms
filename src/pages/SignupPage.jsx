import React, { useState } from 'react';
import { Layout, Button, Typography, Form, Input, Alert } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import logo from '../assets/kabu-logo-Beveled-shadow.png';
import { register } from '../services/api';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const SignupPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const onFinish = async (values) => {
        const { email, password, confirmPassword, fullName, admissionNumber } = values;

        if (!email.endsWith('@kabarak.ac.ke')) {
            setFeedback({ type: 'error', message: 'Only emails ending with @kabarak.ac.ke are allowed.' });
            return;
        }

        if (password !== confirmPassword) {
            setFeedback({ type: 'error', message: 'Passwords do not match.' });
            return;
        }

        try {
            const response = await register({
                email,
                password,
                fullName,
                admissionNumber,
                role: 'member',
            });

            if (response.user) {
                setFeedback({
                    type: 'success',
                    message: 'Registration successful! Please check your email to verify your account.'
                });
            } else {
                setFeedback({ type: 'error', message: response.message || 'Signup failed. Please try again.' });
            }
        } catch (error) {
            console.error('Registration error:', error);
            if (error.response?.data?.message === 'User already exists') {
                setFeedback({ type: 'error', message: 'A user with this email or admission number already exists.' });
            } else {
                setFeedback({ type: 'error', message: error.message || 'Signup failed. Please try again.' });
            }
        }
    };

    return (
        <Layout
            style={{
                background: 'linear-gradient(to bottom, #F8E8EC 70%, #d9f7be)',
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
                    style={{ height: '60px' }}
                />
                <Title
                    level={4}
                    className="text-white mx-auto text-center flex-1"
                >
                    <span className="hidden sm:inline text-xl text-white md:text-2xl lg:text-3xl">
                        Kabarak Student Welfare Management System
                    </span>
                    <span className="sm:hidden text-lg text-white md:text-xl">KSW System</span>
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
                            Sign Up
                        </Title>
                        <img
                            src={logo}
                            alt="Kabarak University Logo"
                            style={{ height: '45px', margin: 'auto', marginBottom: '1.5rem' }}
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

                    <Form form={form} name="signup_form" initialValues={{ remember: true }} onFinish={onFinish}>
                        <Form.Item
                            name="fullName"
                            rules={[{ required: true, message: 'Please enter your full name!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Full Name" />
                        </Form.Item>
                        <Form.Item
                            name="admissionNumber"
                            rules={[{ required: true, message: 'Please enter your admission number!' }]}
                        >
                            <Input prefix={<IdcardOutlined />} placeholder="Admission Number" />
                        </Form.Item>
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
                            <Input prefix={<MailOutlined />} placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: 'Please enter your password!' },
                                { min: 6, message: 'Password must be at least 6 characters long.' },
                            ]}
                        >
                            <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
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
                            <Input prefix={<LockOutlined />} type="password" placeholder="Confirm Password" />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ width: '100%', backgroundColor: '#b5e487', color: 'black', borderColor: 'maroon' }}
                            >
                                Sign Up
                            </Button>
                        </Form.Item>
                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <Link to="/login">Already a member? Log in</Link>
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

export default SignupPage;