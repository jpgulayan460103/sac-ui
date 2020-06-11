import axios from 'axios'
import ls from 'local-storage'


const customAxios = axios.create({
  baseURL: (process.env.NODE_ENV == "development" ? process.env.DEVELOPMENT_URL : process.env.PRODUCTION_URL)
});
if(ls('auth')){
  let token = ls('auth').createdToken.access_token;
  customAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
export default customAxios;