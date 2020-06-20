import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import API from './../../api'
import { Table, Typography, Button, Modal } from 'antd';
import ls from 'local-storage'
import _isEmpty from 'lodash/isEmpty'
import RegistrationForm from './../RegistrationForm'
const { Title } = Typography;

import {
  HomeOutlined,
  SettingFilled,
  UserOutlined,
  UnlockOutlined,
  LockOutlined,
  FireOutlined,
} from '@ant-design/icons';


function mapStateToProps(state) {
  return {
    
  };
}
const handleClick = () => {}
const UserTable = (props) => {
  useEffect(() => {
    getUser();
    let auth = ls('auth');
    if(auth){
      setUser(auth);
    }
  }, []);
  

  const [users, setUsers] = useState([]);
  const [usersTable, setUsersTable] = useState([]);
  const [user, setUser] = useState({});
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);


  const getUser = () => {
    API.User.getUsers()
    .then(res => {
      let users_response = res.data.users.data;
      users_response.map(item => {
        item.key = item.id;
        return item;
      })
      setUsers(users_response);
      setUsersTable(users_response);
    })
    .catch(res => {})
    .then(res => {})
    ;
  }

  const toggleStatusUser = (user) => {
    setLoading(true);
    API.User.toggleStatusUser(user)
    .then(res => {
      setLoading(false);
      getUser();
    })
    .catch(res => {
      setLoading(false);
    })
    .then(res => {
      setLoading(false);
    })
  }
  const toggleRoleUser = (user) => {
    setLoading(true);
    API.User.toggleRoleUser(user)
    .then(res => {
      setLoading(false);
      getUser();
    })
    .catch(res => {
      setLoading(false);
    })
    .then(res => {
      setLoading(false);
    })
  }

  const handleOk = e => {
    setShowForm(false);
    getUser();
  };

  const  handleCancel = e => {
    setShowForm(false);
    getUser();
  };

  const editUser = (user) => {
    setUserData(user);
    setShowForm(true);
  }

  const dataSource = usersTable;
  
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => { return a.name.localeCompare(b.name)},
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => { return a.username.localeCompare(b.username)},
    },
    {
      title: 'Position',
      key: 'position',
      filters: [
        { text: 'Field Staff', value: 'Field Staff' },
        { text: 'LGU Barangay Staff', value: 'LGU Barangay Staff' },
        { text: 'LGU Municipality Staff', value: 'LGU Municipality Staff' },
      ],
      onFilter: (value, record) => record.position.indexOf(value) === 0,
      render: (text, record) => (
        <span>
          {record.position}
          {record.position == "LGU Barangay Staff" ? (
            <>
              <br />
              {`${record.barangay.barangay_name}, ${record.barangay.city_name}`}
            </>
          ) : ""}
          {record.position == "LGU Municipality Staff" ? (
            <>
              <br />
              {`${record.barangay.city_name}, ${record.barangay.province_name}`}
            </>
          ) : ""}
        </span>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      align: "right",
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (text, record) => (
        <span>
          <Button onClick={() => { editUser(record) } }>
            Edit
          </Button>
          <Button onClick={() => {toggleStatusUser(record)} } disabled={loading || user.id == record.id} loading={loading} >
            { record.confirmed == 1 ? (<span><UnlockOutlined /> Active</span>) : (<span><LockOutlined /> Inactive</span>) }
          </Button>
          { record.position == "Field Staff" ? (
            <Button onClick={() => {toggleRoleUser(record)} } disabled={loading || user.id == record.id} loading={loading} >
              { record.role == "admin" ? (<span><FireOutlined /> Admin</span>) : (<span><UserOutlined /> User</span>) }
            </Button>
          ) : "" }
        </span>
      ),
    },
  ];
  
  const handleTableChange = (pagination, filters, sorter) => {
    console.log(filters);
  }
  return (
    <div>
      <Title level={2} style={{textAlign: "center"}}>Users</Title>
      <Table dataSource={dataSource} columns={columns} onChange={handleTableChange} />
      <Modal
          title="Update users"
          visible={showForm}
          onOk={handleOk}
          onCancel={handleCancel}
        >
        <RegistrationForm userData={userData} type="update" />
      </Modal>
    </div>
  );
}



export default connect(
  mapStateToProps,
)(UserTable);