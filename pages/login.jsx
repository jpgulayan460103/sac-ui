import Head from 'next/head'
import React, { useEffect } from 'react';
import LoginForm from '../components/LoginForm'
import { Provider } from 'react-redux'
import store from '../store'
import Layouts from './../layouts/layouts'
import ls from 'local-storage'
import Router from 'next/router'
import { Typography } from 'antd';
const { Title } = Typography;

const login = (props) => {
  useEffect(() => {
    if(ls('auth')){
      Router.push('/')
    }
  }, []);
  return (
    <Provider store={store}>
      <Head>
        <title>Login</title>
      </Head>
      <div className="main-layout-container">
        <div className="container" style={{ minHeight: "95vh"}}>
          <div className="row justify-content-center align-items-center p-5">
            <img src="/images/logo.png" alt=""/>
          </div>
          <div className="row justify-content-center">
            <Title>Social Amelioration Information System</Title>
          </div>
          <div className="row h-100 p-10">
            <div className="col-6">
            <Title level={3} style={{textAlign:"center"}}>Login Form</Title>
            <LoginForm />
            </div>
            <div className="col-6">
            <Title level={3} style={{textAlign:"center"}}>Registration Form</Title>
            <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </Provider>
  );
};
export default login;
