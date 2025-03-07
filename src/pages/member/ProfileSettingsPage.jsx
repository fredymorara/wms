import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Switch, Upload, Modal, Avatar, Alert, Spin, Layout, Typography } from 'antd';
import { UploadOutlined, EditOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

function ProfileSettingsPage() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

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

    const defaultProfileData = {
        nickname: 'Default User',
        school: 'Default School',
        emailNotifications: true,
        profilePicture: 'https://zos.alipayobjects.com/rmsportal/jkjgkEIFvnwkEwmiJDEkeCE.png', // Placeholder image
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

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

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        setError('Please fill in all required fields correctly.');
    };

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

    const getBase64 = (img) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => resolve(reader.result));
            reader.addEventListener('error', (error) => reject(error));
            reader.readAsDataURL(img);
        });
    };

    const uploadButton = (
        <div>
            {uploadLoading ? <Spin /> : <UploadOutlined />}
            <div className="ant-upload-text">Upload</div>
        </div>
    );

    return (
        <Layout
            style={{
                background: 'linear-gradient(to bottom, #F8E8EC 70%, #d9f7be)',
                minHeight: '100vh',
            }}
        >
            <Header
                style={{
                    background: 'maroon',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    padding: '0 50px',
                    height: '80px',
                }}
            >
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                    Kabarak Student Welfare Management System
                </Title>
            </Header>
            <Content style={{ padding: '50px' }}>
                <div className="container">
                    <Title level={2} style={{ color: 'maroon', marginBottom: '20px', textAlign: 'center' }}>Profile Settings</Title>

                    {loading ? (
                        <div className="text-center">
                            <Spin size="large" />
                            <p className="mt-2">Loading profile data...</p>
                        </div>
                    ) : error ? (
                        <Alert message={`Error fetching data: ${error}. Displaying default profile.`} type="error" showIcon />
                    ) : null}

                    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
                        {profileData || error ? (
                            <div className="mb-4">
                                <div className="flex items-center space-x-4">
                                    <Avatar size={64} src={(error ? defaultProfileData : profileData).profilePicture} alt="Profile Picture" />
                                    <div>
                                        <Title level={4} style={{ color: 'maroon', marginBottom: '0' }}>{(error ? defaultProfileData : profileData).nickname}</Title>
                                        <Paragraph style={{ color: '#555' }}>School: {(error ? defaultProfileData : profileData).school}</Paragraph>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                        <Button type="primary" onClick={showModal} icon={<EditOutlined />} className="mb-4" disabled={error} style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}>
                            Update Profile
                        </Button>
                    </div>

                    {/* Modal for Updating Profile */}
                    <Modal
                        title={<Title level={4} style={{ color: 'maroon', marginBottom: '0' }}>Update Profile</Title>}
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        footer={null}
                        forceRender
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
                                label={<Title level={5}>Nickname</Title>}
                                name="nickname"
                                rules={[{ required: true, message: 'Please enter your nickname!' }]}
                            >
                                <Input disabled={error} />
                            </Form.Item>
                            <Form.Item
                                label={<Title level={5}>School/Faculty</Title>}
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
                                label={<Title level={5}>Profile Picture</Title>}
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
                                label={<Title level={5}>Email Notifications</Title>}
                                valuePropName="checked"
                            >
                                <Switch disabled={error} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} disabled={loading || error} style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}>
                                    Save Changes
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>

                    {/* Apply for Help Section */}
                    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '8px', padding: '20px' }}>
                        <Title level={3} style={{ color: 'maroon', marginBottom: '10px' }}>Apply for Help</Title>
                        <Paragraph>If you need financial assistance, you can submit a campaign request.</Paragraph>
                        <Button type="primary" disabled={error} style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}>
                            Apply Now
                        </Button>
                    </div>
                </div>
            </Content>
        </Layout>
    );
}

export default ProfileSettingsPage;