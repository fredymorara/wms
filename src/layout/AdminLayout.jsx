// src/layout/AdminLayout.jsx
import React, { useState } from 'react';
import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    BarChartOutlined,
    CloudOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const AdminLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const location = useLocation();

    const items = [
        getItem('Dashboard', '/admin/dashboard', <UserOutlined />),
        getItem('Create User', '/admin/createUser', <VideoCameraOutlined />),
        getItem('List User', '/admin/listUser', <UploadOutlined />),
        getItem('Student Applications', '/admin/studentApplication', <BarChartOutlined />),
        getItem('Approve Campaign', '/admin/campaign-approval', <CloudOutlined />),
    ];

    const getSelectedKeys = () => {
        const path = location.pathname;
        if (path === '/admin/dashboard') return ['/admin/dashboard'];
        if (path === '/admin/createUser') return ['/admin/createUser'];
        if (path === '/admin/listUser') return ['/admin/listUser'];
        if (path === '/admin/studentApplication') return ['/admin/studentApplication'];
        if (path === '/admin/campaign-approval') return ['/admin/campaign-approval'];
        return [];
    };

    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" selectedKeys={getSelectedKeys()} mode="inline" items={items} />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: '0 24px',
                        background: colorBgContainer,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Title level={3} style={{ color: 'black', margin: 0 }}>Admin Portal</Title>
                </Header>
                <Content
                    style={{
                        margin: '0 16px',
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: '16px 0',
                        }}
                    >
                        <Breadcrumb.Item>Admin</Breadcrumb.Item>
                        <Breadcrumb.Item>Content</Breadcrumb.Item>
                    </Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {children}
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Admin Panel ©{new Date().getFullYear()} Created by Your Team
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;