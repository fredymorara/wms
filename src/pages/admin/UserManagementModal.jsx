import React, { useState, useEffect, useRef } from 'react';
import { Modal, Typography, Table, Button, Spin, Alert, Space, message, Input } from 'antd';
import { API_URL } from '../../services/api';
import CreateUserModal from './CreateUserModal';
import { SearchOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const UserManagementModal = ({ visible, onCancel }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [isCreateUserModalVisible, setIsCreateUserModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const searchInput = useRef(null);

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
            const data = await response.json();
            if (response.ok) {
                const userList = data.data || data;
                setUsers(userList);
                setFilteredUsers(userList);
            } else {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
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

    useEffect(() => {
        if (searchText) {
            const filtered = users.filter(user =>
                user.admissionNumber.toLowerCase().includes(searchText.toLowerCase()) ||
                user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
                user.email.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
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
            message.success({ content: 'User access revoked successfully', className: 'rounded-xl font-medium' });
            fetchUsers();
        } catch (e) {
            setError(e.message);
            message.error({ content: `Failed to revoke access: ${e.message}`, className: 'rounded-xl font-medium' });
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
            message.success({ content: 'User access granted successfully', className: 'rounded-xl font-medium' });
            fetchUsers();
        } catch (e) {
            setError(e.message);
            message.error({ content: `Failed to grant access: ${e.message}`, className: 'rounded-xl font-medium' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const clearSearch = () => {
        setSearchText('');
        if (searchInput.current) {
            searchInput.current.focus();
        }
    };

    const columns = [
        {
            title: 'Student ID',
            dataIndex: 'admissionNumber',
            key: 'admissionNumber',
            render: (text) => <span className="font-semibold text-zinc-800">{text}</span>
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text) => <span className="text-zinc-600 font-medium">{text}</span>
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text) => <span className="text-zinc-500">{text}</span>
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    role === 'admin' ? 'bg-[#800000]/10 text-[#800000]' : 'bg-zinc-100 text-zinc-600'
                }`}>
                    {role}
                </span>
            )
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center w-fit gap-1.5 ${
                    isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {isActive ? 'Active' : 'Revoked'}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    {record.isActive ? (
                        <Button size="small" danger loading={actionLoading} onClick={() => handleRevokeAccess(record._id)} className="rounded-lg text-xs font-medium border-red-200 hover:bg-red-50">Revoke</Button>
                    ) : (
                        <Button size="small" loading={actionLoading} onClick={() => handleGrantAccess(record._id)} className="rounded-lg text-xs font-medium border-[#b5e487] text-green-700 bg-green-50 hover:bg-[#b5e487]">Grant</Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Modal
            title={<Title level={4} className="text-[#800000]! mb-0!">User Management</Title>}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width="90%"
            style={{ maxWidth: 1000 }}
            className="rounded-3xl overflow-hidden [&_.ant-modal-content]:rounded-3xl [&_.ant-modal-header]:bg-zinc-50/50 [&_.ant-modal-header]:border-b [&_.ant-modal-header]:border-zinc-100 [&_.ant-modal-header]:pb-4 [&_.ant-modal-header]:pt-6"
        >
            <div className="pt-6">
                {error && <Alert message={`Error: ${error}`} type="error" closable onClose={() => setError(null)} className="mb-6 rounded-xl" />}

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <Input
                        placeholder="Search users by ID, Name or Email..."
                        onChange={(e) => handleSearch(e.target.value)}
                        value={searchText}
                        prefix={<SearchOutlined className="text-zinc-400" />}
                        suffix={searchText && <CloseOutlined onClick={clearSearch} className="cursor-pointer text-zinc-400 hover:text-zinc-700" />}
                        ref={searchInput}
                        size="large"
                        className="rounded-xl border-zinc-200 h-12 w-full md:max-w-md shadow-sm"
                    />
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        onClick={() => setIsCreateUserModalVisible(true)} 
                        size="large"
                        className="bg-[#b5e487] text-[#800000] border-none font-bold rounded-xl h-12 px-6 shadow-sm hover:opacity-90 w-full md:w-auto"
                    >
                        Create New User
                    </Button>
                </div>

                <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={filteredUsers}
                        rowKey="_id"
                        pagination={{ pageSize: 10, className: "px-4" }}
                        loading={{
                            spinning: loading,
                            indicator: <Spin size="large" />
                        }}
                        scroll={{ x: 'max-content' }}
                        className="[&_.ant-table-thead_th]:bg-zinc-50 [&_.ant-table-thead_th]:text-zinc-500 [&_.ant-table-thead_th]:font-semibold [&_.ant-table-thead_th]:border-b-zinc-200 [&_.ant-table-tbody_td]:border-b-zinc-100"
                    />
                </div>
            </div>

            <CreateUserModal
                visible={isCreateUserModalVisible}
                onCancel={() => setIsCreateUserModalVisible(false)}
                onCreated={fetchUsers}
            />
        </Modal>
    );
};

export default UserManagementModal;