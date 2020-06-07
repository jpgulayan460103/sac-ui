import axios from './axios-settings'

export default {
  login(formdata){
    return axios.post(`api/login`,formdata);
  },
  save(formdata){
    return axios.post(`api/users`,formdata);
  },
  getUsers(){
    return axios.get(`api/users`);
  },
  logout(){
    return axios.post(`api/logout`);
  },
  toggleUser(user){
    return axios.post(`api/users/active-status/${user.id}`);
  },
}