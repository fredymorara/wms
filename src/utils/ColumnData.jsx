import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';

function ColumnData(handleRevokeAccess,handleGrantAccess,handleUpdateInfo,error) {
    const columns = [
        {
            title: 'Admission Number',
            dataIndex: 'admission_number',
            key: 'admission_number',
        },
        {
            title: 'Full Name',
            dataIndex: 'full_name',
            key: 'full_name',
        },
        {
            title: 'School/Faculty',
            dataIndex: 'school_faculty',
            key: 'school_faculty',
        },
        {
            title: 'Registration Year',
            dataIndex: 'reg_year',
            key: 'reg_year',
            filters: [...new Set([2020, 2021, 2022, 2023])]
             .map(year => ({ text: year, value: year })),
            onFilter: (value, record) => record.reg_year === value,
        },
        {
            title: 'Valid Until',
            dataIndex: 'valid_until',
            key: 'valid_until',
            render: (text) => text || 'N/A',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <>
                    <Button type="primary" onClick={() => handleRevokeAccess(record)} style={{ backgroundColor: 'red', borderColor: 'red', color: 'white', marginRight: 8 }} disabled={error}>
                        Revoke Access
                    </Button>
                    <Button type="primary" onClick={() => handleGrantAccess(record)} style={{ backgroundColor: 'green', borderColor: 'green', color: 'white', marginRight: 8 }} disabled={error}>
                        Grant Access
                    </Button>
                     <Button type="primary" onClick={() => handleUpdateInfo(record)} style={{ backgroundColor: 'maroon', borderColor: 'maroon', color: 'white', marginRight: 8 }} disabled={error}>
                        Update Info
                    </Button>
                </>
            ),
        },
    ];
    return columns

}

ColumnData.propTypes = {
  handleRevokeAccess: PropTypes.func,
  handleGrantAccess: PropTypes.func,
  handleUpdateInfo: PropTypes.func,
  error: PropTypes.any,
};

export default ColumnData;