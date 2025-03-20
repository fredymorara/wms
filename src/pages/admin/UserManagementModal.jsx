import React, { useState, useEffect, useRef } from 'react';
import { Modal, Typography, Table, Button, Spin, Alert, Space, message, Input } from 'antd';
import { API_URL } from '../../services/api';
import CreateUserModal from './CreateUserModal';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const UserManagementModal = ({ visible, onCancel }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [isCreateUserModalVisible, setIsCreateUserModalVisible] = useState(false);
    const [searchText, setSearchText] = useState(''); // State for search text
    const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users
    const searchInput = useRef(null); // Ref for Input.Search

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/admin/users`, {
                headers: getAuthHeaders()
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setUsers(data);
            setFilteredUsers(data); // Initially, filtered users are all users
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
            setActionLoading(false);
        }
    };

    useEffect(() => {
        if (visible) {
            fetchUsers();
        }
    }, [visible]);

    // Filtering Logic - runs whenever searchText or users changes
    useEffect(() => {
        if (searchText) {
            const filtered = users.filter(user =>
                user.admissionNumber.toLowerCase().includes(searchText.toLowerCase()) ||
                user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
                user.email.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users); // If no search text, show all users
        }
    }, [searchText, users]);

    const handleRevokeAccess = async (userId) => {
        setActionLoading(true);
        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}/revoke`, {
                method: 'POST',
                headers: getAuthHeaders()
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to revoke user access');
            }
            message.success('User access revoked successfully');
            fetchUsers(); // Refresh user list after action
        } catch (e) {
            setError(e.message);
            message.error(`Failed to revoke user access: ${e.message}`);
        } finally {
            setActionLoading(false);
        }
    };

    const handleGrantAccess = async (userId) => {
        setActionLoading(true);
        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}/grant`, {
                method: 'POST',
                headers: getAuthHeaders()
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to grant user access');
            }
            message.success('User access granted successfully');
            fetchUsers(); // Refresh user list after action
        } catch (e) {
            setError(e.message);
            message.error(`Failed to grant user access: ${e.message}`);
        } finally {
            setActionLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const clearSearch = () => {
        setSearchText('');
        if (searchInput.current) { // Clear input field programmatically
            searchInput.current.focus();
        }
    };

    const columns = [
        {
            title: 'Admission Number',
            dataIndex: 'admissionNumber',
            key: 'admissionNumber',
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Is Active',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => isActive ? 'Yes' : 'No',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    {record.isActive ? (
                        <Button size="small" danger loading={actionLoading} onClick={() => handleRevokeAccess(record._id)}>Revoke Access</Button>
                    ) : (
                        <Button size="small" type="primary" loading={actionLoading} onClick={() => handleGrantAccess(record._id)}>Grant Access</Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Modal
            title="Manage Users"
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width="90%"
        >
            {error && <Alert message={`Error: ${error}`} type="error" closable onClose={() => setError(null)} style={{ marginBottom: 24 }} />}
            {loading && <Spin tip="Loading Users..." style={{ display: 'block', marginBottom: 24 }} />}

            <div style={{ marginBottom: 16, textAlign: 'right', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button type="primary" onClick={() => setIsCreateUserModalVisible(true)} style={{ backgroundColor: '#b5e487', borderColor: 'maroon', color: 'black' }}>
                    Create New User
                </Button>
                <Input.Search
                    placeholder="Search users"
                    onSearch={handleSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ width: 200 }}
                    value={searchText}
                    suffix={searchText && <CloseOutlined onClick={clearSearch} style={{ cursor: 'pointer' }} />}
                    ref={searchInput} // Attach ref to Input.Search
                />
            </div>

            <Table
                columns={columns}
                dataSource={filteredUsers} // Use filteredUsers as dataSource
                rowKey="_id"
                pagination={{ pageSize: 10 }}
            />
            <div style={{ textAlign: 'right', marginTop: 16 }}>
                <Button onClick={onCancel}>
                    Close
                </Button>
            </div>

            {/* Embed Create User Modal */}
            <CreateUserModal
                visible={isCreateUserModalVisible}
                onCancel={() => setIsCreateUserModalVisible(false)}
                onCreated={fetchUsers}
            />
        </Modal>
    );
};

export default UserManagementModal;