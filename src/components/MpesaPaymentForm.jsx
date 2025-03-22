import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert, Typography, Spin, Card, Progress, Statistic, Row, Col } from 'antd';
import { PhoneOutlined, PayCircleOutlined } from '@ant-design/icons';
import { initiateMpesaPayment } from '../services/api'; // Assuming you'll create this API function

const { Title, Text, Paragraph } = Typography;

const MpesaPaymentForm = ({ campaign, onPaymentSuccess, onPaymentError, initialAmount }) => {
    console.log("Campaign Data:", campaign); // Debugging: Log the campaign object

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const onFinish = async (values) => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
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
                setSuccessMessage('Payment initiation successful! Please check your phone to complete the M-Pesa payment.');
                if (onPaymentSuccess) {
                    onPaymentSuccess();
                }
                form.resetFields();
            } else {
                setError(response.error || 'Payment initiation failed. Please try again.');
                if (onPaymentError) {
                    onPaymentError(response.error || 'Payment initiation failed.');
                }
            }

        } catch (error) {
            console.error('Full payment error:', error);
            setError(error.message || 'Payment initiation failed. Please check your network and try again.');
            if (onPaymentError) {
                onPaymentError(error.message || 'Payment initiation failed.');
            }
        } finally {
            setLoading(false);
        }
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

    return (
        <div>
            {successMessage && <Alert message={successMessage} type="success" showIcon style={{ marginBottom: 16 }} />}
            {error && <Alert message={`Payment Error: ${error}`} type="error" showIcon style={{ marginBottom: 16 }} />}

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
                        percent={Math.min(Math.round((campaign.currentAmount / campaign.goalAmount) * 100), 100)}
                        status={campaign.currentAmount >= campaign.goalAmount ? "success" : "active"}
                        strokeColor="maroon"
                        style={{ margin: '16px 0' }}
                    />
                    <Row gutter={16}>
                        <Col span={12}>
                            <Statistic title="Target" value={campaign.goalAmount || 0} prefix="KES" />
                        </Col>
                        <Col span={12}>
                            <Statistic title="Raised" value={campaign.currentAmount || 0} prefix="KES" />
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

            {/* M-Pesa Payment Form */}
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
                    >
                        Initiate M-Pesa Payment
                    </Button>
                </Form.Item>
            </Form>
            {loading && <Spin tip="Initiating Payment..." style={{ display: 'block', marginTop: 24 }} />}
        </div>
    );
};

export default MpesaPaymentForm;