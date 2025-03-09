import React from 'react';
import {
    FileTextOutlined,
    AccountBookOutlined,
    AreaChartOutlined
} from '@ant-design/icons';
import BaseRoleLayout from '../components/BaseRoleLayout';

const TreasurerLayout = ({ children }) => {
    const menuItems = [
        { label: <Link to="/treasurer/report">Transaction Report</Link>, key: '/treasurer/report', icon: <FileTextOutlined /> },
        { label: <Link to="/treasurer/financialReport">Financial Report</Link>, key: '/treasurer/financialReport', icon: <AccountBookOutlined /> },
        { label: <Link to="/treasurer/disbursement-management">Disbursement Management</Link>, key: '/treasurer/disbursement-management', icon: <AreaChartOutlined /> },
        { label: <Link to="/treasurer/disbursement-details">Disbursement Details</Link>, key: '/treasurer/disbursement-details', icon: <AreaChartOutlined /> },
    ];

    return (
        <BaseRoleLayout
            roleConfig={{
                menuItems,
                portalTitle: 'Kabarak Student Welfare Treasurer Portal',
                breadcrumbItems: ['Home', 'Treasurer', 'Content'],
                apiEndpoint: '/api/treasurer/profile'
            }}
        >
            {children}
        </BaseRoleLayout>
    );
};

export default TreasurerLayout;