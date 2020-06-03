// import App from 'next/app'
import '../styles.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import 'nprogress/nprogress.css';
import 'sweetalert2/dist/sweetalert2.css'
import React from 'react';
import Router from 'next/router';
import App, { Container } from 'next/app';
import NProgress from 'nprogress';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faCheckSquare, faUsers } from '@fortawesome/free-solid-svg-icons'
library.add(fab, faCheckSquare, faUsers)

NProgress.configure({ showSpinner: true });

Router.onRouteChangeStart = () => {
  NProgress.start();
};

Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}


export default  MyApp