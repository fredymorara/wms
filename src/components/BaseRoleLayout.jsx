import React, { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Avatar, Button, Drawer } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { MenuOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import logoSquare from '../assets/kabu-logo-Beveled-shadow.png';
import logoExtended from '../assets/Kabarak_University_Extended_logo_910x256.png';
import { getAdminProfile, getMemberProfile } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const { Header, Content, Footer, Sider } = Layout;

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
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const { logout } = useAuth();

    // Responsive view handling
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobileView(mobile);
            if (!mobile) setIsMobileMenuOpen(false);
        };
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
            { type: 'divider' },
            {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Log Out',
                danger: true,
                onClick: handleLogout,
            },
        ],
    };

    // Filter out profile from main menu to avoid duplicates in sidebar
    const sidebarMenuItems = menuItems.filter(item => item.key !== '/admin/profile' && item.key !== '/member/profile');

    // Dynamically derive page title from current menu item
    const currentMenu = sidebarMenuItems.find(m => m.key === location.pathname);
    const pageTitle = currentMenu?.label?.props?.children || currentMenu?.label || 'Dashboard';

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white">
            <div className={`flex items-center justify-center p-4 ${collapsed && !isMobileView ? 'py-6' : 'py-6'}`}>
                <img
                    src={collapsed && !isMobileView ? logoSquare : logoExtended}
                    alt="Kabarak Logo"
                    className={`${collapsed && !isMobileView ? 'w-10 h-10 object-contain' : 'h-10 object-contain'}`}
                />
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <Menu
                    theme="light"
                    mode="inline"
                    selectedKeys={getSelectedKeys()}
                    items={sidebarMenuItems}
                    style={{ borderRight: 0 }}
                    className="mt-2"
                />
            </div>
            <div className="p-4 border-t border-zinc-100">
                <Button 
                    type="text" 
                    danger 
                    block={!collapsed || isMobileView}
                    icon={<LogoutOutlined />} 
                    onClick={handleLogout}
                    className="flex items-center justify-center rounded-xl hover:bg-red-50"
                >
                    {(!collapsed || isMobileView) && "Log Out"}
                </Button>
            </div>
        </div>
    );

    return (
        <Layout className="min-h-screen bg-zinc-50 flex flex-row">
            {/* Desktop Sidebar */}
            {!isMobileView && (
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                    theme="light"
                    width={260}
                    className="border-r border-zinc-200 hidden md:block shadow-sm z-20"
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'sticky',
                        top: 0,
                        left: 0,
                        backgroundColor: '#ffffff'
                    }}
                >
                    <SidebarContent />
                </Sider>
            )}

            {/* Mobile Drawer Sidebar */}
            <Drawer
                title={<img src={logoExtended} alt="Logo" className="h-8 object-contain" />}
                placement="left"
                onClose={() => setIsMobileMenuOpen(false)}
                open={isMobileView && isMobileMenuOpen}
                width={280}
                styles={{ body: { padding: 0 } }}
                className="md:hidden"
            >
                <div className="flex flex-col h-full bg-white">
                    <div className="flex-1 overflow-y-auto pt-2">
                        <Menu
                            theme="light"
                            mode="inline"
                            selectedKeys={getSelectedKeys()}
                            items={sidebarMenuItems}
                            style={{ borderRight: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                    </div>
                    <div className="p-4 border-t border-zinc-100">
                        <Button block danger icon={<LogoutOutlined />} onClick={handleLogout} className="rounded-xl h-10 hover:bg-red-50">
                            Log Out
                        </Button>
                    </div>
                </div>
            </Drawer>

            <Layout className="flex flex-col min-h-screen transition-all duration-300 w-full bg-zinc-50">
                {/* Header */}
                <Header className="bg-white/80 backdrop-blur-md border-b border-zinc-200 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center">
                        {isMobileView && (
                            <Button
                                type="text"
                                icon={<MenuOutlined className="text-xl text-zinc-700" />}
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="mr-3 sm:mr-4 px-0 hover:bg-zinc-100"
                            />
                        )}
                        <h1 className="text-lg sm:text-xl font-semibold text-zinc-800 m-0">
                            {pageTitle}
                        </h1>
                    </div>

                    {/* User Profile */}
                    <div className="flex items-center">
                        <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
                            <div className="flex items-center cursor-pointer hover:bg-zinc-100 px-2 sm:px-3 py-1.5 rounded-full transition-colors border border-transparent hover:border-zinc-200">
                                <Avatar
                                    size="small"
                                    src={user?.profilePicture}
                                    icon={<UserOutlined />}
                                    className="bg-[#800000]"
                                />
                                <span className="ml-2 text-sm font-medium text-zinc-700 hidden sm:block">
                                    {user?.fullName || 'User'}
                                </span>
                            </div>
                        </Dropdown>
                    </div>
                </Header>

                {/* Content */}
                <Content className="p-4 sm:p-6 md:p-8 flex-1 max-w-[1600px] w-full mx-auto">
                    <div className="bg-transparent rounded-xl min-h-[360px]">
                        {children}
                    </div>
                </Content>

                {/* Footer */}
                <Footer className="text-center text-sm py-6 bg-transparent text-zinc-500">
                    <p className="font-medium text-zinc-600 mb-1">Kabarak Student Welfare Management System ©2025</p>
                    <p className="text-xs">Support. Connect. Thrive.</p>
                </Footer>
            </Layout>
        </Layout>
    );
};

export default BaseRoleLayout;