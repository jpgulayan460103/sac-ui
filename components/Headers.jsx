import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router'
import ls from 'local-storage'
import API from '../api'

import {
  HomeOutlined,
  SettingFilled,
  UnorderedListOutlined,
  UserOutlined,
  CaretDownOutlined,
  QuestionCircleOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';

import { Menu, Dropdown } from 'antd';


function mapStateToProps(state) {
  return {
    
  };
}



const MenuIcon = (props) => {
  return (
    <span className="space-x-1">
      <span>{props.icon}</span>
    </span>
  );
}

const Headers = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [user, setUser] = useState({});
  const toggle = () => setIsOpen(!isOpen);
  useEffect(() => {
    let loggedUser = ls('auth');
    setUser(loggedUser);
  }, []);

  const showDrawer = () => {
    console.log("asdhasdh");
    
    props.dispatch({
      type: "SHOW_GUIDELINES",
      data: true
    });
  };

  const menu = (user) => (
    <React.Fragment>
    <Menu>
      <Menu.Item>
        <UserOutlined style={{ fontSize: '18px' }} /> { (user ? user.username : "") }
      </Menu.Item>
      <Menu.Item>
        <a rel="noopener noreferrer" onClick={() => { Router.push('/') }}>
        <UnorderedListOutlined style={{ fontSize: '18px' }} /> SAC Encoding
        </a>
      </Menu.Item>
      <Menu.Item>
        <a rel="noopener noreferrer" onClick={() => { Router.push('/beneficiaries') }}>
        <UnorderedListOutlined style={{ fontSize: '18px' }} /> Encoded SAC Forms
        </a>
      </Menu.Item>
      <Menu.Item>
        <a rel="noopener noreferrer"  onClick={() => {showDrawer()}}>
        <QuestionCircleOutlined style={{ fontSize: '18px' }} /> Encoding Guidelines
        </a>
      </Menu.Item>
      <Menu.Item>
        <a rel="noopener noreferrer" onClick={() => { logout() }}>
        <PoweroffOutlined style={{ fontSize: '18px' }} /> Logout
        </a>
      </Menu.Item>
    </Menu>
    </React.Fragment>
  );

  const logout = () => {
    API.User.logout()
    .then(res => {
      props.dispatch({
        type: "SET_INITIAL_STATE",
        data: {}
      });
      ls.remove('auth');
      Router.push('/login')
    })
    .catch(res => {})
    .then(res => {})
    ;
  }

  return (
    <div>
      <div className="h-auto">
        <div className="container">
          <div>
            &nbsp;
            <div className="float-left">
              <b className="text-lg">
                <a style={{textDecoration:"none",color:"inherit"}} onClick={() => {Router.push('/')}}>Social Amelioration Information System</a>
              </b>
            </div>
            <div className="float-right space-x-4">

              <Dropdown overlay={menu(user)} trigger={['click']} placement="bottomRight">
                <a className="px-1 ">Menu <MenuIcon icon={<CaretDownOutlined />} label="Menu" /></a>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(
  mapStateToProps,
)(Headers);