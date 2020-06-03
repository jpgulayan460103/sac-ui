import axios from './axios-settings'

export default {
  login(formdata){
    return axios.post(`${axios.custom_base_url}api/login`,formdata);
  },
  getUsers(){
    return axios.get(`${axios.custom_base_url}api/users`);
  }
}