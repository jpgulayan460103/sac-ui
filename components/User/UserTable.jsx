import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import API from './../../api'
import { Table, Typography, Button, Modal } from 'antd';
import ls from 'local-storage'
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
  const [user, setUser] = useState({});
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);


  const getUser = () => {
    API.User.getUsers()
    .then(res => {
      setUsers(res.data.users.data);
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
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Status',
      key: 'status',
      align: "right",
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
  return (
    <div>
      <Title level={2} style={{textAlign: "center"}}>Users</Title>
      <Table dataSource={dataSource} columns={columns} />
      <Modal
          title="Update users"
          visible={showForm}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <RegistrationForm userData={userData} />
        </Modal>
    </div>
  );
}



export default connect(
  mapStateToProps,
)(UserTable);