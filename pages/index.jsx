import Head from 'next/head'
import React, { Component } from 'react';
import { Provider } from 'react-redux'
import Layouts from './../layouts/layouts'
import HheadForm from '../components/Hhead/HheadForm'
import store from '../store'

export class index extends Component {
  constructor(props){
    super(props);
    this.state = {
      
    }
  }
  render() {
    
    return (
      <Provider store={store}>
        <Head>
          <title>Dashboard</title>
        </Head>
        <Layouts>
          <HheadForm viewStatus="edit" />
        </Layouts>
      </Provider>
    );
  }
}

export default index;
