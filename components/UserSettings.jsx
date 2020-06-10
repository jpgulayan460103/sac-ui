import React, {useEffect, useState} from 'react';
import Router from 'next/router'
import ls from 'local-storage'
import { Modal } from 'antd';
import RegistrationForm from '../components/RegistrationForm'

const UserSettings = (props) => {
  const [showForm, setShowForm] = useState(false);
  const [userData, setUserData] = useState({});
  useEffect(() => {
    let user = ls('auth');
    setUserData(user);
  }, []);
  useEffect(() => {
    setShowForm(props.showForm)
  }, [props.showForm]);
  const handleOk = e => {
    props.hideForm(false);
    setShowForm(false);
  };
  const  handleCancel = e => {
    props.hideForm(false);
    setShowForm(false);
  };
  return (
    <Modal
      mask={false}
      title="Account Settings"
      visible={showForm}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <RegistrationForm userData={userData} type="user" />
    </Modal>
  );
};

export default UserSettings;