import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert, Spin, Avatar, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, SaveOutlined } from '@ant-design/icons';
import AdminLayout from '../../layout/AdminLayout';
import MemberLayout from '../../layout/MemberLayout';
import { getAdminProfile, getMemberProfile, updateMemberProfile, changeAdminPassword, changeMemberPassword } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text, Paragraph } = Typography;

const ProfilePage = () => {
    const { user, isLoading: authLoading } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();

    const isAdmin = user?.role === 'admin';
    const LayoutComponent = isAdmin ? AdminLayout : MemberLayout;

    useEffect(() => {
        const fetchProfile = async () => {
            if (authLoading || !user) return;
            setLoading(true);
            setError(null);
            try {
                const data = isAdmin ? await getAdminProfile() : await getMemberProfile();
                setProfileData(data);
                form.setFieldsValue({ fullName: data.fullName, email: data.email, admissionNumber: data.admissionNumber });
            } catch (err) {
                setError(err.message || 'Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user, authLoading, isAdmin, form]);

    const handleProfileUpdate = async (values) => {
        setSaving(true);
        setError(null);
        setSuccessMessage(null);
        try {
            if (!isAdmin && values.fullName !== profileData.fullName) {
                await updateMemberProfile(values.fullName);
                setProfileData(prev => ({ ...prev, fullName: values.fullName }));
                message.success('Profile updated successfully!');
            } else if (isAdmin) {
                // Assuming admin profile update endpoint if needed, else ignore
                message.info('Admin profile details are fixed.');
            }
        } catch (err) {
            message.error(err.message || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (values) => {
        setSaving(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const payload = {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword
            };
            const res = isAdmin ? await changeAdminPassword(payload) : await changeMemberPassword(payload);
            message.success(res.message || 'Password changed successfully!');
            passwordForm.resetFields();
        } catch (err) {
            setError(err.message || 'Failed to change password.');
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || loading) {
        return (
            <LayoutComponent>
                <div className="flex justify-center items-center h-64">
                    <Spin size="large" tip="Loading Profile..." />
                </div>
            </LayoutComponent>
        );
    }

    return (
        <LayoutComponent>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <Title level={2} className="text-[#800000]! mb-0!">Profile Settings</Title>
                    <Paragraph className="text-zinc-500">Manage your account information and security settings.</Paragraph>
                </div>

                {error && <Alert message={error} type="error" showIcon closable onClose={() => setError(null)} />}
                {successMessage && <Alert message={successMessage} type="success" showIcon closable onClose={() => setSuccessMessage(null)} />}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Avatar & Basic Info */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center text-center space-y-4">
                            <Avatar 
                                size={120} 
                                src={profileData?.profilePicture} 
                                icon={<UserOutlined />} 
                                className="bg-zinc-100 text-[#800000] text-4xl shadow-inner"
                            />
                            <div>
                                <Title level={4} className="mb-1! text-zinc-800!">{profileData?.fullName}</Title>
                                <Text className="text-zinc-500 block">{isAdmin ? 'Administrator' : 'Student Member'}</Text>
                                {!isAdmin && <Text className="text-zinc-400 text-sm block mt-1">{profileData?.admissionNumber}</Text>}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Forms */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Personal Info Form */}
                        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
                            <Title level={4} className="text-zinc-800! mb-6!">Personal Information</Title>
                            <Form form={form} layout="vertical" onFinish={handleProfileUpdate}>
                                <Form.Item label={<Text strong className="text-zinc-700">Full Name</Text>} name="fullName">
                                    <Input 
                                        prefix={<UserOutlined className="text-zinc-400" />} 
                                        size="large" 
                                        className="rounded-lg"
                                        disabled={isAdmin}
                                    />
                                </Form.Item>
                                <Form.Item label={<Text strong className="text-zinc-700">Email Address</Text>} name="email">
                                    <Input 
                                        size="large" 
                                        className="rounded-lg" 
                                        disabled 
                                    />
                                </Form.Item>
                                {!isAdmin && (
                                    <Form.Item>
                                        <Button 
                                            type="primary" 
                                            htmlType="submit" 
                                            loading={saving} 
                                            icon={<SaveOutlined />}
                                            className="bg-[#800000] hover:bg-[#600000] rounded-lg border-none"
                                        >
                                            Save Changes
                                        </Button>
                                    </Form.Item>
                                )}
                            </Form>
                        </div>

                        {/* Security Form */}
                        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
                            <Title level={4} className="text-zinc-800! mb-6!">Security</Title>
                            <Form form={passwordForm} layout="vertical" onFinish={handlePasswordChange}>
                                <Form.Item 
                                    label={<Text strong className="text-zinc-700">Current Password</Text>} 
                                    name="currentPassword"
                                    rules={[{ required: true, message: 'Please enter current password' }]}
                                >
                                    <Input.Password 
                                        prefix={<LockOutlined className="text-zinc-400" />} 
                                        size="large" 
                                        className="rounded-lg"
                                    />
                                </Form.Item>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Form.Item 
                                        label={<Text strong className="text-zinc-700">New Password</Text>} 
                                        name="newPassword"
                                        rules={[{ required: true, min: 8, message: 'Minimum 8 characters' }]}
                                    >
                                        <Input.Password 
                                            prefix={<LockOutlined className="text-zinc-400" />} 
                                            size="large" 
                                            className="rounded-lg"
                                        />
                                    </Form.Item>
                                    <Form.Item 
                                        label={<Text strong className="text-zinc-700">Confirm Password</Text>} 
                                        name="confirmPassword"
                                        dependencies={['newPassword']}
                                        rules={[
                                            { required: true, message: 'Please confirm password' },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('newPassword') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('Passwords do not match'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password 
                                            prefix={<LockOutlined className="text-zinc-400" />} 
                                            size="large" 
                                            className="rounded-lg"
                                        />
                                    </Form.Item>
                                </div>
                                <Form.Item className="mb-0">
                                    <Button 
                                        type="default" 
                                        htmlType="submit" 
                                        loading={saving}
                                        className="border-zinc-300 text-zinc-700 hover:text-[#800000] hover:border-[#800000] rounded-lg"
                                    >
                                        Update Password
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutComponent>
    );
};

export default ProfilePage;
