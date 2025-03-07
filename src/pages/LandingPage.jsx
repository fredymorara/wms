import React from 'react';
import { Layout, Button, Typography, Row, Col, Card } from 'antd';
import { Link } from 'react-router-dom';
import {
    CloudUploadOutlined,
    LockOutlined,
    LineChartOutlined,
    UserOutlined,
} from '@ant-design/icons';
import logo from '../assets/kabu-logo-Beveled-shadow.png';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const LandingPage = () => {
    const featureData = [
        {
            title: 'Easy Contributions',
            description: 'Donate to campaigns quickly and securely through M-Pesa.',
            icon: <CloudUploadOutlined style={{ fontSize: '2em' }} />,
            key: '1',
        },
        {
            title: 'Secure Transactions',
            description: 'Your financial information is protected with robust security measures.',
            icon: <LockOutlined style={{ fontSize: '2em' }} />,
            key: '2',
        },
        {
            title: 'Transparent Reporting',
            description: 'Track campaign progress and see how your contributions are used.',
            icon: <LineChartOutlined style={{ fontSize: '2em' }} />,
            key: '3',
        },
        {
            title: 'Dedicated Support',
            description: 'Get help when you need it with our support resources.',
            icon: <UserOutlined style={{ fontSize: '2em' }} />,
            key: '4',
        },
    ];

    return (
        <Layout
            style={{
                background: 'linear-gradient(to bottom, #F8E8EC 70%, #d9f7be)',
                minHeight: '100vh',
                overflow: 'auto',
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
                <img
                    src={logo}
                    alt="Kabarak University Logo"
                    style={{
                        height: '60px',  // Adjust the height as needed
                        marginRight: '0 auto', // Add some spacing to the right of the logo
                    }}
                />
                <Title level={2} style={{ color: 'white', margin: '0', marginLeft: '1rem auto' }}>
                    Kabarak Student Welfare
                </Title>
                <Button type="primary" style={{ backgroundColor: '#b5e487', borderColor: '#b5e487', color: 'black' }}>
                    <Link to="/login">Log In</Link>
                </Button>
            </Header>

            <Content style={{ padding: '50px' }}>
                {/* Centered Hero Section */}
                <div
                    style={{
                        padding: '4rem',
                        borderRadius: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        maxWidth: '800px',
                        margin: '0 auto',
                        backgroundColor: 'rgba(255, 255, 255, 0.6)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Title level={1} style={{ color: 'maroon', marginBottom: '1.5rem' }}>
                        Support. Connect. Thrive.
                    </Title>
                    <Paragraph style={{ fontSize: '1.2rem', color: 'green', marginBottom: '2.5rem' }}>
                        A student-run platform dedicated to fostering a supportive community, providing financial
                        assistance, and promoting student well-being.
                    </Paragraph>
                    <Button
                        type="primary"
                        style={{
                            backgroundColor: 'maroon',
                            borderColor: 'maroon',
                            padding: '0.75rem 1.5rem',
                            fontSize: '1.1rem',
                        }}
                    >
                        <Link to="/signup">Get Started</Link>
                    </Button>
                </div>

                {/* Key Features Section */}
                <div style={{ marginTop: '80px', padding: '0 20px' }}> {/* Explicit Unit */}
                    <Title level={2} style={{ color: 'green', textAlign: 'center', marginBottom: '3rem' }}>
                        Key Features
                    </Title>
                    <Row gutter={[24, 24]} justify="center" style={{ maxWidth: '1200px', margin: '0 auto', alignItems: 'stretch' }}>
                        {featureData.map((feature) => (
                            <Col key={feature.key} xs={24} sm={12} md={8} lg={6} style={{ display: 'flex', }}>
                                <Card
                                    title={
                                        <div style={{ display: 'flex',paddingTop: '1.3rem', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
                                            {feature.icon}
                                            <span style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>{feature.title}</span>
                                        </div>
                                    }
                                    bordered={true}
                                    style={{ flex: 1, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
                                    bodyStyle={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem' }}
                                >
                                    <Paragraph style={{ color: '#555', textAlign: 'center' }}>{feature.description}</Paragraph>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Call to Action Section */}
                <div
                    style={{
                        margin: '0 auto',
                        marginTop: '120px',	
                        padding: '4rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        borderRadius: 12,
                        textAlign: 'center',
                        color: 'white',
                        maxWidth: '900px',
                        
                        boxShadow: '0 6px 18px rgba(0, 0, 0, 0.25)',
                    }}
                >
                    <Title level={2} style={{ color: 'white' }}>Make a Difference Today</Title>
                    <Paragraph style={{ fontSize: '1.4rem', color: 'lightgreen', marginBottom: '2rem' }}>
                        Join our community and support fellow students in need. Every contribution makes a difference in
                        building a supportive and thriving environment for all.
                    </Paragraph>
                    <Button
                        type="primary"
                        style={{
                            backgroundColor: 'maroon',
                            borderColor: 'maroon',
                            padding: '0.75rem 1.5rem',
                            fontSize: '1.1rem',
                        }}
                    >
                        <Link to="/signup">Get Started</Link>
                    </Button>
                </div>
            </Content>

            <Footer style={{ textAlign: 'center', backgroundColor: '#b5e487', padding: '24px' }}>
                KABU Student Welfare Management System ©2025 Team Project
            </Footer>
        </Layout>
    );
};

export default LandingPage;