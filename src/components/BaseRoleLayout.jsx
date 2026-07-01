import React, { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Avatar, Button, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { MenuOutlined, CloseOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import logo from '../assets/Kabarak_University_Extended_logo_910x256.png';
import { getAdminProfile, getMemberProfile } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const BaseRoleLayout = ({
    children,
    roleConfig: {
        menuItems,
        apiEndpointPath
    }
}) => {
    const [user, setUser] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const location = useLocation();
    const { logout } = useAuth();

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
                const userData = apiEndpointPath.includes('admin') ? await getAdminProfile() : await getMemberProfile();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        if (apiEndpointPath) fetchUser();
    }, [apiEndpointPath]);

    const getSelectedKeys = () => [location.pathname];

    const handleLogout = () => {
        logout();
    };

    const userMenu = {
        items: [
            {
                key: 'profile',
                icon: <UserOutlined />,
                label: <Link to={location.pathname.startsWith('/admin') ? '/admin/profile' : '/member/profile'}>Profile Settings</Link>,
            },
            {
                type: 'divider',
            },
            {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Log Out',
                danger: true,
                onClick: handleLogout,
            },
        ],
    };

    return (
        <Layout className="min-h-screen flex flex-col bg-zinc-50">
            {/* Header Section */}
            <Header className="sticky top-0 z-50 flex items-center bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 h-16">
                {/* Logo and KWS Title (Mobile) */}
                <div className="flex items-center">
                    <img
                        src={logo}
                        alt="Kabarak University Logo"
                        className={`${isMobileView ? 'h-8 mr-2' : 'h-10 mr-10'}`}
                    />
                    {isMobileView && (
                        <span className="text-[#800000] text-xl font-bold">KWS</span>
                    )}
                </div>

                {/* Desktop Navigation Bar */}
                {!isMobileView && (
                    <Menu
                        theme="light"
                        mode="horizontal"
                        selectedKeys={getSelectedKeys()}
                        items={menuItems.filter(item => item.key !== '/admin/profile' && item.key !== '/member/profile')}
                        style={{
                            background: 'transparent',
                            borderBottom: 'none',
                            lineHeight: '64px',
                            flex: 1,
                            marginLeft: 24,
                        }}
                    />
                )}

                {/* User Profile and Logout Button */}
                {!isMobileView && (
                    <div className="flex items-center ml-auto">
                        <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
                            <div className="flex items-center cursor-pointer hover:bg-zinc-100 px-3 py-1 rounded-full transition-colors">
                                <Avatar 
                                    size="small" 
                                    src={user?.profilePicture} 
                                    icon={<UserOutlined />} 
                                    className="bg-[#800000]"
                                />
                                <span className="ml-2 text-sm font-medium text-zinc-700">
                                    {user?.fullName || 'User'}
                                </span>
                            </div>
                        </Dropdown>
                    </div>
                )}

                {/* Hamburger Menu Button (Mobile Only) */}
                {isMobileView && (
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="bg-transparent border-none text-[#800000] text-2xl cursor-pointer p-0 ml-auto"
                    >
                        {isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
                    </button>
                )}
            </Header>

            {/* Mobile Menu */}
            {isMobileView && isMobileMenuOpen && (
                <div className="p-4 sticky top-16 z-40 bg-white border-b border-zinc-200 shadow-sm">
                    <Menu
                        theme="light"
                        mode="inline"
                        selectedKeys={getSelectedKeys()}
                        items={menuItems}
                        className="border-none"
                    />
                    <div className="mt-4 pt-4 border-t border-zinc-100">
                        <Button block danger icon={<LogoutOutlined />} onClick={handleLogout}>
                            Log Out
                        </Button>
                    </div>
                </div>
            )}

            {/* Content Section */}
            <Content className="px-4 md:px-8 flex-1 max-w-7xl mx-auto w-full mt-8">
                <div className="min-h-[360px] pb-12 rounded-xl">
                    {children}
                </div>
            </Content>

            {/* Footer Section */}
            <Footer className="text-center text-sm py-6 bg-white border-t border-[#b5e487] text-zinc-600">
                <p className="font-medium text-[#800000]">Kabarak Student Welfare Management System ©2025</p>
                <p className="text-xs text-zinc-400 mt-1">Support. Connect. Thrive.</p>
            </Footer>
        </Layout>
    );
};

export default BaseRoleLayout;