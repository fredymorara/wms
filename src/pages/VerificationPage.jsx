// src/pages/VerificationPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout, Button, Typography, Alert, Spin, Form, Input } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import logo from '../assets/kabu-logo-Beveled-shadow.png';
import axios from 'axios';
import { API_URL } from '../services/api';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const VerificationPage = () => {
    const { token } = useParams();
    const [verificationStatus, setVerificationStatus] = useState('pending');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [resendStatus, setResendStatus] = useState('idle');
    const [resendMessage, setResendMessage] = useState('');
    const [resendEmailForm] = Form.useForm();
    const [showResendOption, setShowResendOption] = useState(false); // New state

    console.log('Received Token:', token);

    useEffect(() => {
        let timer; // Declare timer outside the try/catch block but inside useEffect scope
        const verifyEmail = async () => {
            setVerificationStatus('pending');
            setShowResendOption(false); // Initially hide resend option
            setMessage('Waiting for verification...'); // Initial message

            // Set timeout to show resend option after 15 seconds
            timer = setTimeout(() => { // Assign timer here
                setShowResendOption(true);
                if (verificationStatus === 'pending') {
                    setMessage('Verification still pending. You can resend the email.'); // Update message if still pending
                }
            }, 15000); // 15 seconds

            try {
                const response = await axios.get(`${API_URL}/auth/verify-email/${token}`);
                console.log("Verification Response:", response);
                setVerificationStatus('success');
                setMessage(response.data.message);
                clearTimeout(timer); // Clear timeout if verification succeeds before 15 seconds
                setTimeout(() => {
                    navigate('/login', { replace: true });
                }, 3000);
            } catch (error) {
                console.error('Email verification failed:', error);
                console.error("Verification Error Response:", error.response);
                setVerificationStatus('error');
                setMessage(error.response?.data?.message || 'Email verification failed. Please try again or contact support.');
                setShowResendOption(true); // Show resend option immediately on error
                clearTimeout(timer); // Clear timeout if verification fails before 15 seconds
            }
        };

        if (token) {
            verifyEmail();
        } else {
            setVerificationStatus('error');
            setMessage('Invalid verification link.');
            setShowResendOption(true); // Show resend option immediately if token is invalid
        }

        return () => clearTimeout(timer); // Cleanup timeout on unmount
    }, []);

    const handleResendEmail = async (values) => {
        setResendStatus('pending');
        setResendMessage('');
        try {
            const response = await axios.post(`${API_URL}/auth/resend-verification-email`, {
                email: values.email,
            });
            setResendStatus('success');
            setResendMessage(response.data.message);
            resendEmailForm.resetFields();
            setTimeout(() => {
                setResendStatus('idle');
                setResendMessage('');
            }, 5000);
        } catch (error) {
            console.error('Resend email failed:', error);
            setResendStatus('error');
            setResendMessage(error.response?.data?.message || 'Failed to resend verification email.');
            setTimeout(() => {
                setResendStatus('idle');
                setResendMessage('');
            }, 5000);
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
                    style={{
                        height: '60px',
                    }}
                />
                <Title
                    level={4}
                    className="text-white mx-auto text-center flex-1"
                >
                    <span className="hidden sm:inline text-white text-xl md:text-2xl lg:text-3xl">Kabarak Student Welfare Management System</span>
                    <span className="sm:hidden text-white text-lg">KSW System</span>
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
                        textAlign: 'center'
                    }}
                >
                    <div>
                        <Title level={3} style={{ color: 'maroon', textAlign: 'center', marginBottom: '0.3rem' }}>
                            Verify Email
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

                    {verificationStatus === 'pending' && !showResendOption && (
                        <div>
                            <Spin size="large" />
                            <Paragraph style={{ marginTop: '20px' }}>{message}</Paragraph> {/* Display "Waiting for verification..." */}
                        </div>
                    )}

                    {verificationStatus === 'pending' && showResendOption && (
                        <div>
                            <Paragraph style={{ marginTop: '20px', marginBottom: '1.5rem' }}>{message}</Paragraph> {/* Display "Verification still pending. You can resend the email." */}
                            {resendUI()}
                        </div>
                    )}


                    {verificationStatus === 'success' && (
                        <div>
                            <Alert
                                message={<Paragraph style={{ marginBottom: 0 }}><strong>Success!</strong> {message} You will be redirected to login page shortly.</Paragraph>}
                                type="success"
                                showIcon
                                style={{ marginBottom: '1.5rem' }}
                            />
                            <Button type="primary" style={{ width: '100%', backgroundColor: '#b5e487', color: "black", borderColor: 'maroon' }} disabled>
                                Redirecting to Login...
                            </Button>
                        </div>
                    )}

                    {verificationStatus === 'error' && showResendOption && (
                        <div>
                            <Alert
                                message={<Paragraph style={{ marginBottom: 0 }}><strong>Verification Failed!</strong> {message}</Paragraph>}
                                type="error"
                                showIcon
                                style={{ marginBottom: '1.5rem' }}
                            />
                            {resendUI()}
                            <Button style={{ width: '100%' }}>
                                <Link to="/">Back to Home</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </Content>

            <Footer style={{ textAlign: 'center', backgroundColor: '#b5e487', padding: '24px' }}>
                KABU Student Welfare Management System ©2025 Team Project
            </Footer>
        </Layout>
    );

    function resendUI() {
        return (
            <>
                {resendStatus === 'success' && (
                    <Alert
                        message={<Paragraph style={{ marginBottom: 0 }}><strong>Resend Email Success!</strong> {resendMessage}</Paragraph>}
                        type="success"
                        showIcon
                        style={{ marginBottom: '1.5rem' }}
                    />
                )}

                {resendStatus === 'error' && (
                    <Alert
                        message={<Paragraph style={{ marginBottom: 0 }}><strong>Resend Email Failed!</strong> {resendMessage}</Paragraph>}
                        type="error"
                        showIcon
                        style={{ marginBottom: '1.5rem' }}
                    />
                )}

                {resendStatus === 'pending' ? (
                    <Spin tip="Resending Email..." style={{ display: 'block', marginBottom: '1rem' }} />
                ) : (
                    <Form form={resendEmailForm} onFinish={handleResendEmail}>
                        <Form.Item
                            name="email"
                            rules={[{ required: true, type: 'email', message: 'Please enter your email!' }]}
                        >
                            <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Your registered email" />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: '#b5e487', color: "black", borderColor: 'maroon', marginBottom: '1rem' }} >
                            Resend Verification Email
                        </Button>
                    </Form>
                )}
            </>
        );
    }
};

export default VerificationPage;