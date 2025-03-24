import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert, Typography, Spin, Card, Progress, Statistic, Row, Col } from 'antd';
import { PhoneOutlined, PayCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { initiateMpesaPayment, API_URL } from '../services/api'; // Assuming you'll create this API function

const { Title, Text, Paragraph } = Typography;

const MpesaPaymentForm = ({ campaign, onPaymentSuccess, onPaymentError, initialAmount }) => {
    console.log("Campaign Data:", campaign); // Debugging: Log the campaign object

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('initial'); // 'initial', 'pending', 'success', 'failed', 'cancelled'
    const [transactionId, setTransactionId] = useState(null);

    const onFinish = async (values) => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        setPaymentStatus('pending'); // Set payment status to pending immediately after initiating
        setTransactionId(null); // Reset transaction ID for new payments

        try {
            console.log('Initiating payment with:', {
                phone: values.phone,
                amount: values.amount,
                campaignId: campaign.id
            });
            // Format phone number
            const phoneNumber = values.phone.startsWith('0') ? '254' + values.phone.substring(1) : values.phone;
            const amount = Number(values.amount);

            // Include campaignId here!  <------ IMPORTANT CHANGE
            const paymentData = {
                phone: phoneNumber,
                amount: amount,
                campaignId: campaign.id // <---- ADD campaignId: campaign._id
            };

            const response = await initiateMpesaPayment(paymentData); // Send the paymentData object
            if (response.message === 'Payment initiated successfully') {
                setTransactionId(response.data.checkoutRequestId); // Store transaction ID
                startPolling(response.data.checkoutRequestId); // Start polling for payment status
                setSuccessMessage('Payment initiation successful! Please check your phone to complete the M-Pesa payment.');
                form.resetFields();
            } else {
                setPaymentStatus('failed');
                setError(response.error || 'Payment initiation failed. Please try again.');
                if (onPaymentError) {
                    onPaymentError(response.error || 'Payment initiation failed.');
                }
            }

        } catch (error) {
            console.error('Full payment error:', error);
            setPaymentStatus('failed');
            setError(error.message || 'Payment initiation failed. Please check your network and try again.');
            if (onPaymentError) {
                onPaymentError(error.message || 'Payment initiation failed.');
            }
        } finally {
            setLoading(false);
        }
    };

    const pollInterval = 3000; // Poll every 3 seconds
    const timeoutDuration = 60000; // Timeout after 60 seconds (adjust as needed)
    const startTime = Date.now();

    const startPolling = (checkoutRequestId) => {
        const intervalId = setInterval(async () => {
            if (Date.now() - startTime > timeoutDuration) {
                clearInterval(intervalId);
                setPaymentStatus('cancelled'); // Treat timeout as cancellation
                setError('Payment verification timed out. Please check your M-Pesa and contribution history later.');
                return;
            }
            try {
                const response = await fetch(`${API_URL}/contributions/status/${checkoutRequestId}`, { // Backend endpoint to check status
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    console.error('Error polling payment status:', response.status, response.statusText);
                    return; // Don't set error here, just retry
                }
                const data = await response.json();
                if (data.status === 'completed') {
                    clearInterval(intervalId);
                    setPaymentStatus('success');
                    setSuccessMessage('Payment successful! Thank you for your contribution.');
                    if (onPaymentSuccess) {
                        onPaymentSuccess();
                    }
                } else if (data.status === 'failed' || data.status === 'refunded') {
                    clearInterval(intervalId);
                    setPaymentStatus('failed');
                    setError('Payment failed or was cancelled. Please try again.');
                }
                // 'pending' status will continue polling
            } catch (error) {
                console.error('Error during status polling:', error);
                // Do not set error state to allow retry on next poll.
                // In a real app, you might want to handle network errors more gracefully.
            }
        }, pollInterval);
    };


    // In MpesaPaymentForm.jsx
    useEffect(() => {
        if (initialAmount) {
            form.setFieldsValue({ amount: initialAmount });
        }
    }, [initialAmount, form]);

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        setError('Form submission failed. Please check the fields.');
    };

    const getPaymentStatusDisplay = () => {
        switch (paymentStatus) {
            case 'pending':
                return <Alert
                    message={<>
                        <ClockCircleOutlined style={{ marginRight: 8 }} /> Waiting for M-Pesa payment confirmation. Please check your phone and complete the payment. Do not close this window.
                    </>}
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                />;
            case 'success':
                return <Alert
                    message={<>
                        <CheckCircleOutlined style={{ marginRight: 8 }} /> Payment Successful! Thank you for your contribution.
                    </>}
                    type="success"
                    showIcon
                    style={{ marginBottom: 16 }}
                    closable afterClose={() => setPaymentStatus('initial')}
                />;
            case 'failed':
            case 'cancelled':
                return <Alert
                    message={<>
                        <CloseCircleOutlined style={{ marginRight: 8 }} /> Payment Failed or Cancelled. Please try again.
                    </>}
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                    closable afterClose={() => setPaymentStatus('initial')}
                />;
            default:
                return null;
        }
    };


    return (
        <div>
            {getPaymentStatusDisplay()} {/* Display payment status alerts */}
            {error && paymentStatus !== 'failed' && paymentStatus !== 'cancelled' && <Alert message={`Payment Error: ${error}`} type="error" showIcon style={{ marginBottom: 16 }} />} {/* General errors, not payment specific */}

            {/* Campaign Information */}
            {campaign && (
                <Card
                    style={{
                        borderRadius: 6,
                        border: '1px solid',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        marginBottom: 24,
                        padding: 16,
                    }}
                >
                    <Title level={4} style={{ color: 'maroon', marginBottom: 8 }}>
                        {campaign.title || "No Title Available"}
                    </Title>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                        {campaign.category || "No Category Available"}
                    </Text>
                    <Progress
                        percent={Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100)}
                        status={campaign.currentAmount >= campaign.goal ? "success" : "active"}
                        strokeColor="maroon"
                        style={{ margin: '16px 0' }}
                    />
                    <Row gutter={16}>
                        <Col span={12}>
                            <Statistic title="Target" value={campaign.goal || 0} prefix="KES" />
                        </Col>
                        <Col span={12}>
                            <Statistic title="Raised" value={campaign.raised || 0} prefix="KES" />
                        </Col>
                    </Row>
                    <Paragraph style={{ marginTop: 16 }}>
                        <Text strong style={{ color: 'maroon' }}>Description:</Text> {campaign.description || "No description available"}
                    </Paragraph>
                    <Paragraph>
                        <Text strong style={{ color: 'maroon' }}>Details:</Text> {campaign.details || "No details available"}
                    </Paragraph>
                    <Paragraph>
                        <Text strong style={{ color: 'maroon' }}>End Date:</Text> {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "No end date available"}
                    </Paragraph>
                </Card>
            )}

            {paymentStatus === 'initial' || paymentStatus === 'failed' || paymentStatus === 'cancelled' ? (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label={<Text strong>Phone Number (Safaricom)</Text>}
                        name="phone"
                        rules={[
                            { required: true, message: 'Please enter your phone number' },
                            {
                                pattern: /^(07|01)\d{8}$/, // Kenyan Safaricom number format (starting 07 or 01)
                                message: 'Please enter a valid Kenyan Safaricom phone number starting with 07 or 01 (e.g., 0712345678)',
                            },
                        ]}
                    >
                        <Input
                            prefix={<PhoneOutlined />}
                            placeholder="07XXXXXXXX or 01XXXXXXXX"
                            maxLength={10} // Limit to 10 digits for Kenyan numbers
                            disabled={loading || paymentStatus === 'pending'}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<Text strong>Amount (KES)</Text>}
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
                            prefix="KES "
                            placeholder="Amount in KES"
                            min={1}
                            disabled={loading || paymentStatus === 'pending'}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            icon={<PayCircleOutlined />}
                            style={{ backgroundColor: '#b5e487', borderColor: 'maroon', color: 'black' }}
                            disabled={loading || paymentStatus === 'pending'}
                        >
                            Initiate M-Pesa Payment
                        </Button>
                    </Form.Item>
                </Form>
            ) : paymentStatus === 'pending' ? (
                <Spin tip="Waiting for M-Pesa Payment Confirmation..." style={{ display: 'block', marginTop: 24 }} />
            ) : null} {/* Don't show form after success */}

        </div>
    );
};

export default MpesaPaymentForm;