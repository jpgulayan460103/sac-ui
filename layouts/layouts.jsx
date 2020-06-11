import Head from 'next/head'
import Headers from '../components/Headers'
import AuthChecker from '../components/AuthChecker'
import EncodingGuidelines from '../components/EncodingGuidelines'
import { Provider } from 'react-redux'
import { Layout, BackTop  } from "antd";


import store from '../store'
const Layouts = (props) => {
  return (
    <Provider store={store}>
      <AuthChecker />
      <EncodingGuidelines />
      <Headers />
      
      <div className="main-layout-container">
        <div className="container">
          <div className="row justify-content-center align-items-center p-3">
            <img className="h-16" src="/images/logo.png" alt=""/>
          </div>
          <div className="row">
            <div className="col-md-12">
              {props.children}
            </div>
            <div className="col-md-12">
            </div>
          </div>
        </div>
      </div>
      
    </Provider>
  );
}
export default Layouts;
