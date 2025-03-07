import React from 'react';
import { Input, Button } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

function UserSearch({ searchText, handleSearch, clearSearch, error }) {
    return (
        <div className="flex items-center">
            <Input
                placeholder="Search users"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                disabled={error}
            />
            {searchText && (
                <Button
                    icon={<CloseOutlined />}
                    onClick={clearSearch}
                    style={{ marginLeft: 8 }}
                    disabled={error}
                />
            )}
        </div>
    );
}

UserSearch.propTypes = {
  searchText: PropTypes.string,
  handleSearch: PropTypes.func,
  clearSearch: PropTypes.func,
  error: PropTypes.any,
};

export default UserSearch;