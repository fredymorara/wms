// src/layout/MemberLayout.jsx
import React from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import {
    UserOutlined,
    DashboardFilled,
    ShareAltOutlined,
    MessageOutlined,
    FundOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const MemberLayout = ({ children }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const location = useLocation();

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

    const newItems = [
        {
            title: "Home"
        },
        {
            title: "Member"
        },
        {
            title: "Content"
        },
    ]
    return (
        <Layout>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div className="demo-logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={"here"}
                    items={items}
                    className='text-blue-500'
                    style={{
                        flex: 1,
                        minWidth: 0,
                    }}
                />
            </Header>
            <Content
                style={{
                    padding: '0 48px',
                }}
            >
                <Breadcrumb
                    items={newItems}
                    style={{
                        margin: '16px 0',
                    }}
                />
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
        </Layout>
    );
};
export default MemberLayout;