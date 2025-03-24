// App.js
import React from 'react';
import PrivateRoute from './components/PrivateRoute.jsx';
import { Routes, Route } from 'react-router-dom'; // Remove BrowserRouter import
// Default pages
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import VerificationPage from './pages/VerificationPage.jsx';
// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import CampaignManagementPage from './pages/admin/CampaignManagement.jsx';
import FundManagementPage from './pages/admin/FundManagement.jsx';
import ReportsPage from './pages/admin/ReportsPage.jsx';
import AdminProfilePage from './pages/admin/AdminProfilePage.jsx';
// Member pages
import ProfileSettingsPage from './pages/member/ProfileSettingsPage.jsx';
import CampaignsPage from './pages/member/CampaignsPage.jsx';
import HelpPage from './pages/member/HelpPage.jsx';
import ContributionHistoryPage from './pages/member/ContributionHistoryPage.jsx';
import MemberDashboardPage from './pages/member/MemberDashboardPage.jsx';

function App() {
  return (
    // Remove the Router wrapping here - it's already in index.js
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/auth/verify-email/:token" element={<VerificationPage />} /> {/* Verification Page Route */}
      
      {/* Protected Routes */}
      <Route element={<PrivateRoute allowedRoles={['member']} />}>
        {/* Member Section */}
        <Route path="/member/dashboard" element={<MemberDashboardPage />} />
        <Route path="/member/history" element={<ContributionHistoryPage />} />
        <Route path="/member/profile" element={<ProfileSettingsPage />} />
        <Route path="/member/campaigns" element={<CampaignsPage />} />
        <Route path="/member/help" element={<HelpPage />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
        {/* Admin Section */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/campaigns" element={<CampaignManagementPage />} />
        <Route path="/admin/funds" element={<FundManagementPage />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    // No closing Router tag here anymore
  );
}

export default App;