import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert, Modal, Spin, Typography, Card, Row, Col, Avatar, Upload } from 'antd';
import { UserOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import MemberLayout from '../../layout/MemberLayout';
import { API_URL } from '../../services/api';

const { Title, Paragraph, Text } = Typography;

function ProfileSettingsPage() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    // Fetch profile data with authentication
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/member/profile`, {
                    headers: getAuthHeaders(),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setProfileData(data);
                form.setFieldsValue(data); // Set form values
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

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
        setLoading(true);
        setError(null);
        try {
            // Simulate API call to update profile
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setProfileData(values); // Update local state
            setIsModalVisible(false);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission failure
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        setError('Please fill in all required fields correctly.');
    };

    // Handle profile picture upload
    const handleUploadChange = async (info) => {
        if (info.file.status === 'uploading') {
            setUploadLoading(true);
            setUploadError(null);
            return;
        }
        if (info.file.status === 'done') {
            try {
                const base64 = await getBase64(info.file.originFileObj);
                setProfileData({ ...profileData, profilePicture: base64 });
                form.setFieldsValue({ ...profileData, profilePicture: base64 });
                setUploadLoading(false);
            } catch (e) {
                setUploadError(e.message);
                setUploadLoading(false);
            }
        } else if (info.file.status === 'error') {
            setUploadError('Failed to upload profile picture.');
            setUploadLoading(false);
        }
    };

    // Convert image to base64
    const getBase64 = (img) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => resolve(reader.result));
            reader.addEventListener('error', (error) => reject(error));
            reader.readAsDataURL(img);
        });
    };

    // Upload button for profile picture
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
                                    src={(error ? defaultProfileData : profileData)?.profilePicture}
                                    alt="Profile Picture"
                                    icon={<UserOutlined />}
                                />
                                <Title level={3} style={{ color: 'maroon', marginTop: 16 }}>
                                    {(error ? defaultProfileData : profileData)?.name}
                                </Title>
                                <Text type="secondary">Admission Number: {(error ? defaultProfileData : profileData)?.admissionNumber}</Text>
                            </div>
                        </Col>
                        <Col xs={24} md={16}>
                            <Card>
                                <Title level={4} style={{ color: 'maroon', marginBottom: 16 }}>Profile Details</Title>
                                <Paragraph>
                                    <Text strong>Name:</Text> {(error ? defaultProfileData : profileData)?.fullName}
                                </Paragraph>
                                <Paragraph>
                                    <Text strong>Mobile Number:</Text> {(error ? defaultProfileData : profileData)?.mobileNumber}
                                </Paragraph>
                                <Paragraph>
                                    <Text strong>Admission Number:</Text> {(error ? defaultProfileData : profileData)?.admissionNumber}
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
                        initialValues={error ? defaultProfileData : profileData}
                        autoComplete="off"
                    >
                        <Form.Item
                            label={<Text strong>Name</Text>}
                            name="name"
                            rules={[{ required: true, message: 'Please enter your name!' }]}
                        >
                            <Input disabled={error} />
                        </Form.Item>
                        <Form.Item
                            label={<Text strong>Mobile Number</Text>}
                            name="mobileNumber"
                            rules={[{ required: true, message: 'Please enter your mobile number!' }]}
                        >
                            <Input disabled={error} />
                        </Form.Item>
                        <Form.Item
                            label={<Text strong>Profile Picture</Text>}
                            name="profilePicture"
                        >
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                beforeUpload={() => false}
                                onChange={handleUploadChange}
                                disabled={error}
                            >
                                {((error ? defaultProfileData : profileData) || {}).profilePicture ? (
                                    <img src={((error ? defaultProfileData : profileData) || {}).profilePicture} alt="avatar" style={{ width: '100%' }} />
                                ) : uploadButton}
                            </Upload>
                            {uploadError && <Alert message={`Upload Error: ${uploadError}`} type="error" showIcon />}
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                disabled={loading || error}
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
                        style={{
                            background: '#b5e487',
                            borderColor: 'maroon',
                            color: 'black'
                        }}
                    >
                        Apply Now
                    </Button>
                </div>
            </div>
        </MemberLayout>
    );
}

export default ProfileSettingsPage;