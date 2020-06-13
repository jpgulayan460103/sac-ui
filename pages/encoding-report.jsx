import Head from 'next/head'
import React, { Component } from 'react';
import { Provider } from 'react-redux'
import Layouts from './../layouts/layouts'
import HheadForm from '../components/Hhead/HheadForm'
import Encoded from '../components/Report/encoded'
import store from '../store'


const encodingReport = () => {
  return (
    <Provider store={store}>
      <Head>
        <title>Encoding Report | Social Amelioration Information System</title>
      </Head>
      <Layouts>
        <Encoded />
      </Layouts>
    </Provider>
  );
};

export default encodingReport;
