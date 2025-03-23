import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert, Typography, Card, Row, Col } from 'antd';
import MemberLayout from '../../layout/MemberLayout';
import { API_URL } from '../../services/api'; // Import API_URL

const { Title, Paragraph, Text } = Typography;

function HelpPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isMobile, setIsMobile] = useState(false);

    // Mobile detection (no changes needed)
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const onFinish = async (values) => {
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');
        try {
            // Updated API endpoint using API_URL and correct route
            const response = await fetch(`${API_URL}/member/inquiry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                setSuccessMessage('Your inquiry has been submitted successfully!');
                form.resetFields(); // Clear the form
            } else {
                const errorData = await response.json(); // Get error data from response
                setErrorMessage(errorData.message || 'Failed to submit inquiry. Please try again.'); // Use error message from backend if available
            }
        } catch (error) {
            setErrorMessage('An error occurred while submitting your inquiry.');
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        setErrorMessage('Please fill in all required fields correctly.');
    };

    // Section styling (no changes needed)
    const sectionStyle = {
        padding: isMobile ? '24px 16px' : '32px 24px',
        marginBottom: 24,
        borderBottom: '2px solid #f0f0f0',
    };

    return (
        <MemberLayout>
            <div style={{
                width: '100%',
                maxWidth: 1600,
                margin: '0 auto',
                backgroundColor: '#fff',
                minHeight: '100vh',
            }}>
                {/* Help Header (no changes needed) */}
                <div style={{ ...sectionStyle, textAlign: 'center' }}>
                    <Title level={1} style={{
                        color: 'maroon',
                        fontSize: isMobile ? '1.75rem' : '2.5rem',
                        marginBottom: 0,
                    }}>
                        Need Help?
                    </Title>
                    <Paragraph style={{ marginBottom: '20px', textAlign: 'center' }}>
                        Please submit your inquiry below, and we will get back to you as soon as possible.
                    </Paragraph>
                </div>

                {/* Inquiry Form (no changes needed) */}
                <div style={sectionStyle}>
                    <Row justify="center">
                        <Col xs={24} md={16} lg={12}>
                            <Card>
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                    autoComplete="off"
                                >
                                    <Form.Item
                                        label={<Text strong>Your Name</Text>}
                                        name="name"
                                        rules={[{ required: true, message: 'Please enter your name!' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label={<Text strong>Your Email</Text>}
                                        name="email"
                                        rules={[
                                            { required: true, message: 'Please enter your email!' },
                                            { type: 'email', message: 'Please enter a valid email!' },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label={<Text strong>Subject</Text>}
                                        name="subject"
                                        rules={[{ required: true, message: 'Please enter the subject!' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label={<Text strong>Message</Text>}
                                        name="message"
                                        rules={[{ required: true, message: 'Please enter your message!' }]}
                                    >
                                        <Input.TextArea rows={4} />
                                    </Form.Item>

                                    {successMessage && <Alert message={successMessage} type="success" showIcon style={{ marginBottom: '15px' }} />}
                                    {errorMessage && <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: '15px' }} />}

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                            style={{
                                                background: '#b5e487',
                                                borderColor: 'maroon',
                                                color: 'black',
                                                width: "100%"
                                            }}
                                        >
                                            Submit Inquiry
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </MemberLayout>
    );
}

export default HelpPage;