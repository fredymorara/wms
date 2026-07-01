import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert, Typography, Spin, Progress, Statistic, Row, Col, message } from 'antd';
import { PhoneOutlined, PayCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { initiateMpesaPayment, getContributionStatus, API_URL } from '../services/api'; 

const { Title, Text, Paragraph } = Typography;

const MpesaPaymentForm = ({ campaign, onPaymentSuccess, onPaymentError, initialAmount }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('initial');
    const [transactionId, setTransactionId] = useState(null);

    const onFinish = async (values) => {
        setLoading(true);
        setPaymentStatus('pending');
        setTransactionId(null);

        try {
            const phoneNumber = values.phone.startsWith('0') ? '254' + values.phone.substring(1) : values.phone;
            const amount = Number(values.amount);

            const paymentData = {
                phone: phoneNumber,
                amount: amount,
                campaignId: campaign.id || campaign._id
            };

            const response = await initiateMpesaPayment(paymentData);
            if (response.message === 'Payment initiated successfully') {
                setTransactionId(response.data.checkoutRequestId);
                form.resetFields();
            } else {
                setPaymentStatus('failed');
                if (onPaymentError) {
                    onPaymentError(response.error || 'Payment initiation failed.');
                }
            }

        } catch (error) {
            setPaymentStatus('failed');
            if (onPaymentError) {
                onPaymentError(error.message || 'Payment initiation failed.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const pollInterval = 3000;
        const timeoutDuration = 60000;
        const startTime = Date.now();

        const startPolling = (checkoutRequestId) => {
            const intervalId = setInterval(async () => {
                const elapsedTime = Date.now() - startTime;
                if (elapsedTime > timeoutDuration) {
                    clearInterval(intervalId);
                    setPaymentStatus('cancelled');
                    return;
                }

                try {
                    const data = await getContributionStatus(checkoutRequestId);

                    if (data.status === 'completed') {
                        clearInterval(intervalId);
                        setPaymentStatus('success');
                        if (onPaymentSuccess) {
                            onPaymentSuccess();
                        }
                    } else if (data.status === 'failed' || data.status === 'refunded') {
                        clearInterval(intervalId);
                        setPaymentStatus('failed');
                    }
                } catch (e) {
                    console.error('Payment verification error:', e);
                    message.error({ content: 'Failed to verify payment status', className: 'rounded-xl font-medium' });
                }
            }, pollInterval);

            return intervalId;
        };

        let intervalId;
        if (transactionId) {
            intervalId = startPolling(transactionId);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [transactionId, onPaymentSuccess]);
    
    useEffect(() => {
        if (initialAmount) {
            form.setFieldsValue({ amount: initialAmount });
        }
    }, [initialAmount, form]);

    const onFinishFailed = () => {
        message.error({ content: 'Please fill out all required fields correctly.', className: 'rounded-xl font-medium' });
    };

    const getPaymentStatusDisplay = () => {
        switch (paymentStatus) {
            case 'pending':
                return <Alert
                    message={
                        <div className="flex items-center gap-2">
                            <ClockCircleOutlined className="text-blue-500" />
                            <span className="font-medium text-blue-800">Waiting for M-Pesa confirmation. Please check your phone.</span>
                        </div>
                    }
                    className="bg-blue-50 border-blue-200 rounded-xl mb-6"
                />;
            case 'success':
                return <Alert
                    message={
                        <div className="flex items-center gap-2">
                            <CheckCircleOutlined className="text-green-500" />
                            <span className="font-medium text-green-800">Payment Successful! Thank you for your contribution.</span>
                        </div>
                    }
                    className="bg-green-50 border-green-200 rounded-xl mb-6"
                    closable afterClose={() => setPaymentStatus('initial')}
                />;
            case 'failed':
            case 'cancelled':
                return <Alert
                    message={
                        <div className="flex items-center gap-2">
                            <CloseCircleOutlined className="text-red-500" />
                            <span className="font-medium text-red-800">Payment Failed or Cancelled. Please try again.</span>
                        </div>
                    }
                    className="bg-red-50 border-red-200 rounded-xl mb-6"
                    closable afterClose={() => setPaymentStatus('initial')}
                />;
            default:
                return null;
        }
    };


    return (
        <div className="w-full">
            {getPaymentStatusDisplay()} 

            {campaign && (
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 mb-8">
                    <div className="mb-4">
                        <div className="text-xs font-bold tracking-wider text-green-700 uppercase mb-1">{campaign.category || "General"}</div>
                        <h3 className="text-xl font-bold text-zinc-900">{campaign.title || "Untitled Campaign"}</h3>
                    </div>
                    
                    <Progress
                        percent={Math.min(Math.round(((campaign.raised || campaign.currentAmount) / (campaign.goal || campaign.goalAmount)) * 100), 100)}
                        status={(campaign.raised || campaign.currentAmount) >= (campaign.goal || campaign.goalAmount) ? "success" : "active"}
                        strokeColor="#800000"
                        trailColor="#e4e4e7"
                        className="mb-6"
                        size={["100%", 8]}
                    />
                    
                    <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-zinc-200">
                        <div>
                            <div className="text-sm font-medium text-zinc-500 mb-1">Target</div>
                            <div className="text-lg font-bold text-zinc-800">KES {(campaign.goal || campaign.goalAmount || 0).toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-medium text-zinc-500 mb-1">Raised</div>
                            <div className="text-lg font-bold text-green-700">KES {(campaign.raised || campaign.currentAmount || 0).toLocaleString()}</div>
                        </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                        <p className="text-zinc-600">
                            <span className="font-semibold text-zinc-800 mr-2">Description:</span> 
                            {campaign.description || "No description available"}
                        </p>
                        <p className="text-zinc-600">
                            <span className="font-semibold text-zinc-800 mr-2">Deadline:</span> 
                            {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
                        </p>
                    </div>
                </div>
            )}

            {paymentStatus === 'initial' || paymentStatus === 'failed' || paymentStatus === 'cancelled' ? (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label={<span className="font-semibold text-zinc-700">M-Pesa Phone Number</span>}
                        name="phone"
                        rules={[
                            { required: true, message: 'Please enter your phone number' },
                            {
                                pattern: /^(07|01)\d{8}$/, 
                                message: 'Please enter a valid Kenyan Safaricom phone number starting with 07 or 01 (e.g., 0712345678)',
                            },
                        ]}
                    >
                        <Input
                            prefix={<PhoneOutlined className="text-zinc-400 mr-2" />}
                            placeholder="07XXXXXXXX or 01XXXXXXXX"
                            maxLength={10} 
                            disabled={loading || paymentStatus === 'pending'}
                            className="h-14 rounded-xl border-zinc-300 text-lg shadow-sm"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-semibold text-zinc-700">Amount (KES)</span>}
                        name="amount"
                        rules={[
                            { required: true, message: 'Please enter the amount' },
                            () => ({
                                validator(_, value) {
                                    if (value && Number(value) >= 1) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Amount must be at least 1 KES'));
                                },
                            }),
                        ]}
                    >
                        <Input
                            type="number"
                            prefix={<span className="text-zinc-400 font-medium mr-2">KES</span>}
                            placeholder="Amount to donate"
                            min={1}
                            disabled={loading || paymentStatus === 'pending'}
                            className="h-14 rounded-xl border-zinc-300 text-lg font-semibold shadow-sm"
                        />
                    </Form.Item>

                    <Form.Item className="mt-8 mb-0">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            icon={<PayCircleOutlined />}
                            className="h-14 rounded-xl bg-[#b5e487] text-[#800000] border-none font-bold text-lg shadow-sm hover:opacity-90"
                            disabled={loading || paymentStatus === 'pending'}
                        >
                            Initiate Donation
                        </Button>
                    </Form.Item>
                </Form>
            ) : paymentStatus === 'pending' ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <Spin size="large" />
                    <p className="mt-6 text-zinc-600 font-medium text-center">We've sent an M-Pesa prompt to your phone.<br/>Please enter your PIN to complete the transaction.</p>
                </div>
            ) : null}

        </div>
    );
};

export default MpesaPaymentForm;
