import React from 'react';
import { Table, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import PropTypes from 'prop-types';
import ColumnData from '../utils/ColumnData';

function UserTable({ users, pagination, handleTableChange,handleSchoolFilter,handleRegYearFilter,setFilteredUsers,setUsers, selectedUser,setSelectedUser,setIsModalVisible,error}) {
    const handleRevokeAccess = async (record) => {
        console.log(`Revoke access for user: ${record.admission_number}`);
    };

    const handleGrantAccess = async (record) => {
        console.log(`Grant access for user: ${record.admission_number}`);
    };

    const handleUpdateInfo = async (record) => {
        setSelectedUser(record)
        setIsModalVisible(true);
    };
        const columns = ColumnData(handleRevokeAccess,handleGrantAccess,handleUpdateInfo,error);

    return (
        <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            aria-label="User List"
            pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                onChange: handleTableChange,
            }}
             onChange={(pagination, filters, sorter) => {
                    if (filters.reg_year) {
                        handleRegYearFilter(filters.reg_year[0]);
                    } else {
                        handleRegYearFilter(null);
                    }
                }}
        />
    );
}

UserTable.propTypes = {
  users: PropTypes.array,
  pagination: PropTypes.object,
  handleTableChange: PropTypes.func,
  handleSchoolFilter: PropTypes.func,
  handleRegYearFilter: PropTypes.func,
  setFilteredUsers: PropTypes.func,
  setUsers: PropTypes.func,
  selectedUser: PropTypes.object,
  setSelectedUser: PropTypes.func,
  setIsModalVisible: PropTypes.func,
  error: PropTypes.any,
};
export default UserTable;