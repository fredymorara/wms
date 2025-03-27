// src/pages/member/ProfileSettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert, Modal, Spin, Typography, Card, Row, Col, Avatar, Upload, message, Tabs } from 'antd'; // Import Tabs
import { UserOutlined, EditOutlined, UploadOutlined, LockOutlined } from '@ant-design/icons';
import MemberLayout from '../../layout/MemberLayout';
import MemberCampaignApplicationModal from '../../components/MemberCampaignApplicationModal';
import { updateMemberProfile, getMemberProfile, changeMemberPassword } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs; // Destructure TabPane

function ProfileSettingsPage() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalLoading, setModalLoading] = useState(false); // Single loading state for the modal actions
    const [error, setError] = useState(null); // General page error
    const [modalError, setModalError] = useState(null); // Specific error for the modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [profileForm] = Form.useForm(); // Use ONE form for the modal
    const [uploadLoading, setUploadLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { token, isLoading: authLoading } = useAuth(); // Renamed isLoading

    // State for password change feedback within the modal
    const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(null);

    const [isApplyModalVisible, setIsApplyModalVisible] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (authLoading) return; // Wait for auth
            if (!token) {
                setError("Authentication token not found. Please log in again.");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const data = await getMemberProfile(token);
                setProfileData(data);
                profileForm.setFieldsValue({ fullName: data.fullName }); // Only set relevant fields for the modal form initially
            } catch (e) {
                setError(e.message || "Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, [token, profileForm, authLoading]); // Added authLoading

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const showModal = () => {
        // Reset modal state when opening
        setModalError(null);
        setPasswordChangeSuccess(null);
        // Set initial values (only fullName needed initially unless you want to prefill password fields, which is not recommended)
        profileForm.setFieldsValue({
            fullName: profileData?.fullName || '',
            // Clear password fields when opening
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        // Optionally reset form fields on cancel
        profileForm.resetFields();
        setModalError(null);
        setPasswordChangeSuccess(null);
    };

    // COMBINED Modal Finish Handler
    const onModalFinish = async (values) => {
        setModalLoading(true);
        setModalError(null);
        setPasswordChangeSuccess(null); // Clear previous success message

        const { fullName, currentPassword, newPassword } = values;
        let profileUpdateSuccess = false;
        let passwordUpdateSuccess = false;

        try {
            // --- Update Profile Name ---
            // Only update if the name has changed from the original profile data
            if (fullName && fullName !== profileData?.fullName) {
                console.log("Attempting to update name...");
                try {
                    const profileResponse = await updateMemberProfile(fullName, token);
                    // Update local profile data state immediately for UI reflection
                    setProfileData(prevData => ({ ...prevData, fullName: profileResponse.user.fullName }));
                    profileUpdateSuccess = true;
                    message.success('Profile name updated successfully!');
                } catch (profileError) {
                    console.error("Profile Update Error:", profileError);
                    // Set modal error, but allow password change attempt to continue if desired
                    setModalError(profileError.message || 'Failed to update profile name.');
                    // Optionally: return; // if you want to stop entirely on profile update failure
                }
            } else {
                profileUpdateSuccess = true; // Treat as success if no change was needed
                console.log("Name not changed, skipping name update.");
            }

            // --- Change Password ---
            // Only attempt if currentPassword and newPassword are provided
            if (currentPassword && newPassword) {
                console.log("Attempting to change password...");
                // Add password match validation here (already handled by Form.Item dependencies, but good practice)
                if (values.newPassword !== values.confirmPassword) {
                    throw new Error("New passwords do not match."); // Should be caught by form validation, but belt-and-suspenders
                }
                try {
                    const passwordResponse = await changeMemberPassword(
                        { currentPassword, newPassword },
                        token
                    );
                    setPasswordChangeSuccess(passwordResponse.message); // Set success message for display in modal
                    passwordUpdateSuccess = true;
                    message.success('Password changed successfully!'); // Also show Ant message
                    // Reset password fields within the modal form
                    profileForm.resetFields(['currentPassword', 'newPassword', 'confirmPassword']);
                } catch (passwordError) {
                    console.error("Password Change Error:", passwordError);
                    // Append password error to modal error
                    setModalError(prevError =>
                        prevError
                            ? `${prevError}\nPassword Change Failed: ${passwordError.message || 'Check current password.'}`
                            : `Password Change Failed: ${passwordError.message || 'Check current password.'}`
                    );
                }
            } else {
                passwordUpdateSuccess = true; // Treat as success if no password change was requested
                console.log("Password fields empty, skipping password change.");
            }

            // Close modal only if both requested operations were successful
            if (profileUpdateSuccess && passwordUpdateSuccess) {
                // Delay closing slightly to allow user to see success messages if needed
                setTimeout(() => {
                    setIsModalVisible(false);
                }, passwordChangeSuccess ? 1500 : 500); // Longer delay if password changed
            }


        } catch (generalError) {
            // Catch any unexpected errors during the process
            console.error("Modal Finish General Error:", generalError);
            setModalError(generalError.message || 'An unexpected error occurred.');
        } finally {
            setModalLoading(false);
        }
    };


    const onFinishFailed = (errorInfo) => {
        console.log('Modal Form submission failed:', errorInfo);
        message.error('Form has errors. Please check the fields.');
        // Don't setModalError here, Ant Design highlights the fields
    };


    const handleUploadChange = (info) => {
        console.log('Upload change event:', info);
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully (simulation)`);
            // Update profileData state with new image URL from server response
            // e.g., setProfileData(prev => ({...prev, profilePicture: info.file.response.imageUrl}));
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const sectionStyle = {
        padding: isMobile ? '24px 16px' : '32px 24px',
        marginBottom: 24,
        borderBottom: '2px solid #f0f0f0',
    };

    const showApplyModal = () => setIsApplyModalVisible(true);
    const handleApplyModalCancel = () => setIsApplyModalVisible(false);
    const handleApplicationCreated = () => console.log("Campaign application submitted.");

    return (
        <MemberLayout>
            <div style={{
                width: '100%', maxWidth: 1600, margin: '0 auto',
                backgroundColor: '#fff', minHeight: '100vh',
            }}>
                {/* Profile Header */}
                <div style={{ ...sectionStyle, textAlign: 'center' }}>
                    <Title level={1} style={{ color: 'maroon', fontSize: isMobile ? '1.75rem' : '2.5rem', marginBottom: 0 }}>
                        Profile Settings
                    </Title>
                    <Paragraph style={{ marginBottom: '20px' }}>
                        Manage your profile information and security settings.
                    </Paragraph>
                </div>

                {loading && <Spin tip="Loading Profile..." style={{ display: 'block', marginBottom: 24 }} />}
                {error && !loading && <Alert message={`Error: ${error}`} type="error" closable onClose={() => setError(null)} style={{ marginBottom: 24 }} />}

                {/* Profile View */}
                {!loading && !error && profileData && (
                    <div style={sectionStyle}>
                        <Row gutter={[24, 24]} align="middle">
                            <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                                <Upload /* ... props ... */>
                                    {profileData.profilePicture ? <Avatar size={isMobile ? 96 : 128} src={profileData.profilePicture} alt="avatar" /> : <Avatar size={isMobile ? 96 : 128} icon={<UserOutlined />} style={{ backgroundColor:'maroon' }} />}
                                </Upload>
                                <Title level={4} style={{ color: 'black', marginTop: 16, marginBottom: 4 }}>
                                    {profileData.fullName}
                                </Title>
                                <Text type="secondary">{profileData.admissionNumber}</Text>
                                <br /> {/* Added line break */}
                                <Button
                                    type="primary" // Make it primary or dashed as you prefer
                                    onClick={showModal}
                                    icon={<EditOutlined />}
                                    disabled={authLoading || loading} // Disable if auth or profile is loading
                                    style={{
                                        marginTop: 16,
                                        background: '#b5e487', // Example style
                                        borderColor: 'maroon',
                                        color: 'black'
                                    }}
                                >
                                    Edit Profile & Password
                                </Button>
                            </Col>
                            <Col xs={24} md={16}>
                                <Card>
                                    <Title level={4} style={{ color: 'maroon', marginBottom: 16 }}>Profile Details</Title>
                                    <Paragraph><Text strong>Name:</Text> {profileData.fullName}</Paragraph>
                                    <Paragraph><Text strong>Admission Number:</Text> {profileData.admissionNumber}</Paragraph>
                                    <Paragraph><Text strong>Email:</Text> {profileData.email}</Paragraph>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )}

                {/* Apply for Help Section remains the same */}
                <div style={{ ...sectionStyle, textAlign: 'center' }}>
                    <Title level={3} style={{ color: 'maroon', marginBottom: 16 }}>Apply for Help</Title>
                    <Paragraph>If you need financial assistance, you can submit a campaign request.</Paragraph>
                    <Button
                        type="primary"
                        disabled={error || authLoading || loading}
                        onClick={showApplyModal}
                        style={{ background: '#b5e487', borderColor: 'maroon', color: 'black' }}
                    >
                        Apply Now
                    </Button>
                </div>

                {/* --- MODIFIED MODAL --- */}
                <Modal
                    title={<Title level={4} style={{ color: 'maroon', marginBottom: '0', textAlign: 'center' }}>Edit Profile & Password</Title>}
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null} // Footer handled by Form button
                    width={isMobile ? '90%' : '60%'}
                    destroyOnClose // Destroys child components on close, helps reset state
                >
                    {/* Modal specific error and success messages */}
                    {modalError && <Alert message={modalError} type="error" showIcon style={{ marginBottom: 16 }} closable onClose={() => setModalError(null)} />}
                    {passwordChangeSuccess && <Alert message={passwordChangeSuccess} type="success" showIcon style={{ marginBottom: 16 }} closable onClose={() => setPasswordChangeSuccess(null)} />}

                    <Spin spinning={modalLoading} tip="Saving changes...">
                        <Form
                            form={profileForm} // Use the single form instance
                            layout="vertical"
                            onFinish={onModalFinish} // Use the combined handler
                            onFinishFailed={onFinishFailed}
                        // initialValues are now set when opening the modal
                        >
                            {/* Profile Name Section */}
                            <Title level={5} style={{ marginBottom: 16 }}>Update Profile Name</Title>
                            <Form.Item
                                label={<Text strong>Full Name</Text>}
                                name="fullName"
                                rules={[{ required: true, message: 'Please enter your name!' }]}
                            >
                                <Input prefix={<UserOutlined />} placeholder="Your Full Name" />
                            </Form.Item>

                            <div style={{ borderTop: '1px solid #f0f0f0', margin: '24px 0' }} /> {/* Divider */}

                            {/* Change Password Section */}
                            <Title level={5} style={{ marginBottom: 16 }}>Change Password (Optional)</Title>
                            <Paragraph type="secondary" style={{ marginBottom: 16 }}>
                                Leave these fields blank if you do not want to change your password.
                            </Paragraph>

                            <Form.Item
                                label={<Text strong>Current Password</Text>}
                                name="currentPassword"
                                // Rule is NOT required because password change is optional
                                rules={[
                                    // Add a validator to make it required IF newPassword is filled
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value && getFieldValue('newPassword')) {
                                                return Promise.reject(new Error('Current password is required to set a new one!'));
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Enter current password to change" />
                            </Form.Item>
                            <Form.Item
                                label={<Text strong>New Password</Text>}
                                name="newPassword"
                                // Rule is NOT required because password change is optional
                                rules={[
                                    { min: 8, message: 'Password must be at least 8 characters long.' },
                                    // Add a validator to make it required IF currentPassword is filled
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value && getFieldValue('currentPassword')) {
                                                return Promise.reject(new Error('New password is required if changing password!'));
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Enter new password" />
                            </Form.Item>
                            <Form.Item
                                label={<Text strong>Confirm New Password</Text>}
                                name="confirmPassword"
                                dependencies={['newPassword']} // Depends on newPassword
                                hasFeedback
                                // Rule is NOT required because password change is optional
                                rules={[
                                    // Add a validator to make it required IF newPassword is filled
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const newPasswordValue = getFieldValue('newPassword');
                                            if (!value && newPasswordValue) {
                                                return Promise.reject(new Error('Please confirm your new password!'));
                                            }
                                            if (value && newPasswordValue && newPasswordValue !== value) {
                                                return Promise.reject(new Error('The new passwords do not match!'));
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Confirm new password" />
                            </Form.Item>

                            {/* Modal Footer Buttons */}
                            <Form.Item style={{ textAlign: 'right', marginTop: 24, marginBottom: 0 }}>
                                <Button onClick={handleCancel} style={{ marginRight: 8 }} disabled={modalLoading}>
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={modalLoading}
                                    style={{ background: '#b5e487', borderColor: 'maroon', color: 'black' }}
                                >
                                    Save Changes
                                </Button>
                            </Form.Item>
                        </Form>
                    </Spin>
                </Modal>
                {/* --- END OF MODIFIED MODAL --- */}


                {/* Member Campaign Application Modal */}
                <MemberCampaignApplicationModal
                    visible={isApplyModalVisible}
                    onCancel={handleApplyModalCancel}
                    onCreated={handleApplicationCreated}
                />
            </div>
        </MemberLayout>
    );
}

export default ProfileSettingsPage;