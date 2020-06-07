import axios from './axios-settings'
import moment from 'moment'
import _forEach from 'lodash/forEach'
import _cloneDeep from 'lodash/cloneDeep'

export default {
  
  save(formData, members, formType){
    let clonedMembers = _cloneDeep(members)
    let clonedFormData = _cloneDeep(formData)
    clonedFormData.kapanganakan = clonedFormData.kapanganakan ? moment(clonedFormData.kapanganakan).format("MM/DD/YYYY") : clonedFormData.kapanganakan;
    clonedFormData.bene_4ps = clonedFormData.bene_4ps ? "Y" : "N";
    clonedFormData.bene_others = clonedFormData.bene_others ? "Y" : "N";
    clonedFormData.bene_uct = clonedFormData.bene_uct ? "Y" : "N";
    clonedFormData.katutubo = clonedFormData.katutubo ? "Y" : "N";
    clonedFormData.petsa_ng_pagrehistro = clonedFormData.petsa_ng_pagrehistro ? moment(clonedFormData.petsa_ng_pagrehistro).format("MM/DD/YYYY") : clonedFormData.petsa_ng_pagrehistro;
    _forEach(clonedMembers, function(value, key) {
      clonedMembers[key].kapanganakan = clonedMembers[key].kapanganakan ? moment(clonedMembers[key].kapanganakan).format("MM/DD/YYYY") : clonedMembers[key].kapanganakan;
    });
    clonedFormData.members = clonedMembers;
    if(formType == "edit"){
      return this.update(clonedFormData, clonedFormData.id)
    }else{
      return this.create(clonedFormData)
    }
  },

  create(formData){
    return axios.post(`api/household-heads`,formData);
  },
  update(formData,id){
    return axios.put(`api/household-heads/${id}`,formData);
  },
  delete(id){
    return axios.delete(`api/barangay-officials/${id}`);
  },
  all(formData){
    return axios.get(`api/household-heads`,{
      params: formData
    });
  },
  getBarangay(){
    return axios.get(`api/barangays/dropdown`);
  },
  get(id){
    return axios.get(`api/barangay-officials/${id}`);
  },
  export(){
    return axios.post(`api/household-heads/export`);
  },
  
}