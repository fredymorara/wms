import React from 'react';
import {
    DashboardFilled,
    PlusCircleOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import BaseRoleLayout from '../components/BaseRoleLayout';

const SecretaryLayout = ({ children }) => {
    const menuItems = [
        { label: <Link to="/secretary/dashboard">Dashboard</Link>, key: '/secretary/dashboard', icon: <DashboardFilled /> },
        { label: <Link to="/secretary/campaign-requests">Campaign Requests</Link>, key: '/secretary/campaign-requests', icon: <PlusCircleOutlined /> },
        { label: <Link to="/secretary/campaign-management">Campaign Management</Link>, key: '/secretary/campaign-management', icon: <PlusCircleOutlined /> },
        { label: <Link to="/secretary/reports">Reports</Link>, key: '/secretary/reports', icon: <FileTextOutlined /> },
    ];

    return (
        <BaseRoleLayout
            roleConfig={{
                menuItems,
                portalTitle: 'Kabarak Student Welfare Secretary Portal',
                breadcrumbItems: ['Home', 'Secretary', 'Content'],
                apiEndpoint: '/api/secretary/profile'
            }}
        >
            {children}
        </BaseRoleLayout>
    );
};

export default SecretaryLayout;