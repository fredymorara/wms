// src/pages/VerificationPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout, Button, Typography, Alert, Spin } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import logo from '../assets/kabu-logo-Beveled-shadow.png';
import axios from 'axios';
import { API_URL } from '../services/api';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const VerificationPage = () => {
    const { token } = useParams();
    const [verificationStatus, setVerificationStatus] = useState('pending');
    const [message, setMessage] = useState('');

    console.log('Received Token:', token);

    useEffect(() => {
        const verifyEmail = async () => {
            setVerificationStatus('pending');
            try {
                const response = await axios.get(`${API_URL}/auth/verify-email/${token}`);
                console.log("Verification Response:", response);
                setVerificationStatus('success');
                setMessage(response.data.message);
            } catch (error) {
                console.error('Email verification failed:', error);
                console.error("Verification Error Response:", error.response);
                setVerificationStatus('error');
                setMessage(error.response?.data?.message || 'Email verification failed. Please try again or contact support.');
            }
        };

        if (token) {
            verifyEmail();
        } else {
            setVerificationStatus('error');
            setMessage('Invalid verification link.');
        }
    }, []);

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

                    {verificationStatus === 'pending' && (
                        <div>
                            <Spin size="large" />
                            <Paragraph style={{ marginTop: '20px' }}>Verifying your email address...</Paragraph>
                        </div>
                    )}

                    {verificationStatus === 'success' && (
                        <div>
                            <Alert
                                message={<Paragraph style={{ marginBottom: 0 }}><strong>Success!</strong> {message} You can now log in.</Paragraph>}
                                type="success"
                                showIcon
                                style={{ marginBottom: '1.5rem' }}
                            />
                            <Button type="primary" style={{ width: '100%', backgroundColor: '#b5e487', color: "black", borderColor: 'maroon' }}>
                                <Link to="/login">Log In</Link>
                            </Button>
                        </div>
                    )}

                    {verificationStatus === 'error' && (
                        <div>
                            <Alert
                                message={<Paragraph style={{ marginBottom: 0 }}><strong>Verification Failed!</strong> {message}</Paragraph>}
                                type="error"
                                showIcon
                                style={{ marginBottom: '1.5rem' }}
                            />
                            <Button type="primary" style={{ width: '100%', backgroundColor: '#b5e487', color: "black", borderColor: 'maroon', marginBottom: '1rem' }}>
                                Resend Verification Email (Not Implemented)
                            </Button>
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
};

export default VerificationPage;