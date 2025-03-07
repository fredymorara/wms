import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
//default
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
//admin
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import CampaignApprovalPage from './pages/admin/CampaignApproval.jsx';
import FundManagementPage from './pages/admin/FundManagement.jsx';
import UserManagementPage from './pages/admin/UserManagement.jsx';
//member
import ProfileSettingsPage from './pages/member/ProfileSettingsPage.jsx';
import CampaignsPage from './pages/member/CampaignsPage.jsx';
import HelpPage from './pages/member/HelpPage.jsx';
import ContributionHistoryPage from './pages/member/ContributionHistoryPage.jsx';
import MemberDashboardPage from './pages/member/MemberDashboardPage.jsx';
//secretary
import SecretaryDashboardPage from './pages/secretary/SecretaryDashboardPage.jsx';
import CampaignManagementPage from './pages/secretary/CampaignManagement.jsx';
import CampaignRequestsPage from './pages/secretary/CampaignRequests.jsx';
import ReportsAndDocumentationPage from './pages/secretary/ReportsAndDocumentation.jsx';
//treasurer
import TreasurerDashboardPage from './pages/treasurer/TreasurerDashboard.jsx';
import TransactionManagementPage from './pages/treasurer/TransactionManagement.jsx';
import DisbursementManagementPage from './pages/treasurer/DisbursementManagement.jsx';
//layout
import AdminLayout from './layout/AdminLayout.jsx'; // Import AdminLayout
import MemberLayout from './layout/MemberLayout.jsx'; // Import MemberLayout
import SecretaryLayout from './layout/SecretaryLayout.jsx'; // Import SecretaryLayout
import TreasurerLayout from './layout/TreasurerLayout.jsx'; // Import TreasurerLayout
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
              {/*Member Section */}
                <Route path="/member/dashboard" element={<MemberLayout><MemberDashboardPage /></MemberLayout>} />
                <Route path="/member/history" element={<MemberLayout><ContributionHistoryPage /></MemberLayout>} />
                <Route path="/member/profile" element={<MemberLayout><ProfileSettingsPage /></MemberLayout>} />
                <Route path="/member/campaigns" element={<MemberLayout><CampaignsPage /></MemberLayout>} />
                <Route path="/member/help" element={<MemberLayout><HelpPage /></MemberLayout>} />
                {/*Admin Section */}
                <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
                <Route path="/admin/user-management" element={<AdminLayout><UserManagementPage /></AdminLayout>} />
                <Route path="/admin/campaign-approval" element={<AdminLayout><CampaignApprovalPage /></AdminLayout>} />
                <Route path="/admin/fund-management" element={<AdminLayout><FundManagementPage /></AdminLayout>} />
                {/*Treasurer Section */}
                <Route path='/treasurer/dashboard' element={<TreasurerLayout><TreasurerDashboardPage /></TreasurerLayout>} />
                <Route path='/treasurer/transactions' element={<TreasurerLayout><TransactionManagementPage /></TreasurerLayout>} />
                <Route path='/treasurer/disbursement-management' element={<TreasurerLayout><DisbursementManagementPage /></TreasurerLayout>} />
              {/*Secretary Section */}
                <Route path="/secretary/dashboard" element={<SecretaryLayout><SecretaryDashboardPage /></SecretaryLayout>} />
                <Route path="/secretary/campaign-management" element={<SecretaryLayout><CampaignManagementPage /></SecretaryLayout>} />
                <Route path="/secretary/campaign-requests" element={<SecretaryLayout><CampaignRequestsPage /></SecretaryLayout>} />
                <Route path="/secretary/reports" element={<SecretaryLayout><ReportsAndDocumentationPage /></SecretaryLayout>} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
}
export default App;