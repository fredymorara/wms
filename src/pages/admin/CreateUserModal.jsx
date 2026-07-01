import React, { useState } from 'react';
import { Modal, Typography, Form, Input, Select, Button, Spin, Alert, message } from 'antd';
import { createUser } from '../../services/api';
import { UserAddOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const CreateUserModal = ({ visible, onCancel, onCreated }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const onFinish = async (values) => {
        setLoading(true);
        setError(null);
        try {
            await createUser(values);
            message.success({ content: 'User created successfully', className: 'rounded-xl font-medium' });
            onCancel();
            if (onCreated) {
                onCreated();
            }
            form.resetFields();
        } catch (e) {
            setError(e.message);
            message.error({ content: `User creation failed: ${e.message}`, className: 'rounded-xl font-medium' });
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
            title={
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#800000]/10 flex items-center justify-center">
                        <UserAddOutlined className="text-[#800000] text-xl" />
                    </div>
                    <Title level={4} className="text-[#800000]! mb-0!">Create New User</Title>
                </div>
            }
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={600}
            className="rounded-3xl overflow-hidden [&_.ant-modal-content]:rounded-3xl [&_.ant-modal-header]:bg-zinc-50/50 [&_.ant-modal-header]:border-b [&_.ant-modal-header]:border-zinc-100 [&_.ant-modal-header]:pb-4 [&_.ant-modal-header]:pt-6"
        >
            <div className="pt-6">
                {error && <Alert message={`Error: ${error}`} type="error" closable onClose={() => setError(null)} className="mb-6 rounded-xl" />}

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={{ role: 'member' }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <Form.Item
                            label={<span className="font-semibold text-zinc-700">Admission Number</span>}
                            name="admissionNumber"
                            rules={[{ required: true, message: 'Please enter admission number!' }]}
                        >
                            <Input size="large" className="rounded-xl border-zinc-300 h-12" placeholder="e.g., ADM12345" />
                        </Form.Item>

                        <Form.Item
                            label={<span className="font-semibold text-zinc-700">Full Name</span>}
                            name="fullName"
                            rules={[{ required: true, message: 'Please enter full name!' }]}
                        >
                            <Input size="large" className="rounded-xl border-zinc-300 h-12" placeholder="e.g., John Doe" />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label={<span className="font-semibold text-zinc-700">School/Faculty</span>}
                        name="schoolFaculty"
                        rules={[{ required: true, message: 'Please enter school/faculty!' }]}
                    >
                        <Input size="large" className="rounded-xl border-zinc-300 h-12" placeholder="e.g., School of Computer Science" />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-semibold text-zinc-700">Email Address</span>}
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter email!' },
                            { type: 'email', message: 'Please enter a valid email!' },
                        ]}
                    >
                        <Input size="large" className="rounded-xl border-zinc-300 h-12" placeholder="john.doe@example.com" />
                    </Form.Item>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <Form.Item
                            label={<span className="font-semibold text-zinc-700">Password</span>}
                            name="password"
                            rules={[{ required: true, message: 'Please enter password!' },
                            { min: 8, message: 'Password must be at least 8 characters long.' }]}
                        >
                            <Input.Password size="large" className="rounded-xl border-zinc-300 h-12" placeholder="Secure password" />
                        </Form.Item>

                        <Form.Item
                            label={<span className="font-semibold text-zinc-700">Role</span>}
                            name="role"
                            initialValue="member"
                        >
                            <Select size="large" className="h-12 [&_.ant-select-selector]:rounded-xl [&_.ant-select-selector]:border-zinc-300 [&_.ant-select-selector]:items-center">
                                <Option value="member">Member</Option>
                                <Option value="admin">Admin</Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-zinc-100">
                        <Button size="large" onClick={onCancel} className="rounded-xl font-semibold h-12 px-6">
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading} size="large" className="bg-[#800000] hover:bg-[#600000] border-none font-bold rounded-xl h-12 px-8 shadow-md shadow-[#800000]/20">
                            Create User
                        </Button>
                    </div>
                </Form>
                {loading && <div className="flex justify-center mt-6"><Spin tip="Creating User..." /></div>}
            </div>
        </Modal>
    );
};

export default CreateUserModal;