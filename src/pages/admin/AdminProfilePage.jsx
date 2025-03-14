import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout'; // Adjust path if needed
import {
    Typography,
    Form,
    Input,
    Button,
    Avatar,
    Spin,
    Alert,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const AdminProfilePage = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
    const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(null);
    const [passwordChangeError, setPasswordChangeError] = useState(null);
    const [form] = Form.useForm();

    // Fetch Admin profile data on component mount (Placeholder - replace with your API endpoint)
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                // Replace 'http://localhost:5000/api/admin/profile' with your actual API endpoint to get admin profile
                const response = await fetch('http://localhost:5000/api/admin/profile');
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

        fetchProfile();
    }, []);

    const onFinish = async (values) => {
        setPasswordChangeLoading(true);
        setPasswordChangeError(null);
        setPasswordChangeSuccess(null);
        try {
            // Simulate API call for password change - replace with your actual API endpoint
            // Replace 'http://localhost:5000/api/admin/change-password' with your actual API endpoint to change password
            const response = await fetch('http://localhost:5000/api/admin/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values), // Send currentPassword and newPassword
            });

            if (!response.ok) {
                const errorData = await response.json(); // Or response.text() if not JSON
                throw new Error(errorData.message || `Password change failed: HTTP status ${response.status}`);
            }

            setPasswordChangeSuccess('Password changed successfully!');
            form.resetFields(); // Clear password fields after success

        } catch (e) {
            setPasswordChangeError(e.message);
        } finally {
            setPasswordChangeLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        setPasswordChangeError('Password change form submission failed. Please check the fields.');
    };


    return (
        <AdminLayout>
            <div style={{ padding: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Title level={2} style={{ color: 'maroon' }}>
                        Admin Profile
                    </Title>
                    <Paragraph>
                        View and manage your profile information and security settings.
                    </Paragraph>
                </div>

                {loading && <Spin tip="Loading Profile..." style={{ display: 'block', marginBottom: 24 }} />}
                {error && <Alert message={`Error fetching profile: ${error}`} type="error" closable onClose={() => setError(null)} style={{ marginBottom: 24 }} />}

                {profileData && !loading && !error && (
                    <div style={{ maxWidth: 600, margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <Avatar size={100} icon={<UserOutlined />} src={profileData.profilePicture} /> {/* Display profile picture if available */}
                            <Title level={4} style={{ marginTop: 16, color: 'maroon' }}>{profileData.fullName || profileData.name || 'Admin User'}</Title> {/* Adjust data keys */}
                            <Paragraph>{profileData.email}</Paragraph> {/* Adjust data keys */}
                            <Paragraph>Role: Administrator</Paragraph>
                            {/* Display other relevant profile information */}
                        </div>

                        <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: 24, marginBottom: 24 }}>
                            <Title level={4} style={{ color: 'maroon' }}>Change Password</Title>
                            <Paragraph>Secure your account by updating your password regularly.</Paragraph>

                            <Form
                                form={form}
                                layout="vertical"
                                name="changePasswordForm"
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                initialValues={{ remember: true }}
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
                                        { min: 6, message: 'Password must be at least 6 characters long.' }, // Example validation
                                    ]}
                                >
                                    <Input.Password placeholder="New Password" />
                                </Form.Item>

                                <Form.Item
                                    label={<Text strong>Confirm New Password</Text>}
                                    name="confirmPassword"
                                    dependencies={['newPassword']}
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

                            {passwordChangeSuccess && <Alert message={passwordChangeSuccess} type="success" showIcon style={{ marginTop: 16 }} />}
                            {passwordChangeError && <Alert message={`Password change error: ${passwordChangeError}`} type="error" showIcon style={{ marginTop: 16 }} />}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminProfilePage;