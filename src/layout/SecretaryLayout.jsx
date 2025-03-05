// src/layout/SecretaryLayout.jsx
import React, { useState } from 'react';
import {
    FileTextOutlined,
    PlusCircleOutlined,
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

const SecretaryLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const location = useLocation();

    const items = [
        getItem('Campaign Requests', '/secretary/campaign-requests', <FileTextOutlined />),
        getItem('Create Campaign', '/secretary/create-campaign', <PlusCircleOutlined />),
    ];

    const getSelectedKeys = () => {
        const path = location.pathname;
        if (path === '/secretary/campaign-requests') return ['/secretary/campaign-requests'];
        if (path === '/secretary/create-campaign') return ['/secretary/create-campaign'];
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
                    <Title level={3} style={{ color: 'black', margin: 0 }}>Secretary Portal</Title>
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
                        <Breadcrumb.Item>Secretary</Breadcrumb.Item>
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
                    Secretary Panel ©{new Date().getFullYear()} Created by Your Team
                </Footer>
            </Layout>
        </Layout>
    );
};

export default SecretaryLayout;