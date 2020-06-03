import Head from 'next/head'
import React, { Component } from 'react';
import { Provider } from 'react-redux'
import store from '../store'
import Layouts from './../layouts/layouts'
import BeneficiaryForm from '../components/Beneficiary/BeneficiaryForm'

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
          <BeneficiaryForm />
        </Layouts>
      </Provider>
    );
  }
}

export default index;
