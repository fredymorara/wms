import React, { useState } from 'react';
import { Layout, Button, Typography, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import logo from '../assets/kabu-logo-Beveled-shadow.png'; // Make sure to import the logo

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const SignupPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const response = await simulateSignup(values);

        if (response.success) {
            message.success('Signup successful! Please login.');
            navigate('/login');
        } else {
            message.error(response.message || 'Signup failed. Please try again.');
        }
    };

    const simulateSignup = async (values) => {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if (!emailRegex.test(values.email)) {
            return { success: false, message: 'Invalid email format.' };
        }

        if (values.password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters long.' };
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                if (!values.email.endsWith('@yourstudentsdomain.com')) {
                    resolve({ success: false, message: 'Please use your university email address.' });
                    return;
                }
                resolve({ success: true });
            }, 1000);
        });
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
                    style={{
                        height: '60px',
                    }}
                />
                <Title
                    level={4}
                    className="text-white mx-auto text-center flex-1"
                >
                    <span className="hidden sm:inline text-xl text-white md:text-2xl lg:text-3xl">Kabarak Student Welfare Management System</span>
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
                        width: '90%',
                        padding: '2rem',
                        borderRadius: 10,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    }}
                >
                    <Title level={3} style={{ color: 'maroon', textAlign: 'center', marginBottom: '1.5rem' }}>
                        Sign Up
                    </Title>
                    <Form form={form} name="signup_form" initialValues={{ remember: true }} onFinish={onFinish}>
                        <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}>
                            <Input prefix={<MailOutlined />} placeholder="Email" />
                        </Form.Item>
                        <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password!' }]}>
                            <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
                        </Form.Item>
                        <Form.Item name="confirmPassword" dependencies={['password']} rules={[{ required: true, message: 'Please confirm your password!' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) { return Promise.resolve(); } return Promise.reject(new Error('The two passwords that you entered do not match!')); }, }),]}>
                            <Input prefix={<LockOutlined />} type="password" placeholder="Confirm Password" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: '#b5e487', color: 'black', borderColor: 'maroon' }}>
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