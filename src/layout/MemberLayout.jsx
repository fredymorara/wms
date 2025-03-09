import React from 'react';
import {
    DashboardFilled,
    FundOutlined,
    ShareAltOutlined,
    UserOutlined,
    MessageOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import BaseRoleLayout from '../components/BaseRoleLayout';

const MemberLayout = ({ children }) => {
    const menuItems = [
        { label: <Link to="/member/dashboard">Dashboard</Link>, key: '/member/dashboard', icon: <DashboardFilled /> },
        { label: <Link to="/member/campaigns">Campaigns</Link>, key: '/member/campaigns', icon: <FundOutlined /> },
        { label: <Link to="/member/history">Contribution History</Link>, key: '/member/history', icon: <ShareAltOutlined /> },
        { label: <Link to="/member/profile">Profile</Link>, key: '/member/profile', icon: <UserOutlined /> },
        { label: <Link to="/member/help">Help</Link>, key: '/member/help', icon: <MessageOutlined /> },
    ];

    return (
        <BaseRoleLayout
            roleConfig={{
                menuItems,
                apiEndpoint: 'http://localhost:5000/api/member/profile' // Ensure this endpoint returns profilePicture
            }}
        >
            {children}
        </BaseRoleLayout>
    );
};

export default MemberLayout;