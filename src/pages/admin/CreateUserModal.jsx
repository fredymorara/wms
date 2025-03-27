import React, { useState } from 'react';
import { Modal, Typography, Form, Input, Select, Button, Spin, Alert, message } from 'antd';
import { API_URL } from '../../services/api';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const CreateUserModal = ({ visible, onCancel, onCreated }) => { // Receive visible, onCancel, onCreated props
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    const onFinish = async (values) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/admin/users`, { // POST to /admin/users to create user
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(values),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'User creation failed');
            }
            message.success('User created successfully');
            onCancel(); // Close modal on success
            if (onCreated) {
                onCreated(); // Call onCreated callback to refresh user list in UserManagementModal
            }
            form.resetFields(); // Clear form fields
        } catch (e) {
            setError(e.message);
            message.error(`User creation failed: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        setError('User creation form submission failed. Please check the fields.');
    };

    return (
        <Modal
            title={<Title level={4} style={{ color: 'maroon', textAlign: 'center' }}>Create New User</Title>}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width="50%" // Adjust width as needed
        >
            {error && <Alert message={`Error: ${error}`} type="error" closable onClose={() => setError(null)} style={{ marginBottom: 24 }} />}

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={{ role: 'member' }} // Default role to member
            >
                <Form.Item
                    label="Admission Number"
                    name="admissionNumber"
                    rules={[{ required: true, message: 'Please enter admission number!' }]}
                >
                    <Input placeholder="Admission Number" />
                </Form.Item>

                <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[{ required: true, message: 'Please enter full name!' }]}
                >
                    <Input placeholder="Full Name" />
                </Form.Item>

                <Form.Item
                    label="School/Faculty"
                    name="schoolFaculty"
                    rules={[{ required: true, message: 'Please enter school/faculty!' }]}
                >
                    <Input placeholder="School/Faculty" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please enter email!' },
                        { type: 'email', message: 'Please enter a valid email!' },
                    ]}
                >
                    <Input placeholder="Email" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please enter password!' },
                    { min: 8, message: 'Password must be at least 8 characters long.' }]} // Basic password validation
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>

                <Form.Item
                    label="Role"
                    name="role"
                    initialValue="member"
                >
                    <Select placeholder="Select Role">
                        <Option value="member">Member</Option>
                        <Option value="admin">Admin</Option>
                    </Select>
                </Form.Item>

                <Form.Item style={{ textAlign: 'right' }}>
                    <Button onClick={onCancel} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ backgroundColor: '#b5e487', borderColor: 'maroon', color: 'black' }}>
                        Create User
                    </Button>
                </Form.Item>
            </Form>
            {loading && <Spin tip="Creating User..." style={{ display: 'block', marginTop: 24 }} />}
        </Modal>
    );
};

export default CreateUserModal;