import React from 'react';
import {
    DashboardFilled,
    FundOutlined,
    BarChartOutlined,
    FileTextOutlined,
    UserOutlined, // For Profile Icon
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import BaseRoleLayout from '../components/BaseRoleLayout'; // Assuming BaseRoleLayout is in the components directory

const AdminLayout = ({ children }) => {
    const menuItems = [
        { label: <Link to="/admin/dashboard">Dashboard</Link>, key: '/admin/dashboard', icon: <DashboardFilled /> },
        { label: <Link to="/admin/campaigns">Campaign Management</Link>, key: '/admin/campaigns', icon: <BarChartOutlined /> },
        { label: <Link to="/admin/funds">Funds Management</Link>, key: '/admin/funds', icon: <FundOutlined /> }, // Reusing FundOutlined for Funds Management for now
        { label: <Link to="/admin/reports">Reports</Link>, key: '/admin/reports', icon: <FileTextOutlined /> },
        { label: <Link to="/admin/profile">Profile</Link>, key: '/admin/profile', icon: <UserOutlined /> }, // Admin Profile Item
    ];

    return (
        <BaseRoleLayout
            roleConfig={{
                menuItems,
                apiEndpointPath: '/admin/profile', // Endpoint to fetch Admin profile data
                showUserProfile: true // Decide if you want to show user profile in Admin layout too
            }}
        >
            {children}
        </BaseRoleLayout>
    );
};

export default AdminLayout;