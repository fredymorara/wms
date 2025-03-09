import React from 'react';
import {
    DashboardFilled,
    UserOutlined,
    CloudOutlined,
    BarChartOutlined
} from '@ant-design/icons';
import BaseRoleLayout from '../components/BaseRoleLayout';

const AdminLayout = ({ children }) => {
    const menuItems = [
        { label: <Link to="/admin/dashboard">Dashboard</Link>, key: '/admin/dashboard', icon: <DashboardFilled /> },
        { label: <Link to="/admin/user-management">User Management</Link>, key: '/admin/user-management', icon: <UserOutlined /> },
        { label: <Link to="/admin/campaign-approval">Campaign Approval</Link>, key: '/admin/campaign-approval', icon: <CloudOutlined /> },
        { label: <Link to="/admin/fund-management">Fund Management</Link>, key: '/admin/fund-management', icon: <BarChartOutlined /> },
    ];

    return (
        <BaseRoleLayout
            roleConfig={{
                menuItems,
                portalTitle: 'Kabarak Student Welfare Admin Portal',
                breadcrumbItems: ['Home', 'Admin', 'Content'],
                apiEndpoint: '/api/admin/profile'
            }}
        >
            {children}
        </BaseRoleLayout>
    );
};

export default AdminLayout;