import Head from 'next/head'
import Headers from '../components/Headers'
import Menus from '../components/Menus'
import { Provider } from 'react-redux'
import {useEffect,useState} from 'react'
import ls from 'local-storage'
import Router from 'next/router'
import { Layout, BackTop  } from "antd";
import queryString from "query-string";
import { useRouter } from 'next/router'

const { Header, Content, Footer, Sider } = Layout;


import store from '../store'
const Layouts = ({children}) => {
  useEffect(() => {

  }, []);

  return (
    <Provider store={store}>
      <Headers />
      <div className="main-layout-container">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {children}
            </div>
          </div>
        </div>
      </div>
    </Provider>
  );
}
export default Layouts;
