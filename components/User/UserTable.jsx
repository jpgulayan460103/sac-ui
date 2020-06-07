import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import API from './../../api'
import { Table, Tag, Button } from 'antd';

import {
  HomeOutlined,
  SettingFilled,
  SmileOutlined,
  UnlockOutlined,
  LockOutlined,
} from '@ant-design/icons';


function mapStateToProps(state) {
  return {
    
  };
}
const handleClick = () => {}
const UserTable = (props) => {
  useEffect(() => {
    getUser();
  }, []);

  const [users, setUsers] = useState([]);

  const getUser = () => {
    API.User.getUsers()
    .then(res => {
      setUsers(res.data.users);
    })
    .catch(res => {})
    .then(res => {})
    ;
  }

  const toggleUser = (user) => {
    API.User.toggleUser(user)
    .then(res => {
      getUser();
    })
    .catch(res => {})
    .then(res => {})
  }

  const dataSource = users;
  
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Status',
      key: 'status',
      render: (text, record) => (
        <span>
          <Button onClick={() => {toggleUser(record)} }>
            { record.confirmed == 1 ? (<span><UnlockOutlined /> Active</span>) : (<span><LockOutlined /> Inactive</span>) }
          </Button>
        </span>
      ),
    },
  ];
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} />  
    </div>
  );
}



export default connect(
  mapStateToProps,
)(UserTable);