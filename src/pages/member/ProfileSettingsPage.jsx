import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert, Modal, Spin, Typography, Card, Row, Col, Avatar, Upload } from 'antd';
import { UserOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import MemberLayout from '../../layout/MemberLayout';
import MemberCampaignApplicationModal from '../../components/MemberCampaignApplicationModal'; // Import the new Modal component
import { API_URL, updateMemberProfile, getMemberProfile } from '../../services/api'; // Import API functions
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth hook

const { Title, Paragraph, Text } = Typography;

function ProfileSettingsPage() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false); // Separate loading state for update action
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const { token } = useAuth(); // Use AuthContext to get token

    // New state for campaign application modal
    const [isApplyModalVisible, setIsApplyModalVisible] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getMemberProfile(token); // Use imported API function
                setProfileData(data);
                form.setFieldsValue(data); // Set form values
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [token]); // token dependency for useEffect

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Show modal for updating profile
    const showModal = () => {
        setIsModalVisible(true);
    };

    // Handle modal cancel
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Handle form submission
    const onFinish = async (values) => {
        setUpdateLoading(true);
        setError(null);
        try {
            console.log("onFinish function called with values:", values); // <--- ADD THIS LOG (BEFORE API CALL)

            const response = await updateMemberProfile(values.fullName, token);

            console.log("updateMemberProfile API call response:", response); // <--- ADD THIS LOG (AFTER API CALL)

            setProfileData(response.user);
            form.setFieldsValue(response.user);
            setIsModalVisible(false);
            setUpdateLoading(false);
            // Optionally show a success message using Ant Design message.success
        } catch (e) {
            setError(e.message);
            setUpdateLoading(false);
        }
    };

    // Handle form submission failure
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        setError('Please fill in all required fields correctly.');
    };

    // Handle profile picture upload (Placeholder - you can implement image upload later)
    const handleUploadChange = async (info) => {
        console.log('Upload change event:', info);
        // Implement image upload logic here if needed
        // For now, just setting a placeholder image URL
        if (info.file.status === 'done') {
            const base64Placeholder = 'https://zos.alipayobjects.com/rmsportal/jkjgkefkvsdajkj.png'; // Replace with your placeholder or actual upload logic
            setProfileData({ ...profileData, profilePicture: base64Placeholder });
            form.setFieldsValue({ ...profileData, profilePicture: base64Placeholder });
        }
    };

    // Convert image to base64 (Placeholder function - for actual upload, you'd use FileReader or similar)
    const getBase64 = (img) => {
        return new Promise((resolve) => {
            resolve('base64-image-data'); // Replace with actual base64 conversion if needed
        });
    };

    // Upload button for profile picture (Placeholder)
    const uploadButton = (
        <div>
            {uploadLoading ? <Spin /> : <UploadOutlined />}
            <div className="ant-upload-text">Upload</div>
        </div>
    );

    // Section styling
    const sectionStyle = {
        padding: isMobile ? '24px 16px' : '32px 24px',
        marginBottom: 24,
        borderBottom: '2px solid #f0f0f0',
    };

    const defaultProfileData = {
        fullName: 'Loading Name...',
        admissionNumber: 'Loading...',
        email: 'loading@example.com',
        profilePicture: null, // Or a default placeholder image URL
    };

    // Function to show Apply Modal
    const showApplyModal = () => {
        setIsApplyModalVisible(true);
    };

    // Function to handle Apply Modal Cancel
    const handleApplyModalCancel = () => {
        setIsApplyModalVisible(false);
    };

    // Function to handle successful application submission (optional - for any refresh logic)
    const handleApplicationCreated = () => {
        // You can add logic here to refresh data or show a confirmation message if needed
        console.log("Campaign application submitted successfully (callback from modal)");
    };

    return (
        <MemberLayout>
            <div style={{
                width: '100%',
                maxWidth: 1600,
                margin: '0 auto',
                backgroundColor: '#fff',
                minHeight: '100vh',
            }}>
                {/* Profile Header */}
                <div style={{ ...sectionStyle, textAlign: 'center' }}>
                    <Title level={1} style={{
                        color: 'maroon',
                        fontSize: isMobile ? '1.75rem' : '2.5rem',
                        marginBottom: 0,
                    }}>
                        Profile Settings
                    </Title>
                    <Paragraph style={{ marginBottom: '20px', textAlign: 'center' }}>
                        Manage your profile information.
                    </Paragraph>
                </div>

                {/* Loading and Error States */}
                {loading && <Alert message="Loading..." type="info" showIcon style={{ marginBottom: 24 }} />}
                {error && <Alert message={`Error: ${error}`} type="error" closable onClose={() => setError(null)} style={{ marginBottom: 24 }} />}

                {/* Profile View */}
                <div style={sectionStyle}>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={8}>
                            <div style={{ textAlign: 'center' }}>
                                <Avatar
                                    size={isMobile ? 96 : 128}
                                    src={profileData?.profilePicture}
                                    alt="Profile Picture"
                                    icon={<UserOutlined />}
                                />
                                <Title level={4} style={{ color: 'black', marginTop: 16 }}>
                                    {profileData?.fullName}
                                </Title>
                                <Text type="secondary">{profileData?.admissionNumber}</Text>
                            </div>
                        </Col>
                        <Col xs={24} md={16}>
                            <Card>
                                <Title level={4} style={{ color: 'maroon', marginBottom: 16 }}>Profile Details</Title>
                                <Paragraph>
                                    <Text strong>Name:</Text> {profileData?.fullName}
                                </Paragraph>
                                <Paragraph>
                                    <Text strong>Admission Number:</Text> {profileData?.admissionNumber}
                                </Paragraph>
                                <Paragraph>
                                    <Text strong>Email:</Text> {profileData?.email}
                                </Paragraph>
                            </Card>
                        </Col>
                    </Row>
                </div>

                {/* Update Profile Button */}
                <div style={{ ...sectionStyle, textAlign: 'center' }}>
                    <Button
                        type="primary"
                        onClick={showModal}
                        icon={<EditOutlined />}
                        disabled={error}
                        style={{
                            background: '#b5e487',
                            borderColor: 'maroon',
                            color: 'black'
                        }}
                    >
                        Update Profile
                    </Button>
                </div>

                {/* Modal for Updating Profile */}
                <Modal
                    title={<Title level={4} style={{ color: 'maroon', marginBottom: '0' }}>Update Profile</Title>}
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                    width={isMobile ? '90%' : '60%'}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        initialValues={profileData}
                        autoComplete="off"
                    >
                        <Form.Item
                            label={<Text strong>Full Name</Text>}
                            name="fullName"
                            rules={[{ required: true, message: 'Please enter your name!' }]}
                        >
                            <Input disabled={error} />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={updateLoading}
                                disabled={updateLoading || error}
                                style={{
                                    background: '#b5e487',
                                    borderColor: 'maroon',
                                    color: 'black'
                                }}
                            >
                                Save Changes
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Apply for Help Section */}
                <div style={{ ...sectionStyle, textAlign: 'center' }}>
                    <Title level={3} style={{ color: 'maroon', marginBottom: 16 }}>Apply for Help</Title>
                    <Paragraph>If you need financial assistance, you can submit a campaign request.</Paragraph>
                    <Button
                        type="primary"
                        disabled={error}
                        onClick={showApplyModal}
                        style={{
                            background: '#b5e487',
                            borderColor: 'maroon',
                            color: 'black'
                        }}
                    >
                        Apply Now
                    </Button>
                </div>

                {/* Member Campaign Application Modal - NEW MODAL */}
                <MemberCampaignApplicationModal
                    visible={isApplyModalVisible}
                    onCancel={handleApplyModalCancel}
                    onCreated={handleApplicationCreated} // Optional callback for successful creation
                />
            </div>
        </MemberLayout>
    );
}

export default ProfileSettingsPage;