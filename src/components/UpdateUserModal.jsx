import React from 'react';
import { Card, Form, Input, Select, DatePicker, Button, Modal, Typography } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';

const { Option } = Select;
const {Title} = Typography

function UpdateUserModal({ selectedUser, handleCancel, isModalVisible }) {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        // Simulate API call to update user data
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('User data updated:', values);
        handleCancel()
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Modal
            title={<Title level={4} style={{ color: 'maroon', marginBottom: '0' }}>Update User Info</Title>}
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            forceRender
        >
            {selectedUser && (
                <div className="container">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            label={<Title level={5}>Admission Number</Title>}
                            name="admission_number"
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            label={<Title level={5}>Full Name</Title>}
                            name="full_name"
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            label={<Title level={5}>School/Faculty</Title>}
                            name="school_faculty"
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            label={<Title level={5}>Email</Title>}
                            name="email"
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            label={<Title level={5}>Valid Until</Title>}
                            name="valid_until"
                            rules={[{ required: true, message: 'Please select valid until date!' }]}
                        >
                            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white', marginRight: 8 }}>
                                Update
                            </Button>
                            <Button onClick={handleCancel}>Cancel</Button>
                        </Form.Item>
                    </Form>
                </div>
            )}
        </Modal>
    );
}

UpdateUserModal.propTypes = {
  selectedUser: PropTypes.object,
  handleCancel: PropTypes.func,
  isModalVisible: PropTypes.bool,
};

export default UpdateUserModal;