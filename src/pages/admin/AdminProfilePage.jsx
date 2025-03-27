// src/pages/admin/AdminProfilePage.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import {
    Typography, Form, Input, Button, Avatar, Spin, Alert, message
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { API_URL } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth
import { changeAdminPassword } from '../../services/api'; // Import the specific API function

const { Title, Paragraph, Text } = Typography;

const AdminProfilePage = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
    const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(null);
    const [passwordChangeError, setPasswordChangeError] = useState(null);
    const [form] = Form.useForm();
    const { user, token, isLoading } = useAuth(); // Get token from AuthContext

    const getAuthHeaders = () => ({ // Keep this helper if used elsewhere, otherwise use token directly
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    });

    useEffect(() => {
        const fetchProfile = async () => {
            // --- ADD LOG ---
            console.log('AdminProfilePage useEffect - isLoading:', isLoading, 'token:', token);
            if (isLoading) {
                console.log('AdminProfilePage useEffect - Still loading auth, skipping fetch.');
                setLoading(false); // Prevent showing component loading spinner if auth is loading
                return;
            }
            if (!token) {
                console.error('AdminProfilePage useEffect - No token found, cannot fetch profile.');
                setLoading(false);
                setError("Authentication token not found. Please log in again.");
                return; // Exit if no token
            }
            // --- END ADD LOG ---
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/admin/profile`, {
                    headers: getAuthHeaders()
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProfileData(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) { // Ensure token exists before fetching
            fetchProfile();
        } else {
            setLoading(false);
            setError("Authentication token not found.");
        } fetchProfile();
    }, [token, isLoading]); // Add token dependency

    // --- UPDATE THIS FUNCTION ---
    const onFinish = async (values) => {
        // --- ADD LOG ---
        console.log('AdminProfilePage onFinish - token:', token);
        if (!token) {
            message.error('Authentication error. Please log in again.');
            setPasswordChangeError('Authentication error. Please log in again.'); // Also set state error
            return; // Prevent API call if no token
        }
        if (isLoading) {
            message.error('Authentication still loading. Please wait and try again.');
            return; // Prevent API call if auth is loading
        }
        // --- END ADD LOG ---
        setPasswordChangeLoading(true);
        setPasswordChangeError(null);
        setPasswordChangeSuccess(null);
        try {
            // Use the imported API function
            const response = await changeAdminPassword(
                {
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword,
                },
                token // Pass the token
            );

            setPasswordChangeSuccess(response.message);
            form.resetFields(['currentPassword', 'newPassword', 'confirmPassword']); // Reset password fields
            message.success(response.message);

        } catch (e) {
            const errorMsg = e.message || 'An unexpected error occurred.';
            setPasswordChangeError(errorMsg);
            message.error(`Password change error: ${errorMsg}`);
        } finally {
            setPasswordChangeLoading(false);
        }
    };
    // --- END OF UPDATE ---

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        // Removed setPasswordChangeError here, Ant Design validation handles field errors
        message.error('Password change form has errors. Please check the fields.');
    };

    return (
        <AdminLayout>
            <div style={{ padding: '24px' }}>
                {/* ... Header and Profile View ... */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Title level={2} style={{ color: 'maroon' }}>
                        Admin Profile
                    </Title>
                    <Paragraph>
                        View and manage your profile information and security settings.
                    </Paragraph>
                </div>

                {loading && <Spin tip="Loading Profile..." style={{ display: 'block', marginBottom: 24 }} />}
                {error && !loading && <Alert message={`Error fetching profile: ${error}`} type="error" closable onClose={() => setError(null)} style={{ marginBottom: 24 }} />}

                {profileData && !loading && !error && (
                    <div style={{ maxWidth: 600, margin: '0 auto' }}>
                        {/* ... Profile Avatar and Details ... */}
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <Avatar size={100} icon={<UserOutlined />} src={profileData.profilePicture} />
                            <Title level={4} style={{ marginTop: 16, color: 'maroon' }}>{profileData.fullName || 'Admin User'}</Title>
                            <Paragraph>{profileData.email}</Paragraph>
                            <Paragraph>Role: Administrator</Paragraph>
                        </div>


                        <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: 24, marginBottom: 24 }}>
                            <Title level={4} style={{ color: 'maroon' }}>Change Password</Title>
                            <Paragraph>Secure your account by updating your password regularly.</Paragraph>

                            {/* --- Ensure form name matches --- */}
                            <Form
                                form={form}
                                layout="vertical"
                                name="adminChangePasswordForm" // Unique name for the form
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                            >
                                <Form.Item
                                    label={<Text strong>Current Password</Text>}
                                    name="currentPassword"
                                    rules={[{ required: true, message: 'Please enter your current password.' }]}
                                >
                                    <Input.Password placeholder="Current Password" />
                                </Form.Item>

                                <Form.Item
                                    label={<Text strong>New Password</Text>}
                                    name="newPassword"
                                    rules={[
                                        { required: true, message: 'Please enter a new password.' },
                                        { min: 8, message: 'Password must be at least 8 characters long.' },
                                        // Add more complex regex validation if desired
                                    ]}
                                >
                                    <Input.Password placeholder="New Password" />
                                </Form.Item>

                                <Form.Item
                                    label={<Text strong>Confirm New Password</Text>}
                                    name="confirmPassword"
                                    dependencies={['newPassword']}
                                    hasFeedback // Adds feedback icons
                                    rules={[
                                        { required: true, message: 'Please confirm your new password.' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('newPassword') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password placeholder="Confirm New Password" />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={passwordChangeLoading}
                                        style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}
                                    >
                                        Change Password
                                    </Button>
                                </Form.Item>
                            </Form>
                            {/* --- Display feedback messages --- */}
                            {passwordChangeSuccess && <Alert message={passwordChangeSuccess} type="success" showIcon style={{ marginTop: 16 }} closable onClose={() => setPasswordChangeSuccess(null)} />}
                            {passwordChangeError && <Alert message={`${passwordChangeError}`} type="error" showIcon style={{ marginTop: 16 }} closable onClose={() => setPasswordChangeError(null)} />}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminProfilePage;