import React, { useState, useEffect } from 'react';
import {
    Layout, Typography, Card, Table, Input, Button, Form, Select, DatePicker, Alert, Spin, Tabs, Upload, message, Modal
} from 'antd';
import { SearchOutlined, CloseOutlined, PlusOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

import UserTable from '../../components/UserTable';
import AddUserModal from '../../components/AddUserModal';
import UpdateUserModal from '../../components/UpdateUserModal';
import UserSearch from '../../components/UserSearch';
const { Header, Content } = Layout;
const { Title } = Typography;

function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [regYearFilter, setRegYearFilter] = useState(null);
    const [schoolFilter, setSchoolFilter] = useState(null);
    const [isBatchUploadVisible, setIsBatchUploadVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null)
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/admin/users?page=${pagination.current}&pageSize=${pagination.pageSize}${regYearFilter ? `®Year=${regYearFilter}` : ''}${schoolFilter ? `&school=${schoolFilter}` : ''}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUsers(data.users);
                setFilteredUsers(data.users)
                setPagination({ ...pagination, total: data.total });
                setLoading(false);
            } catch (e) {
                setError(e.message);
                setLoading(false);
            }
        };
         // Fetch data or set default users if there's an error
        if (!error) {
            fetchData();
        }
        else
        {
            setUsers(defaultUsers)
            setFilteredUsers(defaultUsers);
            setLoading(false)
        }
    }, [pagination.current, pagination.pageSize, regYearFilter, schoolFilter,error]);

    const defaultUsers = [
        { id: 1, admission_number: 'KABU/UG/2020/1234', full_name: 'John Doe', school_faculty: 'School of Medicine', email: 'john.doe@example.com', valid_until: '2024-12-31', is_active: true, reg_year: 2020 },
        { id: 2, admission_number: 'KABU/UG/2021/5678', full_name: 'Jane Smith', school_faculty: 'School of Engineering', email: 'jane.smith@example.com', valid_until: '2025-05-15', is_active: false, reg_year: 2021 },
        { id: 3, admission_number: 'KABU/UG/2020/9101', full_name: 'Alice Johnson', school_faculty: 'School of Business', email: 'alice.j@example.com', valid_until: '2024-11-20', is_active: true, reg_year: 2020 },
    ];

    const handleSearch = (value) => {
        setSearchText(value);
        const data = error ? defaultUsers : users
        const filteredData =  data.filter((user) =>
            user.admission_number.toLowerCase().includes(value.toLowerCase()) ||
            user.full_name.toLowerCase().includes(value.toLowerCase()) ||
            user.school_faculty.toLowerCase().includes(value.toLowerCase()) ||
            user.email.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filteredData);
    };

    const clearSearch = () => {
        setSearchText('');
        setFilteredUsers(error ? defaultUsers : users);
    };

    const handleTableChange = (newPagination) => {
        setPagination({ ...pagination, current: newPagination.current, pageSize: newPagination.pageSize });
    };

    const handleSchoolFilter = (value) => {
        setSchoolFilter(value);
    };

    const handleRegYearFilter = (value) => {
        setRegYearFilter(value);
    };

    const handleUpdateData = async (newUsers,newfilteredUsers)=>{
        setUsers(newUsers)
        setFilteredUsers(newfilteredUsers)
    }

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
                    Kabarak Student Welfare Management System - User Management
                </Title>
            </Header>
            <Content style={{ padding: '50px' }}>
                <div className="container">
                    <Title level={2} style={{ color: 'maroon', marginBottom: '20px', textAlign: 'center' }}>User Management</Title>

                    {/* Search and Add User */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <UserSearch
                            searchText={searchText}
                            handleSearch={handleSearch}
                            clearSearch={clearSearch}
                            error={error}
                        />
                        <Button type="primary" style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white' }} onClick={() => setIsBatchUploadVisible(true)}>
                            <PlusOutlined /> Add New User
                        </Button>
                    </div>
                     <AddUserModal
                        handleUpdateData = {handleUpdateData}
                        isBatchUploadVisible = {isBatchUploadVisible}
                        setIsBatchUploadVisible = {setIsBatchUploadVisible}
                        error = {error}
                     />
                    {/* User List Table */}
                    {loading && !error ? (
                        <div className="text-center">
                            <Spin size="large" />
                            <p className="mt-2">Loading user data...</p>
                        </div>
                    ) : error || users.length > 0 ? (
                         <UserTable
                            users={error ? defaultUsers : filteredUsers}
                            pagination={pagination}
                            handleTableChange={handleTableChange}
                            handleSchoolFilter={handleSchoolFilter}
                            handleRegYearFilter={handleRegYearFilter}
                            setFilteredUsers= {setFilteredUsers}
                            setUsers = {setUsers}
                            selectedUser = {selectedUser}
                            setSelectedUser = {setSelectedUser}
                            setIsModalVisible = {setIsModalVisible}
                            error = {error}
                         />
                    )
                         :(
                                <p>There are currently no Users in the system Click the Button Above to add one</p>
                            )}
                      <UpdateUserModal
                         isModalVisible = {isModalVisible}
                         selectedUser = {selectedUser}
                         handleCancel = {()=>setIsModalVisible(false)}
                         />
                </div>
            </Content>
        </Layout>
    );
}

export default UserManagementPage;