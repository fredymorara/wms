import React, { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Avatar, theme, Button, Typography } from 'antd'; // Import Button and Typography
import { Link, useLocation } from 'react-router-dom';
import { MenuOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons';
import logo from '../assets/Kabarak_University_Extended_logo_910x256.png';
import { API_URL } from '../services/api'; // Import API_URL
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

const { Header, Content, Footer } = Layout;
const { Text } = Typography; // Destructure Text from Typography

const BaseRoleLayout = ({
    children,
    roleConfig: {
        menuItems,
        apiEndpointPath,
        showUserProfile = true
    }
}) => {
    const [user, setUser] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const location = useLocation();
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    const { logout } = useAuth(); // Get logout function from AuthContext

    // Responsive view handling
    useEffect(() => {
        const checkMobile = () => setIsMobileView(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // User data fetching
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const fullApiEndpoint = `${API_URL}${apiEndpointPath}
            `
                const token = localStorage.getItem('token')
                const response = await fetch(fullApiEndpoint, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        if (apiEndpointPath) fetchUser();
    }, [apiEndpointPath]);

    const getSelectedKeys = () => [location.pathname];

    const handleLogout = () => {
        logout(); // Call the logout function from AuthContext
    };

    return (
        <Layout style={{
            background: 'linear-gradient(to bottom, white 80%, #d9f7be 100%)',
            minHeight: '100vh',
            display: 'flex',
            paddingTop: '2px',
            flexDirection: 'column',
        }}>
            {/* Header Section */}
            <Header style={{
                display: 'flex',
                alignItems: 'center',
                background: 'white',
                padding: '0 24px',
                height: 64,
            }}>
                {/* Logo and KWS Title (Mobile) */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src={logo}
                        alt="Kabarak University Logo"
                        style={{ height: isMobileView ? '45px' : '60px', marginRight: isMobileView ? 8 : 40 }}
                    />
                    {isMobileView && (
                        <span style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>KWS</span>
                    )}
                </div>

                {/* Desktop Navigation Bar */}
                {!isMobileView && (
                    <Menu
                        theme="light"
                        mode="horizontal"
                        selectedKeys={getSelectedKeys()}
                        items={menuItems}
                        style={{
                            background: 'white',
                            borderBottom: 'none',
                            lineHeight: '64px',
                            flex: 1,
                            marginLeft: 24
                        }}
                    />
                )}

                {/* User Profile and Logout Button */}
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                    {showUserProfile && user && (
                        <div style={{ display: 'flex', alignItems: 'center', color: 'black', marginRight: 20 }}> {/* Adjusted color to black and added margin */}
                            <Avatar
                                src={user.profilePicture} // Ensure this is populated
                                size="large"
                                icon={<UserOutlined />}
                                style={{ marginRight: 8 }}
                            />
                            <Text strong>{user.fullName}</Text> {/* Display full name and use Text component */}
                        </div>
                    )}
                    <Button type="primary" danger onClick={handleLogout}>
                        Logout
                    </Button>
                </div>


                {/* Hamburger Menu Button (Mobile Only) */}
                {isMobileView && (
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'maroon',
                            fontSize: '24px',
                            cursor: 'pointer',
                            padding: 0,
                            marginLeft: 16
                        }}>
                        {isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
                    </button>
                )}
            </Header>

            {/* Mobile Menu */}
            {isMobileView && isMobileMenuOpen && (
                <div style={{
                    padding: '16px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1
                }}>
                    <Menu
                        theme="light"
                        mode="inline"
                        selectedKeys={getSelectedKeys()}
                        items={menuItems}
                    />
                </div>
            )}

            {/* Content Section */}
            <Content style={{
                padding: '0 24px',
                flex: 1,
                maxWidth: 1200,
                margin: '0 auto',
                width: '100%'
            }}>
                <div style={{
                    padding: 24,
                    minHeight: 360,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}>
                    {children}
                </div>
            </Content>

            {/* Footer Section */}
            <Footer style={{
                textAlign: 'center',
                fontSize: '1rem',
                backgroundColor: '#b5e487',
                padding: '24px 16px'
            }}>
                KABU Student Welfare Management System ©2025 Team Project.
            </Footer>
        </Layout>
    );
};

export default BaseRoleLayout;