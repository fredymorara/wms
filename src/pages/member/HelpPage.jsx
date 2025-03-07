import React, { useState } from 'react';
import { Form, Input, Button, Alert, Layout, Typography } from 'antd';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

function HelpPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const onFinish = async (values) => {
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');
        try {
            const response = await fetch('http://localhost:5000/api/member/inquiry', {  // Replace with your API endpoint
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
                setErrorMessage('Failed to submit inquiry. Please try again.');
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
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    padding: '0 50px',
                    height: '80px',
                }}
            >
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                    Kabarak Student Welfare Management System
                </Title>
            </Header>
            <Content style={{ padding: '50px' }}>
                <div className="container">
                    <Title level={2} style={{ color: 'maroon', marginBottom: '20px', textAlign: 'center' }}>Need Help?</Title>
                    <Paragraph style={{ marginBottom: '20px', textAlign: 'center' }}>
                        Please submit your inquiry below, and we will get back to you as soon as possible.
                    </Paragraph>

                    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '8px', padding: '20px' }}>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label={<Title level={5}>Your Name</Title>}
                                name="name"
                                rules={[{ required: true, message: 'Please enter your name!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label={<Title level={5}>Your Email</Title>}
                                name="email"
                                rules={[
                                    { required: true, message: 'Please enter your email!' },
                                    { type: 'email', message: 'Please enter a valid email!' },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label={<Title level={5}>Subject</Title>}
                                name="subject"
                                rules={[{ required: true, message: 'Please enter the subject!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label={<Title level={5}>Message</Title>}
                                name="message"
                                rules={[{ required: true, message: 'Please enter your message!' }]}
                            >
                                <Input.TextArea rows={4} />
                            </Form.Item>

                            {successMessage && <Alert message={successMessage} type="success" showIcon style={{ marginBottom: '15px' }} />}
                            {errorMessage && <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: '15px' }} />}

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}>
                                    Submit Inquiry
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Content>
        </Layout>
    );
}

export default HelpPage;