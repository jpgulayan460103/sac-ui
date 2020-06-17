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
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Position',
      key: 'position',
      filters: [
        { text: 'Field Staff', value: 'field_staff' },
        { text: 'LGU Staff', value: 'lgu_staff' },
      ],
      render: (text, record) => (
        <span>
          {record.position}
          { record.position == "LGU Staff" ? (
            <>
              <br />
              {`${record.barangay.barangay_name}, ${record.barangay.city_name}`}
            </>
          ) : "" }
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
    
    let currentUsers = usersTable;
    if(filters.status){
      let has_active = filters.status.filter(item => item == "active")
      let has_inactive = filters.status.filter(item => item == "inactive")
      has_active = !_isEmpty(has_active);
      has_inactive = !_isEmpty(has_inactive);
      if(has_active && has_inactive){
        setUsersTable(currentUsers);
      }else if(has_active){
        setUsersTable(currentUsers.filter(item => item.confirmed == 1))
      }else{
        setUsersTable(currentUsers.filter(item => item.confirmed == 0))
      }
    }
    if(filters.position){
      let has_field_staff = filters.position.filter(item => item == "field_staff")
      let has_lgu_staff = filters.position.filter(item => item == "lgu_staff")
      has_field_staff = !_isEmpty(has_field_staff);
      has_lgu_staff = !_isEmpty(has_lgu_staff);
      if(has_field_staff && has_lgu_staff){
        setUsersTable(currentUsers);
      }else if(has_field_staff){
        setUsersTable(currentUsers.filter(item => item.position == "Field Staff"))
      }else{
        setUsersTable(currentUsers.filter(item => item.position == "LGU Staff"))
      }
    }
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