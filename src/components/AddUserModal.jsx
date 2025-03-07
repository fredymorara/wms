import React, { useState } from 'react';
import { Card, Form, Input, Select, DatePicker, Button, Modal, message, Typography, Upload, Alert } from 'antd'; // Added Alert import
import { UploadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const { Option } = Select;
const { Paragraph, Title } = Typography;

function AddUserModal({ handleUpdateData, isBatchUploadVisible, setIsBatchUploadVisible, error }) {
    const [form] = Form.useForm();
    const [formUpload] = Form.useForm();

    const onFinish = async (values) => {
        // Simulate API call to add a new user
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('New user added:', values);

        handleUpdateData(function (prevUsers) {
            return [...prevUsers, { ...values, id: 34 }];
        });

        form.resetFields();
        message.success('User added successfully!');
        setIsBatchUploadVisible(false);
    };

    const handleUpload = ({ fileList }) => {
        formUpload
            .validateFields()
            .then(() => {
                // Simulate upload logic - replace with your actual upload endpoint
                console.log('Upload file: ', fileList);
                console.log(fileList[0].originFileObj);
                handleBatchUpload(fileList[0].originFileObj);

                // upload
                message.success('Successfully Submitted File!');
                setIsBatchUploadVisible(false);
            })
            .catch((info) => {
                console.log('Upload Failed:', info);
                message.error('Successfully Submitted File!');
                setIsBatchUploadVisible(false);
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleBatchUpload = async (file) => {
        console.log(file);
        // Add your batch upload logic here
    };

    const adduserCancel = () => {
        setIsBatchUploadVisible(false);
    };

    return (
        <Modal
            title={<Title level={4} style={{ color: 'maroon', marginBottom: '0' }}>Add New User</Title>}
            visible={isBatchUploadVisible}
            onCancel={adduserCancel}
            footer={null}
            forceRender
        >
            {/* Add New User Form */}
            <div>
                <Typography>
                    <Alert
                        message="Please be Advised the Data displayed here is Dummy data it will be changed upon API set up"
                        type="warning"
                        closable
                        showIcon
                    />
                </Typography>
            </div>
            <div>
                <Card style={{ marginBottom: '20px' }}>
                    <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                        <Form.Item label={<Title level={5}>Admission Number</Title>} name="admission_number" rules={[{ required: true, message: 'Please enter admission number!' }]}>
                            <Input disabled={error} />
                        </Form.Item>
                        <Form.Item label={<Title level={5}>Full Name</Title>} name="full_name" rules={[{ required: true, message: 'Please enter full name!' }]}>
                            <Input disabled={error} />
                        </Form.Item>
                        <Form.Item label={<Title level={5}>School/Faculty</Title>} name="school_faculty" rules={[{ required: true, message: 'Please select school/faculty!' }]}>
                            <Select disabled={error}>
                                <Option value="medicine">School of Medicine</Option>
                                <Option value="engineering">School of Engineering</Option>
                                {/* Add more options */}
                            </Select>
                        </Form.Item>
                        <Form.Item label={<Title level={5}>Email</Title>} name="email" rules={[{ required: true, message: 'Please enter email!', type: 'email' }]}>
                            <Input disabled={error} />
                        </Form.Item>
                        <Form.Item label={<Title level={5}>Valid Until</Title>} name="valid_until" rules={[{ required: true, message: 'Please select valid until date!' }]}>
                            <DatePicker style={{ width: '100%' }} disabled={error} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }} disabled={error}>
                                Add User
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
                <Card style={{ marginBottom: '20px' }}>
                    <Typography>
                        Add User in Batch (CSV)
                        <Paragraph>Upload a CSV file containing user data. The file should have columns for admission_number, full_name, school_faculty, email, and valid_until.</Paragraph>
                    </Typography>

                    <Form form={formUpload} name="batch_upload_form" onFinish={() => { }} autoComplete="off">
                        <Form.Item label={<Title level={5}>Upload CSV File</Title>} name="upload" valuePropName="fileList" getValueFromEvent={(e) => { if (Array.isArray(e)) { return e; } return e && e.fileList; }} rules={[{ required: true, message: 'Please upload a CSV file!' }]}>
                            <Upload name="logo" action="/api/upload" listType="picture" maxCount={1} beforeUpload={() => false} onChange={handleUpload}>
                                <Button icon={<UploadOutlined />} style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}>Click to upload</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit" style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </Modal>
    );
}

AddUserModal.propTypes = {
    handleUpdateData: PropTypes.func,
    isBatchUploadVisible: PropTypes.bool,
    setIsBatchUploadVisible: PropTypes.func,
    error: PropTypes.any,
};

export default AddUserModal;