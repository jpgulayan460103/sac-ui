import Head from 'next/head'
import React, { Component } from 'react';
import { Provider } from 'react-redux'
import Layouts from './../layouts/layouts'
import UserTable from '../components/User/UserTable'
import store from '../store'


const users = () => {
  return (
    <Provider store={store}>
      <Head>
      <title>Users | Social Amelioration Information System</title>
      </Head>
      <Layouts>
        <UserTable />
      </Layouts>
    </Provider>
  );
};

export default users;
