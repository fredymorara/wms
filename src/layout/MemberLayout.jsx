import React from 'react';
import {
    UserOutlined,
    DashboardFilled,
    ShareAltOutlined,
    MessageOutlined,
    FundOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Avatar } from 'antd'; // Import Avatar
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../assets/kabu-logo-Beveled-shadow.png';

const { Header, Content, Footer } = Layout;

const MemberLayout = ({ children }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch user data from API
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/member/profile'); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Handle error appropriately
            }
        };

        fetchUser();
    }, []);


    const items = [
        {
            label: <Link to="/member/dashboard">Dashboard</Link>,
            key: '/member/dashboard',
            icon: <DashboardFilled />,
        },
        {
            label: <Link to="/member/campaigns">Campaigns</Link>,
            key: '/member/campaigns',
            icon: <FundOutlined />,
        },
        {
            label: <Link to="/member/history">Contribution History</Link>,
            key: '/member/history',
            icon: <ShareAltOutlined />,
        },
        {
            label: <Link to="/member/profile">Profile</Link>,
            key: '/member/profile',
            icon: <UserOutlined />,
        },
        {
            label: <Link to="/member/help">Help</Link>,
            key: '/member/help',
            icon: <MessageOutlined />,
        },
    ];

    const getSelectedKeys = () => {
        const path = location.pathname;
        return [path];
    };

    return (
        <Layout
            style={{
                background: 'linear-gradient(to bottom, #F8E8EC 70%, #d9f7be)',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'maroon',
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
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={getSelectedKeys()}
                    items={items}
                    style={{
                        flex: 1,
                        minWidth: 0,
                        background: 'maroon',
                    }}
                    itemSelectedStyle={{ backgroundColor: '#e6fffb' }}
                />
                {user && (
                    <div style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                        <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8 }} />
                        <span>{user.name}</span> {/* Display user's name */}
                    </div>
                )}
            </Header>
            <Content
                style={{
                    padding: '0 48px',
                    flex: 1,
                }}
            >
                
                <Breadcrumb
                    style={{
                        margin: '16px 0',
                    }}
                >
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Member</Breadcrumb.Item>
                    <Breadcrumb.Item>Content</Breadcrumb.Item>
                </Breadcrumb>
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 280,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </div>
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                    fontSize: '1.3em',
                    backgroundColor: '#92c282',
                }}
            >
                KABU Student Welfare Management System ©2025 Team Project.
            </Footer>
        </Layout>
    );
};

export default MemberLayout;