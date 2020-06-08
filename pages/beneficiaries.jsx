import Head from 'next/head'
import React, { Component } from 'react';
import { Provider } from 'react-redux'
import Layouts from './../layouts/layouts'
import HheadTable from '../components/Hhead/HheadTable'
import store from '../store'


const index = () => {
  return (
    <Provider store={store}>
      <Head>
      <title>SAC Encoding | Social Amelioration Information System</title>
      </Head>
      <Layouts>
        <HheadTable />
      </Layouts>
    </Provider>
  );
};

export default index;
