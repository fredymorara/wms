import React from 'react';
import { Layout, Button, Typography, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const LoginPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        // Simulate an API call for authentication (replace with your actual API endpoint)
        const response = await simulateLogin(values.email, values.password);

        if (response.success) {
            // Store user data and role in local storage or context
            localStorage.setItem('user', JSON.stringify(response.user));  // Store user details (including role)
            message.success('Login successful!');

            // Redirect based on user role
            switch (response.user.role) {
                case 'admin':
                    navigate('/admin/dashboard'); // Replace with your actual admin route
                    break;
                case 'secretary':
                    navigate('/secretary/dashboard'); // Replace with your actual secretary route
                    break;
                case 'treasurer':
                    navigate('/treasurer/dashboard'); // Replace with your actual treasurer route
                    break;
                case 'member':
                    navigate('/member/dashboard'); // Replace with your actual member route
                    break;
                default:
                    navigate('/default/dashboard'); // Handle unexpected roles or errors
                    break;
            }
        } else {
            message.error('Login failed. Invalid credentials.');
        }
    };

    //Simulate login API call
    const simulateLogin = async (email, password) => {
        // Replace with your actual API call
        return new Promise((resolve) => {
            setTimeout(() => {
                //Mock user data (replace with data from your database)
                const mockUsers = [
                    { id: 1, email: 'admin@example.com', password: 'password', role: 'admin', name:'Admin User' },
                    { id: 2, email: 'secretary@example.com', password: 'password', role: 'secretary', name: 'Secretary User' },
                    { id: 3, email: 'treasurer@example.com', password: 'password', role: 'treasurer', name: 'Treasurer User' },
                    { id: 4, email: 'member@example.com', password: 'password', role: 'member', name: 'Member User' },
                ];

                const user = mockUsers.find(u => u.email === email && u.password === password);

                if (user) {
                    resolve({ success: true, user: user });
                } else {
                    resolve({ success: false });
                }
            }, 1000); //Simulate network latency
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
                    padding: '0 50px',
                    height: '80px',
                }}
            >
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                    Kabarak Student Welfare Management System
                </Title>
                <div> {/*  Container for buttons in the header */}
                    <Button type="primary" style={{ backgroundColor: '#b5e487', borderColor: '#b5e487', color: 'black' }}>
                        <Link to="/">Back to Home</Link>
                    </Button>
                </div>
            </Header>

            <Content
                style={{
                    padding: '50px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        width: '400px',  // Adjust the width as needed
                        padding: '3rem',
                        borderRadius: 10,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    }}
                >
                    <Title level={3} style={{ color: 'maroon', textAlign: 'center', marginBottom: '1.5rem' }}>
                        Login
                    </Title>
                    <Form
                        name="login_form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'Please enter your email!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please enter your password!' }]}
                        >
                            <Input
                                prefix={<LockOutlined />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ width: '100%', backgroundColor: 'maroon', borderColor: 'maroon' }}
                            >
                                Log In
                            </Button>
                        </Form.Item>
                    {/* Sign Up Link */}
                        <div style={{ textAlign: 'center', marginTop: '1rem',  }}>
                            <Link to="/signup">Not a member? Sign up</Link>
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

export default LoginPage;