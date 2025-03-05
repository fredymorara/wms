import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProfileSettingsPage from './pages/member/ProfileSettingsPage.jsx';
import CampaignsPage from './pages/member/CampaignsPage.jsx';
import HelpPage from './pages/member/HelpPage.jsx';
import ContributionHistoryPage from './pages/member/ContributionHistoryPage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import CreateUser from './pages/admin/CreateUser.jsx';
import CampaignApprovalQueuePage from './pages/admin/CampaignApprovalQueuePage.jsx';
import TransactionReport from './pages/treasurer/TransactionReport.jsx';
import DisbursementManagementPage from './pages/treasurer/DisbursementManagementPage.jsx';
import MemberDashboardPage from './pages/member/MemberDashboardPage.jsx';
import CampaignRequestPage from './pages/secretary/CampaignRequestPage.jsx';
import UserListPage from "./pages/admin/UserListPage.jsx"
import StudentApplicationReviewPage from "./pages/admin/StudentApplicationReviewPage.jsx"
import FinancialReportPage from "./pages/treasurer/FinancialReportPage.jsx"
import CreateCampaignPage from "./pages/secretary/CreateCampaignPage.jsx"
import FinancialOverviewPage from "./pages/treasurer/FinancialOverviewPage.jsx"
import DisbursementDetailsPage from "./pages/treasurer/DisbursementDetailsPage.jsx"
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
                <Route path="/admin/createUser" element={<AdminLayout><CreateUser /></AdminLayout>} />
                <Route path="/admin/listUser" element={<AdminLayout><UserListPage /></AdminLayout>} />
                <Route path="/admin/studentApplication" element={<AdminLayout><StudentApplicationReviewPage /></AdminLayout>} />
                <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
                <Route path="/admin/campaign-approval" element={<AdminLayout><CampaignApprovalQueuePage /></AdminLayout>} />
              {/*Treasurer Section */}
                <Route path="/treasurer/report" element={<TreasurerLayout><TransactionReport /></TreasurerLayout>} />
                <Route path="/treasurer/financialReport" element={<TreasurerLayout><FinancialReportPage /></TreasurerLayout>} />
                <Route path="/treasurer/disbursement-management" element={<TreasurerLayout><DisbursementManagementPage /></TreasurerLayout>} />
                <Route path="/treasurer/disbursement-details" element={<TreasurerLayout><DisbursementDetailsPage /></TreasurerLayout>} />
              {/*Secretary Section */}
                <Route path="/secretary/campaign-requests" element={<SecretaryLayout><CampaignRequestPage /></SecretaryLayout>} />
                <Route path="/secretary/create-campaign" element={<SecretaryLayout><CreateCampaignPage /></SecretaryLayout>} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
}
export default App;