import React from 'react';
import PrivateRoute from './components/PrivateRoute.jsx';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
//default
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
//admin
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import CampaignManagementPage from './pages/admin/CampaignManagement.jsx';
import FundManagementPage from './pages/admin/FundManagement.jsx';
import ReportsPage from './pages/admin/ReportsPage.jsx';
import AdminProfilePage from './pages/admin/AdminProfilePage.jsx';
//member
import ProfileSettingsPage from './pages/member/ProfileSettingsPage.jsx';
import CampaignsPage from './pages/member/CampaignsPage.jsx';
import HelpPage from './pages/member/HelpPage.jsx';
import ContributionHistoryPage from './pages/member/ContributionHistoryPage.jsx';
import MemberDashboardPage from './pages/member/MemberDashboardPage.jsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/*Protected Routes*/}
        <Route element={<PrivateRoute allowedRoles={['member']} />} >
          {/*Member Section */}
          <Route path="/member/dashboard" element={<MemberDashboardPage />} />
          <Route path="/member/history" element={<ContributionHistoryPage />} />
          <Route path="/member/profile" element={<ProfileSettingsPage />} />
          <Route path="/member/campaigns" element={<CampaignsPage />} />
          <Route path="/member/help" element={<HelpPage />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={['admin']} />} >
          {/*Admin Section */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/campaigns" element={<CampaignManagementPage />} />
          <Route path="/admin/funds" element={<FundManagementPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/profile" element={<AdminProfilePage />} />
          {/*Default */}
        </Route>

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter >
  );
}
export default App;