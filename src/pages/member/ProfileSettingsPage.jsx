// src/pages/member/ProfileSettingsPage.jsx
import React, { useState } from 'react';
import { Form, Input, Button, Select, Switch, Upload, Modal, Avatar } from 'antd';
import { UploadOutlined, EditOutlined } from '@ant-design/icons';

function ProfileSettingsPage() {
    // Mock user profile data
    const [profileData, setProfileData] = useState({
        nickname: 'JaneDoe123',
        school: 'engineering',
        emailNotifications: true,
        profilePicture: 'https://zos.alipayobjects.com/rmsportal/jkjgkEIFvnwkEwmiJDEkeCE.png', // Placeholder image
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const showModal = () => {
        // Set initial values in the form based on existing profile data
        form.setFieldsValue(profileData);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onFinish = (values) => {
        console.log('Success:', values);
        setProfileData(values); // Update profile data with new values
        setIsModalVisible(false);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleUploadChange = (info) => {
        if (info.file.status === 'uploading') {
            //setUploading(true);  we are no longer tracking
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world
            getBase64(info.file.originFileObj, (url) => {
                //setUploading(false);
                setProfileData({ ...profileData, profilePicture: url }); // Update profile picture
            });
        }
    };
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };
    const uploadButton = (
        <div>
            {/* Add an icon here if you want */}
            <div className="ant-upload-text">Upload</div>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>
            <div className="bg-white rounded-md shadow-md p-6">
                {/* Display existing profile data */}
                <div className="mb-4">
                    <div className="flex items-center space-x-4">
                        <Avatar size={64} src={profileData.profilePicture} />
                        <div>
                            <h2 className="text-xl font-semibold">{profileData.nickname}</h2>
                            <p className="text-gray-600">School: {profileData.school}</p>
                        </div>
                    </div>
                </div>

                {/* Edit Button */}
                <Button type="primary" onClick={showModal} icon={<EditOutlined />} className="mb-4">
                    Update Profile
                </Button>
            </div>

            {/* Modal for Updating Profile */}
            <Modal
                title="Update Profile"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
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
                        label="Nickname"
                        name="nickname"
                        rules={[{ required: true, message: 'Please enter your nickname!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="School/Faculty"
                        name="school"
                        rules={[{ required: true, message: 'Please select your school/faculty!' }]}
                    >
                        <Select>
                            <Select.Option value="medicine">School of Medicine</Select.Option>
                            <Select.Option value="engineering">School of Engineering</Select.Option>
                            {/* Add more options */}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Profile Picture" name="profilePicture">
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="https://run.mocky.io/v3/6567dd3e-8553-44a7-9e54-b5517c607a99" // Replace with your upload API
                            beforeUpload={() => false} // Prevent automatic upload
                            onChange={handleUploadChange}
                        >
                            {profileData.profilePicture ? <img src={profileData.profilePicture} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        name="emailNotifications"
                        label="Email Notifications"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default ProfileSettingsPage;