import React from 'react';
import { Layout, Button, Typography, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import logo from '../assets/kabu-logo-Beveled-shadow.png'; // Ensure the path to your logo is correct

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const LoginPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const response = await simulateLogin(values.email, values.password);

        if (response.success) {
            localStorage.setItem('user', JSON.stringify(response.user));
            message.success('Login successful!');

            switch (response.user.role) {
                case 'admin':
                    navigate('/admin/dashboard');
                    break;
                case 'secretary':
                    navigate('/secretary/dashboard');
                    break;
                case 'treasurer':
                    navigate('/treasurer/dashboard');
                    break;
                case 'member':
                    navigate('/member/dashboard');
                    break;
                default:
                    navigate('/default/dashboard');
                    break;
            }
        } else {
            message.error('Login failed. Invalid credentials.');
        }
    };

    const simulateLogin = async (email, password) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUsers = [
                    { id: 1, email: 'admin@example.com', password: 'password', role: 'admin', name: 'Admin User' },
                    { id: 2, email: 'secretary@example.com', password: 'password', role: 'secretary', name: 'Secretary User' },
                    { id: 3, email: 'treasurer@example.com', password: 'password', role: 'treasurer', name: 'Treasurer User' },
                    { id: 4, email: 'member@example.com', password: 'password', role: 'member', name: 'Member User' },
                ];

                const user = mockUsers.find((u) => u.email === email && u.password === password);

                if (user) {
                    resolve({ success: true, user: user });
                } else {
                    resolve({ success: false });
                }
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
                        width: '90%',
                        padding: '2rem',
                        borderRadius: 10,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    }}
                >
                    <Title level={3} style={{ color: 'maroon', textAlign: 'center', marginBottom: '1.5rem' }}>
                        Login
                    </Title>
                    <Form name="login_form" initialValues={{ remember: true }} onFinish={onFinish}>
                        <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email!' }]}>
                            <Input prefix={<UserOutlined />} placeholder="Email" />
                        </Form.Item>
                        <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password!' }]}>
                            <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ width: '100%', backgroundColor: '#b5e487', color: "black", borderColor: 'maroon' }}
                            >
                                Log In
                            </Button>
                        </Form.Item>
                        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
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