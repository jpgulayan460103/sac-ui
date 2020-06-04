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
  getBarangays(province_psgc, city_psgc){
    return axios.get(`provinces/${province_psgc}/cities/${city_psgc}/barangays`);
  },
  getProvinces(){
    return axios.get(`provinces`);
  },
  getCities(province_psgc){
    return axios.get(`provinces/${province_psgc}/cities`);
  },
  get(id){
    return axios.get(`api/barangay-officials/${id}`);
  }
}