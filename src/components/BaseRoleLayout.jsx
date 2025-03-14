import React, { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Avatar, theme } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { MenuOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons';
import logo from '../assets/Kabarak_University_Extended_logo_910x256.png';

const { Header, Content, Footer } = Layout;

const BaseRoleLayout = ({
    children,
    roleConfig: {
        menuItems,
        apiEndpoint,
        showUserProfile = true
    }
}) => {
    const [user, setUser] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const location = useLocation();
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

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
                const response = await fetch(apiEndpoint);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        if (apiEndpoint) fetchUser();
    }, [apiEndpoint]);

    const getSelectedKeys = () => [location.pathname];

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

                {/* User Profile (Always Visible) */}
                {showUserProfile && user && (
                    <div style={{ display: 'flex', alignItems: 'center', color: 'white', marginLeft: 'auto' }}>
                        <Avatar
                            src={user.profilePicture} // Ensure this is populated
                            size="large"
                            icon={<UserOutlined />}
                            style={{ marginRight: 8 }}
                        />
                        <span>{user.name}</span>
                    </div>
                )}

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