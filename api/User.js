import axios from './axios-settings'

export default {
  login(formdata){
    return axios.post(`api/login`,formdata);
  },
  getUsers(){
    return axios.get(`api/users`);
  },
  logout(){
    return axios.post(`api/logout`);
  },
}