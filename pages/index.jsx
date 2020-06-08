import Head from 'next/head'
import React, { Component } from 'react';
import { Provider } from 'react-redux'
import Layouts from './../layouts/layouts'
import HheadForm from '../components/Hhead/HheadForm'
import store from '../store'


const index = () => {
  return (
    <Provider store={store}>
      <Head>
        <title>Encoded Beneficiaries | Social Amelioration Information System</title>
      </Head>
      <Layouts>
        <HheadForm viewStatus="edit" />
      </Layouts>
    </Provider>
  );
};

export default index;
