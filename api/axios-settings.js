import axios from 'axios'
import ls from 'local-storage'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import Router from 'next/router'
import NProgress from 'nprogress';


axios.defaults.baseURL = (process.env.NODE_ENV == "development" ? process.env.DEVELOPMENT_URL : process.env.PRODUCTION_URL);

if(ls('auth')){
  let token = ls('auth').createdToken.access_token;
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  axios.interceptors.response.use((response) => {
    NProgress.start();
    return response;
  }, (error) => {
    if (error.response && error.response.status == 401) {
      NProgress.done();
      Swal.fire({
        title: 'Unauthorized',
        text: 'You are not logged in or the session may have been expired.',
        icon: 'warning',
        confirmButtonText: 'Click to Login',
        onClose: () => {
          ls.remove('auth')
          Router.push('/login')
        }
      })
    }else if (error.response && error.response.status == 403) {
      Swal.fire({
        title: 'Forbidden',
        text: 'You do not have permission to access this page.',
        icon: 'warning',
        confirmButtonText: 'Back to Home',
        onClose: () => {
          Router.push('/')
        }
      })
    }else if (error.response && error.response.status >= 500) {
      Swal.fire({
        title: 'Oops...',
        text: 'Something went wrong. Please report this to your technical support',
        icon: 'error',
        confirmButtonText: 'Ok',
      })
    }else if (!error.response || !error.response.status) {
      Swal.fire({
        title: 'Oops...',
        text: 'Check your internet connection',
        icon: 'error',
        confirmButtonText: 'Ok',
      })
    }
    return Promise.reject(error);
  });
}

axios.interceptors.response.use(function (response) {
  NProgress.done();
  return response;
}, function (error) {
  return Promise.reject(error);
});
export default axios;