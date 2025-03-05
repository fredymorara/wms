// src/layout/TreasurerLayout.jsx
import React, { useState } from 'react';
import {
  AccountBookOutlined,
  AreaChartOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Typography } from 'antd'; // Import Typography
import { Link, useLocation } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography; // Destructure Title from Typography

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const TreasurerLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();

  const items = [
    getItem('Reports', 'sub1', <FileTextOutlined />, [
      getItem('Transaction Report', '/treasurer/report'),
    ]),
    getItem('Financial', 'sub2', <AccountBookOutlined />, [
      getItem('Financial Report', '/treasurer/financialReport'),
    ]),
    getItem('Disbursement', 'sub3', <AreaChartOutlined />, [
      getItem('Disbursement Management', '/treasurer/disbursement-management'),
      getItem('Disbursement Details', '/treasurer/disbursement-details'),
    ]),
  ];

  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path === '/treasurer/report') return ['/treasurer/report'];
    if (path === '/treasurer/financialReport') return ['/treasurer/financialReport'];
    if (path === '/treasurer/disbursement-management') return ['/treasurer/disbursement-management'];
    if (path === '/treasurer/disbursement-details') return ['/treasurer/disbursement-details'];
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
            padding: '0 24px', // Add some padding
            background: colorBgContainer,
            display: 'flex', // Use flexbox
            alignItems: 'center', // Align items vertically
          }}
        >
          <Title level={3} style={{ color: 'black', margin: 0 }}>Treasurer Portal</Title> {/* Add the title */}
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
            <Breadcrumb.Item>Treasurer</Breadcrumb.Item>
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
          Treasurer Panel ©{new Date().getFullYear()} Created by Your Team
        </Footer>
      </Layout>
    </Layout>
  );
};

export default TreasurerLayout;