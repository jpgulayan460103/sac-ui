import Head from 'next/head'
import Headers from '../components/Headers'
import AuthChecker from '../components/AuthChecker'
import Menus from '../components/Menus'
import { Provider } from 'react-redux'
import { Layout, BackTop  } from "antd";


import store from '../store'
const Layouts = ({children}) => {
  return (
    <Provider store={store}>
      <AuthChecker />
      <Headers />
      <div className="main-layout-container">
        <div className="container">
          <div className="row justify-content-center align-items-center p-3">
            <img className="h-16" src="/images/logo.png" alt=""/>
          </div>
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
