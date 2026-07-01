import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button, Alert, Spin, Form, Input } from 'antd';
import { MailOutlined, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import { API_URL } from '../services/api';
import PublicLayout from '../components/PublicLayout';

const VerificationPage = () => {
    const { token } = useParams();
    const [verificationStatus, setVerificationStatus] = useState('pending');
    const [message, setMessage] = useState('Verifying your email...');
    const navigate = useNavigate();
    const [resendStatus, setResendStatus] = useState('idle');
    const [resendMessage, setResendMessage] = useState('');
    const [resendEmailForm] = Form.useForm();
    const [showResendOption, setShowResendOption] = useState(false);
    const timerRef = useRef();
    const hasVerifiedRef = useRef(false);

    useEffect(() => {
        const verifyEmail = async () => {
            // Prevent multiple verification attempts
            if (hasVerifiedRef.current) return;
            hasVerifiedRef.current = true;

            setVerificationStatus('pending');
            setShowResendOption(false);
            setMessage('Verifying your email...');

            const statusRef = { current: 'pending' };

            // Use timerRef to store the timeout ID
            timerRef.current = setTimeout(() => {
                if (statusRef.current === 'pending') {
                    setShowResendOption(true);
                    setMessage('Verification is taking longer than expected. You can resend the email.');
                }
            }, 15000);

            try {
                const response = await axios.get(`${API_URL}/auth/verify-email/${token}`);
                statusRef.current = 'success';
                setVerificationStatus('success');
                setMessage(response.data.message);
                setShowResendOption(false);
                clearTimeout(timerRef.current);

                // Redirect after a short delay
                setTimeout(() => navigate('/login', { replace: true }), 3000);
            } catch (error) {
                statusRef.current = 'error';
                setVerificationStatus('error');
                setMessage(error.response?.data?.message || 'Email verification failed. Please try again or contact support.');
                setShowResendOption(true);
                clearTimeout(timerRef.current);
            }
        };

        if (token) verifyEmail();
        else {
            setVerificationStatus('error');
            setMessage('Invalid verification link.');
            setShowResendOption(true);
        }

        // Cleanup: clear timeout using timerRef
        return () => {
            clearTimeout(timerRef.current);
            hasVerifiedRef.current = true;
        };
    }, [token, navigate]);

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
        <PublicLayout>
            <div className="flex-1 flex justify-center items-center px-6 py-12">
                <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 shadow-xl p-8 md:p-10 text-center relative">
                    <h2 className="text-3xl font-bold text-[#800000] mb-2">Verify Email</h2>
                    <p className="text-zinc-500 mb-8">Confirming your account registration</p>

                    {verificationStatus === 'success' ? (
                        <div>
                            <CheckCircleFilled className="text-5xl text-[#b5e487] mb-4" />
                            <Alert
                                message={
                                    <span>
                                        <strong>Success!</strong> {message} You will be redirected to login page shortly.
                                    </span>
                                }
                                type="success"
                                className="mb-6 rounded-xl text-left"
                            />
                            <Button 
                                size="large"
                                className="w-full bg-[#b5e487]/50 text-zinc-600 border-none rounded-xl h-12 font-bold cursor-not-allowed"
                                disabled
                            >
                                Redirecting to Login...
                            </Button>
                        </div>
                    ) : verificationStatus === 'error' ? (
                        <div>
                            <CloseCircleFilled className="text-5xl text-[#800000] mb-4" />
                            <Alert
                                message={
                                    <span>
                                        <strong>Verification Failed!</strong> {message}
                                    </span>
                                }
                                type="error"
                                className="mb-6 rounded-xl text-left"
                            />
                            {showResendOption && resendUI()}
                            <Link to="/">
                                <Button size="large" className="w-full rounded-xl h-12 mt-4 font-semibold text-zinc-600 hover:text-[#800000] hover:border-[#800000]">
                                    Back to Home
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="py-8">
                            <Spin size="large" />
                            <p className="mt-6 text-zinc-600 font-medium">{message}</p>
                            {showResendOption && <div className="mt-8">{resendUI()}</div>}
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );

    function resendUI() {
        return (
            <div className="text-left mt-6 pt-6 border-t border-zinc-100">
                <h4 className="font-bold text-zinc-800 mb-4">Resend Verification Email</h4>
                {resendStatus === 'success' && (
                    <Alert message={resendMessage} type="success" className="mb-4 rounded-xl" />
                )}

                {resendStatus === 'error' && (
                    <Alert message={resendMessage} type="error" className="mb-4 rounded-xl" />
                )}

                {resendStatus === 'pending' ? (
                    <div className="flex justify-center py-4">
                        <Spin tip="Resending Email..." />
                    </div>
                ) : (
                    <Form form={resendEmailForm} onFinish={handleResendEmail} layout="vertical">
                        <Form.Item
                            name="email"
                            rules={[{ required: true, type: 'email', message: 'Please enter your email!' }]}
                        >
                            <Input 
                                size="large"
                                prefix={<MailOutlined className="text-zinc-400 mr-2" />} 
                                placeholder="Your registered email" 
                                className="rounded-xl border-zinc-300 h-12"
                            />
                        </Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            size="large"
                            className="w-full bg-[#800000] hover:bg-[#600000] border-none rounded-xl h-12 font-bold shadow-md shadow-[#800000]/20"
                        >
                            Resend Verification Email
                        </Button>
                    </Form>
                )}
            </div>
        );
    }
};

export default VerificationPage;