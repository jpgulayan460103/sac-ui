import axios from './axios-settings'

export default {
  
  add(formdata){
    return axios.post(`api/barangay-officials`,formdata);
  },
  update(formdata,id){
    return axios.put(`api/barangay-officials/${id}`,formdata);
  },
  delete(id){
    return axios.delete(`api/barangay-officials/${id}`);
  },
  all(formData){
    return axios.get(`api/barangay-officials`,{
      params: formData
    });
  },
  getBarangay(){
    return axios.get(`api/barangays/dropdown`);
  },
  get(id){
    return axios.get(`api/barangay-officials/${id}`);
  }
}