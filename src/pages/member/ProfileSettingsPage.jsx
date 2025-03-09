import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Switch, Upload, Modal, Avatar, Alert, Spin, Typography, Card, Row, Col } from 'antd';
import { UploadOutlined, EditOutlined, UserOutlined, MailOutlined, PhoneOutlined, GlobalOutlined } from '@ant-design/icons';
import MemberLayout from '../../layout/MemberLayout';

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

    // Fetch profile data
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/member/profile');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProfileData(data);
                form.setFieldsValue(data);
                setLoading(false);
            } catch (e) {
                setError(e.message);
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

    // Default profile data for fallback
    const defaultProfileData = {
        nickname: 'Default User',
        school: 'Default School',
        email: 'default@example.com',
        phone: '+254 700 000 000',
        bio: 'A passionate student dedicated to making a difference.',
        socialMedia: {
            twitter: 'https://twitter.com/default',
            linkedin: 'https://linkedin.com/in/default',
        },
        emailNotifications: true,
        profilePicture: 'https://zos.alipayobjects.com/rmsportal/jkjgkEIFvnwkEwmiJDEkeCE.png', // Placeholder image
    };

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
            // Simulate API call
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
                        Manage your profile information and preferences.
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
                                    {(error ? defaultProfileData : profileData)?.nickname}
                                </Title>
                                <Text type="secondary">{(error ? defaultProfileData : profileData)?.school}</Text>
                            </div>
                        </Col>
                        <Col xs={24} md={16}>
                            <Card>
                                <Title level={4} style={{ color: 'maroon', marginBottom: 16 }}>About Me</Title>
                                <Paragraph>
                                    <Text strong>Bio:</Text> {(error ? defaultProfileData : profileData)?.bio || 'No bio available.'}
                                </Paragraph>
                                <Paragraph>
                                    <MailOutlined style={{ marginRight: 8 }} /> {(error ? defaultProfileData : profileData)?.email}
                                </Paragraph>
                                <Paragraph>
                                    <PhoneOutlined style={{ marginRight: 8 }} /> {(error ? defaultProfileData : profileData)?.phone}
                                </Paragraph>
                                <Paragraph>
                                    <GlobalOutlined style={{ marginRight: 8 }} />
                                    <a href={(error ? defaultProfileData : profileData)?.socialMedia?.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>
                                    {' | '}
                                    <a href={(error ? defaultProfileData : profileData)?.socialMedia?.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
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
                        style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}
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
                            label={<Text strong>Nickname</Text>}
                            name="nickname"
                            rules={[{ required: true, message: 'Please enter your nickname!' }]}
                        >
                            <Input disabled={error} />
                        </Form.Item>
                        <Form.Item
                            label={<Text strong>School/Faculty</Text>}
                            name="school"
                            rules={[{ required: true, message: 'Please select your school/faculty!' }]}
                        >
                            <Select disabled={error}>
                                <Select.Option value="medicine">School of Medicine</Select.Option>
                                <Select.Option value="engineering">School of Engineering</Select.Option>
                                {/* Add more options */}
                            </Select>
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
                                {((error ? defaultProfileData : profileData) || {}).profilePicture ? <img src={((error ? defaultProfileData : profileData) || {}).profilePicture} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                            </Upload>
                            {uploadError && <Alert message={`Upload Error: ${uploadError}`} type="error" showIcon />}
                        </Form.Item>
                        <Form.Item
                            name="emailNotifications"
                            label={<Text strong>Email Notifications</Text>}
                            valuePropName="checked"
                        >
                            <Switch disabled={error} />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                disabled={loading || error}
                                style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}
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
                        style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}
                    >
                        Apply Now
                    </Button>
                </div>
            </div>
        </MemberLayout>
    );
}

export default ProfileSettingsPage;