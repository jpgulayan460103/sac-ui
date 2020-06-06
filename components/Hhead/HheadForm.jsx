import React, { useState,useEffect} from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router'
import { Form, Input, Button, Divider, Select, DatePicker, Typography, Checkbox, Radio, InputNumber   } from 'antd';
import { ArrowLeftOutlined, SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import API from '../../api'
import _forEach from 'lodash/forEach'
import _map from 'lodash/map'
import _isEmpty from 'lodash/isEmpty'
import _debounce from 'lodash/debounce'
import _cloneDeep from 'lodash/cloneDeep'
import moment from 'moment';
import queryString from "query-string";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import Router from 'next/router'
import HmemberForm from './HmemberForm'

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;


function mapStateToProps(state) {
  return {
    formData: state.hhead.formData,
    formError: state.hhead.formError,
    members: state.hhead.members,
    formStatus: state.hhead.formStatus,
  };
}
const handleClick = () => {}

const onFinishFailed = (value) => {}
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const HheadForm = (props) => {

  const [formData, setFormData] = useState({});
  const [submit, setSubmit] = useState(false);
  const [membersCount, setMembersCount] = useState(1);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const formRef = React.useRef();
  const secondFormRef = React.useRef();
  useEffect(() => {
    if(props.viewStatus == "edit"){
      formRef.current.setFieldsValue({
        ...props.formData
      });
      secondFormRef.current.setFieldsValue({
        ...props.formData
      });
    }
  }, [props.formData]);
  useEffect(() => {
    if(props.viewStatus == "view"){
      formRef.current.setFieldsValue({
        ...props.viewData
      });
      secondFormRef.current.setFieldsValue({
        ...props.viewData
      });
    }
  }, [props.viewStatus]);
  useEffect(() => {
    getProvinces();
  }, []);
  const getProvinces = () => {
    API.Barangay.getProvinces()
    .then(res => {
      setProvinces(res.data.provinces);
    })
    .catch(res => {
    })
    .then(res => {})
    ;;
  }
  const getCities = (e) => {
    setCities([]);
    API.Barangay.getCities(e)
    .then(res => {
      setCities(res.data.cities);
    })
    .catch(res => {
    })
    .then(res => {})
    ;;
  }
  const getBarangays = (city_psgc) => {
    setBarangays([]);
    let province_psgc = props.formData.probinsya;
    API.Barangay.getBarangays(province_psgc,city_psgc)
    .then(res => {
      setBarangays(res.data.barangays);
    })
    .catch(res => {
    })
    .then(res => {})
    ;;
  }

  const populateProvinces = () => {
    let items = [];
    provinces.map(item => {
      items.push(<Option value={item.province_psgc} key={item.province_psgc}>{item.province_name}</Option>);
    })
    return items;
  }
  const populateCities = () => {
    let items = [];
    cities.map(item => {
      items.push(<Option value={item.city_psgc} key={item.city_psgc}>{item.city_name}</Option>);
    })
    return items;
  }
  const populateBarangays = () => {
    let items = [];
    barangays.map(item => {
      items.push(<Option value={item.barangay_psgc} key={item.barangay_psgc}>{item.barangay_name}</Option>);
    })
    return items;
  }
  const pad = (str, max) => {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
  }
  const setFormFields = (e) => {
    props.dispatch({
      type: "SET_HMEMBER_FORM_STATUS",
      data: "old"
    })
    let transformedValue = {};
    _forEach(e, function(value, key) {
      if(typeof value == "string"){
        switch (key) {
          case 'sektor':
          case 'kondisyon_ng_kalusugan':
          case 'uri_ng_id':
          case 'katutubo_name':
            transformedValue[key] = value;
            break;
          default:
            transformedValue[key] = value.toUpperCase();
            break;
        }
      }else{
        transformedValue[key] = value;
      }
      if(key == "sac_number"){
        transformedValue[key] = pad(parseInt(value), 8); ;
      }
      if(key == "kapanganakan" || key == "petsa_ng_pagrehistro"){
        transformedValue[key] = moment.parseZone(value).utc();
        if(key == "kapanganakan"){
          let age = getAge(transformedValue[key].format("YYYY/MM/DD"));
          transformedValue['age'] = age;
          if(age < 0){
            transformedValue[key] = moment().utc();
            transformedValue['age'] = 0;
          }else if((age<8 || age>55) && (props.formData.sektor == "B - Buntis" || props.formData.sektor == "C - Nagpapasusong Ina")){
            transformedValue['sektor'] = "";
          }else if(age<60 && props.formData.sektor == "A - Nakatatanda"){
            transformedValue['sektor'] = "";
          }
        }
      }
      if(key == "katutubo" &&  !value){
        transformedValue['katutubo_name']  = "";
      }
      if(key == "bene_others" &&  !value){
        transformedValue['others_name']  = "";
      }
      if(key == "kasarian" && value == "M" ){
        if(props.formData.sektor == "B - Buntis" || props.formData.sektor == "C - Nagpapasusong Ina"){
          transformedValue['sektor']  = "";
        }
      }
    });
    let formData  = props.formData;
    props.dispatch({
      type: "SET_HHEAD_FORM_DATA",
      data: {
        ...props.formData,
        ...transformedValue
      }
    })
  }
  const formSubmit = _debounce(() => {
    setSubmit(true);
    let formData = props.formData;
    let members = props.members;
    API.Hhead.save(formData, members)
    .then(res => {
      setSubmit(false);
      let newForm = {};
      newForm.probinsya = props.formData.probinsya;
      newForm.lungsod = props.formData.lungsod;
      newForm.barangay = props.formData.barangay;
      newForm.pangalan_ng_punong_barangay = props.formData.pangalan_ng_punong_barangay;
      newForm.pangalan_ng_lswdo = props.formData.pangalan_ng_lswdo;
      newForm.petsa_ng_pagrehistro = props.formData.petsa_ng_pagrehistro;
      props.dispatch({
        type: "SET_HHEAD_FORM_DATA",
        data: newForm
      })
      formRef.current.resetFields();
      formRef.current.setFieldsValue({
        ...newForm
      });
      secondFormRef.current.resetFields();
      secondFormRef.current.setFieldsValue({
        ...newForm
      });
      if(membersCount>0){
        setMembersCount(1);
        props.dispatch({
          type: "ADD_HMEMBERS",
          data: {
            0:{
              type: "new",
            }
          }
        })
      } 
      props.dispatch({
        type: "SET_HMEMBER_FORM_STATUS",
        data: "new"
      })

      props.dispatch({
        type: "HHEAD_FORM_ERROR",
        data: {}
      })
    })
    .catch(err => {
      setSubmit(false);
      if(err.response){
        props.dispatch({
          type: "HHEAD_FORM_ERROR",
          data: err.response.data.errors
        })
      }
    })
    .then(res => {
      setSubmit(false);
    })
    ;
  }, 250)
  const displayErrors = (field) => {
    if(props.formError[field]){
      return {
        validateStatus: 'error',
        help: props.formError[field][0]
      }
    }
  }

  const getAge = (dateString) => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }

  const addMember = () => {
    setMembersCount(membersCount + 1);
    let members = props.members;
    members[membersCount] = {
      type: "new",
    };
    props.dispatch({
      type: "ADD_HMEMBERS",
      data: {
        ...props.members,
        ...members
      }
    }) 
  }
  const removeLastMember = () => {
    if(membersCount > 0){
      setMembersCount(membersCount - 1);
      let membersObjectCount = Object.keys(props.members).length;
      
      let members = props.members;
      delete members[membersObjectCount-1];
      // members[membersObjectCount] = {};
      props.dispatch({
        type: "ADD_HMEMBERS",
        data: {
          ...props.members,
          ...members
        }
      }) 
    }
  }

  const populateMembers = () => {
    let items = [];
    for (let index = 0; index < membersCount; index++) {
      items.push(<HmemberForm memberIndex={index} key={index} />);    
    }
    if(membersCount == 0){
      return (
        <Input.Group compact>
          <Form.Item  style={{ width: '10%' }} label="Last Name">
          </Form.Item>
          <Form.Item  style={{ width: '10%' }} label="First Name">
          </Form.Item>
          <Form.Item  style={{ width: '10%' }} label="Middle Name">
          </Form.Item>
          <Form.Item  style={{ width: '5%' }} label="Ext">
          </Form.Item>
          <Form.Item  style={{ width: '15%' }} label="Relasyon">
          </Form.Item>
          <Form.Item  style={{ width: '15%' }} label="Kapanganakan">
          </Form.Item>
          <Form.Item  style={{ width: '5%' }} label="Kasarian">
          </Form.Item>
          <Form.Item  style={{ width: '15%' }} label="Trabaho">
          </Form.Item>
          <Form.Item  style={{ width: '9.5%' }} label="Sektor">
          </Form.Item>
          <Form.Item  style={{ width: '5%' }} label="Kondisyon ng Kalusugan">
          </Form.Item>
        </Input.Group>
      )
    }
    return items;
  }

  return (
    <div>
      <Form disabled={props.viewStatus == "view"} ref={formRef} name="basic" onValuesChange={setFormFields} onFinish={formSubmit} size="small" >
      <Title level={2} style={{textAlign: "center"}}>Social Amelioration Card (SAC)</Title>
        <Input.Group compact>
          <Form.Item  style={{ width: '20%' }} label="Apelyido" name="last_name" hasFeedback {...displayErrors('last_name')}>
            <Input autoComplete="off" placeholder="Apelyido" />
          </Form.Item>
          <Form.Item  style={{ width: '20%' }} label="Pangalan" name="first_name" hasFeedback {...displayErrors('first_name')}>
            <Input autoComplete="off" placeholder="Pangalan" />
          </Form.Item>
          <Form.Item  style={{ width: '20%' }} label="Gitnang Pangalan" name="middle_name" hasFeedback {...displayErrors('middle_name')}>
            <Input autoComplete="off" placeholder="Gitnang Pangalan" />
          </Form.Item>
          <Form.Item  style={{ width: '20%' }} label="Ext" name="ext_name" hasFeedback {...displayErrors('ext_name')}>
            <Input autoComplete="off" placeholder="Ext" />
          </Form.Item>
          <Form.Item  style={{ width: '19.3%' }} label="Kasarian" name="kasarian" {...displayErrors('kasarian')}>
            <Radio.Group>
              <Radio value={"M"}>
                Lalaki
              </Radio>
              <Radio value={"F"}>
                Babae
              </Radio>
            </Radio.Group>
          </Form.Item>
        </Input.Group>
        <Input.Group compact>
          <Form.Item style={{ width: '33%' }} label="Tirahan" name="tirahan" hasFeedback {...displayErrors('tirahan')}>
            <Input autoComplete="off" placeholder="Tirahan" />
          </Form.Item>
          <Form.Item style={{ width: '33%' }} label="Kalye" name="kalye" hasFeedback {...displayErrors('kalye')}>
            <Input autoComplete="off" placeholder="Kalye" />
          </Form.Item>
          <Form.Item style={{ width: '33%' }} label="Uri ng ID" name="uri_ng_id" hasFeedback {...displayErrors('uri_ng_id')}>
            <Select placeholder="Uri ng ID" showSearch optionFilterProp="children" style={{ width: '100%' }} filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
              <Option value="Others">Others</Option>
              <Option value="Barangay Certification">Barangay Certification</Option>
              <Option value="Driver's License">Driver's License</Option>
              <Option value="Employment ID">Employment ID</Option>
              <Option value="GSIS UMID">GSIS UMID</Option>
              <Option value="NCIP Certification">NCIP Certification</Option>
              <Option value="OFW">OFW</Option>
              <Option value="Passport">Passport</Option>
              <Option value="PhilHealth">PhilHealth</Option>
              <Option value="Postal">Postal</Option>
              <Option value="PRC">PRC</Option>
              <Option value="PWD">PWD</Option>
              <Option value="Senior Citizen">Senior Citizen</Option>
              <Option value="Solo Parent">Solo Parent</Option>
              <Option value="SSS UMID">SSS UMID</Option>
              <Option value="TIN">TIN</Option>
              <Option value="Voter's ID">Voter's ID</Option>
            </Select>
          </Form.Item>
        </Input.Group>
        <Input.Group compact>
          <Form.Item style={{ width: '33%' }} label="Probinsya" name="probinsya" {...displayErrors('probinsya')}>
          <Select allowClear placeholder="Probinsya" style={{ width: '100%' }} onChange={(e) => getCities(e)} disabled={props.formData.lungsod && props.formData.lungsod != ""} showSearch optionFilterProp="children" filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
            { populateProvinces() }
          </Select>
          </Form.Item>
          <Form.Item style={{ width: '33%' }} label="Lungsod/Bayan" name="lungsod" {...displayErrors('lungsod')}>
            <Select allowClear placeholder="Lungsod/Bayan" style={{ width: '100%' }} onChange={(e) => getBarangays(e)}  disabled={props.formData.barangay && props.formData.barangay != ""} showSearch optionFilterProp="children" filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
              { populateCities() }
            </Select>
          </Form.Item>
          <Form.Item style={{ width: '33%' }} label="Numero ng ID" name="numero_ng_id" hasFeedback {...displayErrors('numero_ng_id')}>
            <Input autoComplete="off" placeholder="Numero ng ID" />
          </Form.Item>
        </Input.Group>
        <Input.Group compact>
          <Form.Item style={{ width: '33%' }} label="Barangay" name="barangay" {...displayErrors('barangay')}>
          <Select allowClear placeholder="Lungsod/Bayan" style={{ width: '100%' }}  showSearch optionFilterProp="children" filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
              { populateBarangays() }
            </Select>
          </Form.Item>
          <Form.Item style={{ width: '33%' }} label="Rehiyon" name="rehiyon" hasFeedback {...displayErrors('rehiyon')}>
            <Input autoComplete="off" placeholder="Rehiyon" value="XI" disabled/>
          </Form.Item>
          <Form.Item style={{ width: '23%' }} label="Petsa ng kapanganakan" name="kapanganakan" hasFeedback {...displayErrors('kapanganakan')}>
            <DatePicker style={{ width: '100%' }} format={"MM/DD/YYYY"} />
          </Form.Item>
          <Form.Item style={{ width: '10%' }} label="Edad" name="age" hasFeedback {...displayErrors('age')}>
            <Input autoComplete="off" placeholder="Edad" disabled />
          </Form.Item>
        </Input.Group>
        <Input.Group compact>
          <Form.Item style={{ width: '33%' }} label="Trabaho" name="trabaho" hasFeedback {...displayErrors('trabaho')}>
            <Input autoComplete="off" placeholder="Trabaho" />
          </Form.Item>
          <Form.Item style={{ width: '33%' }} label="Buwanang Kita" name="buwanang_kita" hasFeedback {...displayErrors('buwanang_kita')}>
            <InputNumber min={0} autoComplete="off" placeholder="Buwanang Kita" style={{width: "100%"}}/>
          </Form.Item>
          <Form.Item style={{ width: '33%' }} label="Cellphone No" name="cellphone_number" hasFeedback {...displayErrors('cellphone_number')}>
            <Input autoComplete="off" placeholder="Cellphone No" />
          </Form.Item>
        </Input.Group>
        <Input.Group compact>
          <Form.Item style={{ width: '33%' }} label="Pinagtratrabahuhan at Lugar" name="pinagtratrabahuhang_lugar" hasFeedback {...displayErrors('pinagtratrabahuhang_lugar')}>
            <Input autoComplete="off" placeholder="Pinagtratrabahuhan at Lugar" />
          </Form.Item>
          <Form.Item style={{ width: '33%' }} label="Sektor" name="sektor" hasFeedback {...displayErrors('sektor')}>
            <select placeholder="Secktor" value="" className="form-control form-control-sm" style={{height: "26px"}}>
              <option value="">Sektor</option>
              <option value="W - Wala sa pagpipilian">W - Wala sa pagpipilian</option>
              { (props.formData.age < 60) ? "" : <option value="A - Nakatatanda">A - Nakatatanda</option>}
              { (props.formData.kasarian == "M" || props.formData.age < 8 || props.formData.age > 55 ) ? "": <option value="B - Buntis">B - Buntis</option>}
              { (props.formData.kasarian == "M" || props.formData.age < 8 || props.formData.age > 55 ) ? "": <option value="C - Nagpapasusong Ina">C - Nagpapasusong Ina</option>}
              <option value="D - PWD">D - PWD</option>
              <option value="E - Solo Parent">E - Solo Parent</option>
              <option value="F - Walang Tirahan">F - Walang Tirahan</option>
            </select>
          </Form.Item>
          <Form.Item style={{ width: '33%' }} label="Kondisyon ng Kalusugan" name="kondisyon_ng_kalusugan" hasFeedback {...displayErrors('kondisyon_ng_kalusugan')}>
            <select placeholder="Kondisyon ng Kalusugan" value="" className="form-control form-control-sm" style={{height: "26px"}}>
              <option value="">Kondisyon ng Kalusugan</option>
              <option value="0 - Wala sa pagpipilian">0 - Wala sa pagpipilian</option>
              <option value="1 - Sakit sa Puso">1 - Sakit sa Puso</option>
              <option value="2 - Altapresyon">2 - Altapresyon</option>
              <option value="3 - Sakit sa baga">3 - Sakit sa baga</option>
              <option value="4 - Diyabetis">4 - Diyabetis</option>
              <option value="5 - Kanser">5 - Kanser</option>
            </select>
          </Form.Item>
        </Input.Group>
        <br/>
        <Input.Group compact>
          <Form.Item style={{ width: '16.5%' }} label="" name="bene_uct" valuePropName="checked">
            <Checkbox>Benepisyaryo ng UCT</Checkbox>
          </Form.Item>
          <Form.Item style={{ width: '16.5%' }} label="" name="bene_4ps" valuePropName="checked">
            <Checkbox>Benepisyaryo ng 4ps</Checkbox>
          </Form.Item>
          <Form.Item style={{ width: '16.5%' }} label="" name="katutubo" valuePropName="checked">
            <Checkbox>Katutubo (Grupo)</Checkbox>
          </Form.Item>
          <Form.Item style={{ width: '16.5%' }} label="" name="katutubo_name" valuePropName="checked" hasFeedback {...displayErrors('katutubo_name')}>
            <Select placeholder="Katutubo Name" disabled={!props.formData.katutubo} showSearch optionFilterProp="children" style={{ width: '100%' }} filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
              <Option value="" disabled>Katutubo Name</Option>
              <Option value="OTHERS">OTHERS</Option>
              <Option value="ABELLING/ABORLIN">ABELLING/ABORLIN</Option>
              <Option value="ABLAAN">ABLAAN</Option>
              <Option value="ADASEN">ADASEN</Option>
              <Option value="AETA">AETA</Option>
              <Option value="AETA-ABIYAN">AETA-ABIYAN</Option>
              <Option value="AETA-REMONTADO">AETA-REMONTADO</Option>
              <Option value="AGTA">AGTA</Option>
              <Option value="AGTA/TABANGNON">AGTA/TABANGNON</Option>
              <Option value="AGTA-TABANGNON">AGTA-TABANGNON</Option>
              <Option value="AGUTAYNIN">AGUTAYNIN</Option>
              <Option value="ALANGAN MANGYAN">ALANGAN MANGYAN</Option>
              <Option value="ALIMAONG">ALIMAONG</Option>
              <Option value="APPLAI">APPLAI</Option>
              <Option value="APPLAI/BONTOK">APPLAI/BONTOK</Option>
              <Option value="ARUMANEN">ARUMANEN</Option>
              <Option value="ATA">ATA</Option>
              <Option value="ATA/MATIGSALOG">ATA/MATIGSALOG</Option>
              <Option value="ATA-MANOBO">ATA-MANOBO</Option>
              <Option value="ATI">ATI</Option>
              <Option value="ATI/ATA/MAGAHAT">ATI/ATA/MAGAHAT</Option>
              <Option value="ATI/BANTOANON">ATI/BANTOANON</Option>
              <Option value="ATI-ATIHAN">ATI-ATIHAN</Option>
              <Option value="ATSMATA">ATSMATA</Option>
              <Option value="AYANGAN">AYANGAN</Option>
              <Option value="B'LAAN">B'LAAN</Option>
              <Option value="BACHIPO">BACHIPO</Option>
              <Option value="BADJAO">BADJAO</Option>
              <Option value="BAGANI/MANOBO">BAGANI/MANOBO</Option>
              <Option value="BAGO">BAGO</Option>
              <Option value="BAGOBO">BAGOBO</Option>
              <Option value="BAGOBO - UBO">BAGOBO - UBO</Option>
              <Option value="BAGOBO-GUINGAN/CLATA">BAGOBO-GUINGAN/CLATA</Option>
              <Option value="BAGOBO-TAGABAWA">BAGOBO-TAGABAWA</Option>
              <Option value="BALANGAO">BALANGAO</Option>
              <Option value="BALANGAO/BALIWON">BALANGAO/BALIWON</Option>
              <Option value="BALANGAO/BARLIG">BALANGAO/BARLIG</Option>
              <Option value="BALANGAO/KADACLAN">BALANGAO/KADACLAN</Option>
              <Option value="BALANGAO/LIAS">BALANGAO/LIAS</Option>
              <Option value="BALANGAO/MADUCAYAN">BALANGAO/MADUCAYAN</Option>
              <Option value="BALATOC">BALATOC</Option>
              <Option value="BALIWEN">BALIWEN</Option>
              <Option value="BALIWON">BALIWON</Option>
              <Option value="BALUGA">BALUGA</Option>
              <Option value="BANAC">BANAC</Option>
              <Option value="BANAO">BANAO</Option>
              <Option value="BANTOANON">BANTOANON</Option>
              <Option value="BANWAON">BANWAON</Option>
              <Option value="BARLIG">BARLIG</Option>
              <Option value="BATAK">BATAK</Option>
              <Option value="BATANGAN (MANGYAN)">BATANGAN (MANGYAN)</Option>
              <Option value="BATANGAN MANGYAN">BATANGAN MANGYAN</Option>
              <Option value="BELWANG">BELWANG</Option>
              <Option value="BINONGAN">BINONGAN</Option>
              <Option value="BOL-ANON">BOL-ANON</Option>
              <Option value="BOLINAO">BOLINAO</Option>
              <Option value="BONTOC">BONTOC</Option>
              <Option value="BONTOK">BONTOK</Option>
              <Option value="BUGKALOT">BUGKALOT</Option>
              <Option value="BUHID">BUHID</Option>
              <Option value="BUHID/BUID (MANGYAN)">BUHID/BUID (MANGYAN)</Option>
              <Option value="BUHOT">BUHOT</Option>
              <Option value="BUKIDNON">BUKIDNON</Option>
              <Option value="BUNOT">BUNOT</Option>
              <Option value="CAGAYANIN">CAGAYANIN</Option>
              <Option value="CAGAYAWEN">CAGAYAWEN</Option>
              <Option value="CALAGAN">CALAGAN</Option>
              <Option value="CALAMIANEN">CALAMIANEN</Option>
              <Option value="CAMIGUIN">CAMIGUIN</Option>
              <Option value="CAYUNIN">CAYUNIN</Option>
              <Option value="CAYUNON">CAYUNON</Option>
              <Option value="CEBUANO">CEBUANO</Option>
              <Option value="CIMARON">CIMARON</Option>
              <Option value="CIMMARON">CIMMARON</Option>
              <Option value="COYUNEN">COYUNEN</Option>
              <Option value="CUYONAN">CUYONAN</Option>
              <Option value="CUYONON">CUYONON</Option>
              <Option value="CUYUNIN">CUYUNIN</Option>
              <Option value="DANAO">DANAO</Option>
              <Option value="DIANGAN/GUIANGAN">DIANGAN/GUIANGAN</Option>
              <Option value="DIBABAON">DIBABAON</Option>
              <Option value="DIBABAWON">DIBABAWON</Option>
              <Option value="DUMAGAT">DUMAGAT</Option>
              <Option value="DUNGUANON">DUNGUANON</Option>
              <Option value="ESKAYA">ESKAYA</Option>
              <Option value="GADDANG">GADDANG</Option>
              <Option value="GUBANG">GUBANG</Option>
              <Option value="GUILLAYON">GUILLAYON</Option>
              <Option value="HANGLULO">HANGLULO</Option>
              <Option value="HANUNUO">HANUNUO</Option>
              <Option value="HANUNUO (MANGYAN)">HANUNUO (MANGYAN)</Option>
              <Option value="HIGAONO/MANOBO">HIGAONO/MANOBO</Option>
              <Option value="HIGAONON">HIGAONON</Option>
              <Option value="HIGAONON/BANUANON">HIGAONON/BANUANON</Option>
              <Option value="I-ABLEG">I-ABLEG</Option>
              <Option value="I-AMMACIAN">I-AMMACIAN</Option>
              <Option value="I-BALINCIAGAO">I-BALINCIAGAO</Option>
              <Option value="I-BALIWON">I-BALIWON</Option>
              <Option value="IBALOI">IBALOI</Option>
              <Option value="IBALOI-I-UWAK">IBALOI-I-UWAK</Option>
              <Option value="IBANAG">IBANAG</Option>
              <Option value="I-BANAO">I-BANAO</Option>
              <Option value="IBATAN">IBATAN</Option>
              <Option value="IBBA">IBBA</Option>
              <Option value="I-BUNOT">I-BUNOT</Option>
              <Option value="IBUT-BUT">IBUT-BUT</Option>
              <Option value="I-CAGALUAN">I-CAGALUAN</Option>
              <Option value="ICALACCAD">ICALACCAD</Option>
              <Option value="IDANGOY">IDANGOY</Option>
              <Option value="IDAW-ANGAN">IDAW-ANGAN</Option>
              <Option value="IFUGAO">IFUGAO</Option>
              <Option value="IFUGAO/AYANGAN">IFUGAO/AYANGAN</Option>
              <Option value="IFUGAO/TUWALI">IFUGAO/TUWALI</Option>
              <Option value="IGOROT">IGOROT</Option>
              <Option value="IKALAHAN">IKALAHAN</Option>
              <Option value="IKALAHAN/KALANGUYA">IKALAHAN/KALANGUYA</Option>
              <Option value="IKALUNA">IKALUNA</Option>
              <Option value="ILIANEN">ILIANEN</Option>
              <Option value="I-LIMOS">I-LIMOS</Option>
              <Option value="ILOCANA">ILOCANA</Option>
              <Option value="ILONGGA">ILONGGA</Option>
              <Option value="ILONGOT">ILONGOT</Option>
              <Option value="ILONGOT/BUGKALOT">ILONGOT/BUGKALOT</Option>
              <Option value="I-LUBUAGAN">I-LUBUAGAN</Option>
              <Option value="IMABILONG">IMABILONG</Option>
              <Option value="IMABONGTOT">IMABONGTOT</Option>
              <Option value="INLAUD">INLAUD</Option>
              <Option value="INMA">INMA</Option>
              <Option value="I-OWAK">I-OWAK</Option>
              <Option value="I-PASIL">I-PASIL</Option>
              <Option value="I-POSWOY">I-POSWOY</Option>
              <Option value="IRANON">IRANON</Option>
              <Option value="IRAYA">IRAYA</Option>
              <Option value="IRAYA (MANGYAN)">IRAYA (MANGYAN)</Option>
              <Option value="I-SALEGSEG">I-SALEGSEG</Option>
              <Option value="ISAROG">ISAROG</Option>
              <Option value="ISINAI">ISINAI</Option>
              <Option value="ISNAG">ISNAG</Option>
              <Option value="ISNAG/ISNEG/YAPAYAO">ISNAG/ISNEG/YAPAYAO</Option>
              <Option value="ISNAG/ISNEG-IMALAWA">ISNAG/ISNEG-IMALAWA</Option>
              <Option value="ISNEG">ISNEG</Option>
              <Option value="ISNEG/APAYAO">ISNEG/APAYAO</Option>
              <Option value="ITA">ITA</Option>
              <Option value="I-TADIAN">I-TADIAN</Option>
              <Option value="ITANGLAG">ITANGLAG</Option>
              <Option value="ITAWES">ITAWES</Option>
              <Option value="ITAWIT">ITAWIT</Option>
              <Option value="ITNEG">ITNEG</Option>
              <Option value="ITNEG/TINGGUIAN">ITNEG/TINGGUIAN</Option>
              <Option value="ITOM">ITOM</Option>
              <Option value="I-UMA">I-UMA</Option>
              <Option value="I-UWAK">I-UWAK</Option>
              <Option value="IVATAN">IVATAN</Option>
              <Option value="I-WAGUD">I-WAGUD</Option>
              <Option value="IWAK">IWAK</Option>
              <Option value="IYAKAN">IYAKAN</Option>
              <Option value="JAMA MAPUN">JAMA MAPUN</Option>
              <Option value="JIANGAN">JIANGAN</Option>
              <Option value="JOLO JANO">JOLO JANO</Option>
              <Option value="KABAKAN">KABAKAN</Option>
              <Option value="KABIHUG">KABIHUG</Option>
              <Option value="KABINGAAN">KABINGAAN</Option>
              <Option value="KADAKLAN">KADAKLAN</Option>
              <Option value="KAGAN">KAGAN</Option>
              <Option value="KALAGAN">KALAGAN</Option>
              <Option value="KALAGAN/KALIBUGAN/SAMAL">KALAGAN/KALIBUGAN/SAMAL</Option>
              <Option value="KALANGUYA">KALANGUYA</Option>
              <Option value="KALIBUGAN">KALIBUGAN</Option>
              <Option value="KALINGA">KALINGA</Option>
              <Option value="KALINGA/BETUAGAN">KALINGA/BETUAGAN</Option>
              <Option value="KALINGA/I-ABLEG">KALINGA/I-ABLEG</Option>
              <Option value="KALINGA/I-ACIGA">KALINGA/I-ACIGA</Option>
              <Option value="KALINGA/I-AMMACIAN">KALINGA/I-AMMACIAN</Option>
              <Option value="KALINGA/I-BALANI">KALINGA/I-BALANI</Option>
              <Option value="KALINGA/I-BALATOC">KALINGA/I-BALATOC</Option>
              <Option value="KALINGA/I-BALINCIAGAO">KALINGA/I-BALINCIAGAO</Option>
              <Option value="KALINGA/I-BALLAYANGON">KALINGA/I-BALLAYANGON</Option>
              <Option value="KALINGA/I-BANAO">KALINGA/I-BANAO</Option>
              <Option value="KALINGA/I-BANGAD">KALINGA/I-BANGAD</Option>
              <Option value="KALINGA/I-BASAO">KALINGA/I-BASAO</Option>
              <Option value="KALINGA/I-BIGA">KALINGA/I-BIGA</Option>
              <Option value="KALINGA/I-BILONG">KALINGA/I-BILONG</Option>
              <Option value="KALINGA/I-BUAYA">KALINGA/I-BUAYA</Option>
              <Option value="KALINGA/I-BUTBUT">KALINGA/I-BUTBUT</Option>
              <Option value="KALINGA/I-CAGALUAN">KALINGA/I-CAGALUAN</Option>
              <Option value="KALINGA/I-COLAYO">KALINGA/I-COLAYO</Option>
              <Option value="KALINGA/I-COLMINGA">KALINGA/I-COLMINGA</Option>
              <Option value="KALINGA/I-DACALAN">KALINGA/I-DACALAN</Option>
              <Option value="KALINGA/I-DALLAC">KALINGA/I-DALLAC</Option>
              <Option value="KALINGA/I-DANANAO">KALINGA/I-DANANAO</Option>
              <Option value="KALINGA/I-DANGTALAN">KALINGA/I-DANGTALAN</Option>
              <Option value="KALINGA/I-DAO-ANGAN">KALINGA/I-DAO-ANGAN</Option>
              <Option value="KALINGA/I-DUPAG">KALINGA/I-DUPAG</Option>
              <Option value="KALINGA/I-GADDANG">KALINGA/I-GADDANG</Option>
              <Option value="KALINGA/I-GAMONANG">KALINGA/I-GAMONANG</Option>
              <Option value="KALINGA/I-GOBGOB">KALINGA/I-GOBGOB</Option>
              <Option value="KALINGA/I-GUBANG">KALINGA/I-GUBANG</Option>
              <Option value="KALINGA/I-GUILAYON">KALINGA/I-GUILAYON</Option>
              <Option value="KALINGA/I-GUINA-ANG">KALINGA/I-GUINA-ANG</Option>
              <Option value="KALINGA/I-KATABBOGAN">KALINGA/I-KATABBOGAN</Option>
              <Option value="KALINGA/I-KULAYO">KALINGA/I-KULAYO</Option>
              <Option value="KALINGA/I-LIMOS">KALINGA/I-LIMOS</Option>
              <Option value="KALINGA/I-LUBO">KALINGA/I-LUBO</Option>
              <Option value="KALINGA/I-LUBUAGAN">KALINGA/I-LUBUAGAN</Option>
              <Option value="KALINGA/I-MABACA">KALINGA/I-MABACA</Option>
              <Option value="KALINGA/I-MABUNGTOT">KALINGA/I-MABUNGTOT</Option>
              <Option value="KALINGA/I-MAGAO-GAO">KALINGA/I-MAGAO-GAO</Option>
              <Option value="KALINGA/I-MAGNAO">KALINGA/I-MAGNAO</Option>
              <Option value="KALINGA/I-MAGSILAY">KALINGA/I-MAGSILAY</Option>
              <Option value="KALINGA/I-MALAGNAT">KALINGA/I-MALAGNAT</Option>
              <Option value="KALINGA/I-MALBONG">KALINGA/I-MALBONG</Option>
              <Option value="KALINGA/I-MALLANGO">KALINGA/I-MALLANGO</Option>
              <Option value="KALINGA/I-MANGALI">KALINGA/I-MANGALI</Option>
              <Option value="KALINGA/I-MANOBAL">KALINGA/I-MANOBAL</Option>
              <Option value="KALINGA/I-NANENG">KALINGA/I-NANENG</Option>
              <Option value="KALINGA/I-PANGOL">KALINGA/I-PANGOL</Option>
              <Option value="KALINGA/I-PANTIKYAN">KALINGA/I-PANTIKYAN</Option>
              <Option value="KALINGA/I-PASIL">KALINGA/I-PASIL</Option>
              <Option value="KALINGA/I-PINUKPOK">KALINGA/I-PINUKPOK</Option>
              <Option value="KALINGA/I-POSWOY">KALINGA/I-POSWOY</Option>
              <Option value="KALINGA/I-SALEGSEG">KALINGA/I-SALEGSEG</Option>
              <Option value="KALINGA/I-SUMADEL">KALINGA/I-SUMADEL</Option>
              <Option value="KALINGA/I-TAGGAY">KALINGA/I-TAGGAY</Option>
              <Option value="KALINGA/I-TALOCTOC">KALINGA/I-TALOCTOC</Option>
              <Option value="KALINGA/I-TANGLAG">KALINGA/I-TANGLAG</Option>
              <Option value="KALINGA/I-TINGLAYAN">KALINGA/I-TINGLAYAN</Option>
              <Option value="KALINGA/I-TOBOG">KALINGA/I-TOBOG</Option>
              <Option value="KALINGA/I-TULGAO">KALINGA/I-TULGAO</Option>
              <Option value="KALINGA/I-UMA">KALINGA/I-UMA</Option>
              <Option value="KALINGA/I-WAGUD">KALINGA/I-WAGUD</Option>
              <Option value="KALINGA/SUYANG">KALINGA/SUYANG</Option>
              <Option value="KALINGA-ACIGA">KALINGA-ACIGA</Option>
              <Option value="KALINGA-SALEGSEG">KALINGA-SALEGSEG</Option>
              <Option value="KALINGGA-ILIMOS">KALINGGA-ILIMOS</Option>
              <Option value="KAMAYO">KAMAYO</Option>
              <Option value="KANKANAEY">KANKANAEY</Option>
              <Option value="KANKANAEY/MILIGAN">KANKANAEY/MILIGAN</Option>
              <Option value="KAOLO">KAOLO</Option>
              <Option value="KARAO">KARAO</Option>
              <Option value="KATABAGAN">KATABAGAN</Option>
              <Option value="KATUBANGLIN">KATUBANGLIN</Option>
              <Option value="KAULO">KAULO</Option>
              <Option value="KAULO-MANOBO">KAULO-MANOBO</Option>
              <Option value="KIYANGAN">KIYANGAN</Option>
              <Option value="KLATA">KLATA</Option>
              <Option value="KUYONAN">KUYONAN</Option>
              <Option value="LANGILAD/TALAINGOD">LANGILAD/TALAINGOD</Option>
              <Option value="LAPAKNON">LAPAKNON</Option>
              <Option value="LENEG - ABRA">LENEG - ABRA</Option>
              <Option value="LUNAD">LUNAD</Option>
              <Option value="MABACA">MABACA</Option>
              <Option value="MABAKA">MABAKA</Option>
              <Option value="MADUKAYAN">MADUKAYAN</Option>
              <Option value="MAENG">MAENG</Option>
              <Option value="MAGAHAT">MAGAHAT</Option>
              <Option value="MAGAHAT/COROLANOS">MAGAHAT/COROLANOS</Option>
              <Option value="MAGUINDANAON">MAGUINDANAON</Option>
              <Option value="MALAUEG">MALAUEG</Option>
              <Option value="MALAYO">MALAYO</Option>
              <Option value="MAMANUA">MAMANUA</Option>
              <Option value="MAMANWA">MAMANWA</Option>
              <Option value="MANAWEY">MANAWEY</Option>
              <Option value="MANDAYA">MANDAYA</Option>
              <Option value="MANGUANGAN">MANGUANGAN</Option>
              <Option value="MANGUWANGAN">MANGUWANGAN</Option>
              <Option value="MANGYAN">MANGYAN</Option>
              <Option value="MANOBO">MANOBO</Option>
              <Option value="MANOBO BIIT">MANOBO BIIT</Option>
              <Option value="MANOBO NEGROS ">MANOBO NEGROS </Option>
              <Option value="MANOBO/UBO">MANOBO/UBO</Option>
              <Option value="MANOBO-KAULO">MANOBO-KAULO</Option>
              <Option value="MANOBO-UBO">MANOBO-UBO</Option>
              <Option value="MANOBO-WIFE'S SIDE">MANOBO-WIFE'S SIDE</Option>
              <Option value="MANSAKA">MANSAKA</Option>
              <Option value="MAPON">MAPON</Option>
              <Option value="MARANAO">MARANAO</Option>
              <Option value="MARIGONDON TRIBE">MARIGONDON TRIBE</Option>
              <Option value="MARURI">MARURI</Option>
              <Option value="MASADIIT">MASADIIT</Option>
              <Option value="MATIGSALUG">MATIGSALUG</Option>
              <Option value="MAYON">MAYON</Option>
              <Option value="MCCT">MCCT</Option>
              <Option value="MESTIZANG AETA">MESTIZANG AETA</Option>
              <Option value="MOLBOG">MOLBOG</Option>
              <Option value="MUSLIM PALAWAN">MUSLIM PALAWAN</Option>
              <Option value="MUSLIM PANGUTARAN">MUSLIM PANGUTARAN</Option>
              <Option value="NEGRITOCAR ONLY">NEGRITOCAR ONLY</Option>
              <Option value="NITIBO">NITIBO</Option>
              <Option value="ORMOC">ORMOC</Option>
              <Option value="OZAMISNON">OZAMISNON</Option>
              <Option value="PALANANUM">PALANANUM</Option>
              <Option value="PALAWAN">PALAWAN</Option>
              <Option value="PALAW'AN">PALAW'AN</Option>
              <Option value="PALAWANO">PALAWANO</Option>
              <Option value="PALAWANON">PALAWANON</Option>
              <Option value="PALW'AN">PALW'AN</Option>
              <Option value="PANIMUSAN">PANIMUSAN</Option>
              <Option value="PULANGIYON">PULANGIYON</Option>
              <Option value="PULLON">PULLON</Option>
              <Option value="RATAGNON">RATAGNON</Option>
              <Option value="REMONTADO">REMONTADO</Option>
              <Option value="RETIBO">RETIBO</Option>
              <Option value="SAGUIBIN">SAGUIBIN</Option>
              <Option value="SAMA">SAMA</Option>
              <Option value="SAMA (BADJAO)">SAMA (BADJAO)</Option>
              <Option value="SAMA (SAMAL)">SAMA (SAMAL)</Option>
              <Option value="SAMA BANGINGI">SAMA BANGINGI</Option>
              <Option value="SAMAL">SAMAL</Option>
              <Option value="SAMAL BANGINGI">SAMAL BANGINGI</Option>
              <Option value="SANGIL">SANGIL</Option>
              <Option value="SIBUYAN MANGYAN TAGA BUKID">SIBUYAN MANGYAN TAGA BUKID</Option>
              <Option value="SUBANEN">SUBANEN</Option>
              <Option value="SUBANON">SUBANON</Option>
              <Option value="SULOD">SULOD</Option>
              <Option value="SUMADEL">SUMADEL</Option>
              <Option value="T'BOLI">T'BOLI</Option>
              <Option value="TABACAULO">TABACAULO</Option>
              <Option value="TABANGNON">TABANGNON</Option>
              <Option value="TABOY">TABOY</Option>
              <Option value="TABUEG">TABUEG</Option>
              <Option value="TADYAWAN">TADYAWAN</Option>
              <Option value="TADYAWAN (MANGYAN)">TADYAWAN (MANGYAN)</Option>
              <Option value="TAGABAWA">TAGABAWA</Option>
              <Option value="TAGAKAOLO">TAGAKAOLO</Option>
              <Option value="TAGBANUA">TAGBANUA</Option>
              <Option value="TAGBANUAS">TAGBANUAS</Option>
              <Option value="TALAANDIG">TALAANDIG</Option>
              <Option value="TAO'T BATO">TAO'T BATO</Option>
              <Option value="TAOBUEG">TAOBUEG</Option>
              <Option value="TASADAY">TASADAY</Option>
              <Option value="TAUBUHID">TAUBUHID</Option>
              <Option value="TAUSUG">TAUSUG</Option>
              <Option value="TAU'T BATU">TAU'T BATU</Option>
              <Option value="TEDURAY">TEDURAY</Option>
              <Option value="TEDURAY/TIRURAY">TEDURAY/TIRURAY</Option>
              <Option value="TIGWAHANON">TIGWAHANON</Option>
              <Option value="TIGWAYANON">TIGWAYANON</Option>
              <Option value="TINGGUIAN">TINGGUIAN</Option>
              <Option value="TINGGUIAN/ADASEN">TINGGUIAN/ADASEN</Option>
              <Option value="TINGGUIAN/AGTA/NEGRITO">TINGGUIAN/AGTA/NEGRITO</Option>
              <Option value="TINGGUIAN/BALATOK">TINGGUIAN/BALATOK</Option>
              <Option value="TINGGUIAN/BANAO">TINGGUIAN/BANAO</Option>
              <Option value="TINGGUIAN/BINONGAN">TINGGUIAN/BINONGAN</Option>
              <Option value="TINGGUIAN/GUBANG">TINGGUIAN/GUBANG</Option>
              <Option value="TINGGUIAN/INLAUD">TINGGUIAN/INLAUD</Option>
              <Option value="TINGGUIAN/MABAKA">TINGGUIAN/MABAKA</Option>
              <Option value="TINGGUIAN/MAENG">TINGGUIAN/MAENG</Option>
              <Option value="TINGGUIAN/MASADIIT">TINGGUIAN/MASADIIT</Option>
              <Option value="TINGGUIAN/MUYADAN">TINGGUIAN/MUYADAN</Option>
              <Option value="TINGGUIAN-ITNEG">TINGGUIAN-ITNEG</Option>
              <Option value="TINGIAN">TINGIAN</Option>
              <Option value="TINGUIAN">TINGUIAN</Option>
              <Option value="TINGUIAN/BALWANG">TINGUIAN/BALWANG</Option>
              <Option value="TIRORAY">TIRORAY</Option>
              <Option value="TUMENDOK">TUMENDOK</Option>
              <Option value="TUWALI">TUWALI</Option>
              <Option value="UBO">UBO</Option>
              <Option value="UMAYAMNEN">UMAYAMNEN</Option>
              <Option value="UMAYAMNON">UMAYAMNON</Option>
              <Option value="UNIDENTIFIED">UNIDENTIFIED</Option>
              <Option value="VISAYA">VISAYA</Option>
              <Option value="WARAY">WARAY</Option>
              <Option value="YAKAN">YAKAN</Option>
              <Option value="YAPAYAO">YAPAYAO</Option>
              <Option value="YATUKA">YATUKA</Option>
              <Option value="YOGAD">YOGAD</Option>
              <Option value="ZAMBAL">ZAMBAL</Option>

            </Select>
          </Form.Item>
          <Form.Item style={{ width: '16.5%', marginLeft: "5px" }} label="" name="bene_others" valuePropName="checked">
            <Checkbox value="Y">Others</Checkbox>
          </Form.Item>
          <Form.Item style={{ width: '16.3%' }} label="" name="others_name" hasFeedback {...displayErrors('others_name')}>
              <Input autoComplete="off" placeholder="Others Name" disabled={!props.formData.bene_others} />
            </Form.Item>
        </Input.Group>
        <Divider />
        <div style={{position: "absolute", width: "96%"}}>
          <div style={{paddingTop: "5px"}} className="float-right">
            <Button type="primary" onClick={() => addMember()}>
              Add Member
            </Button>  
            <Button type="danger" onClick={removeLastMember}>
              Remove Last Row
            </Button>
          </div>
        </div>
        <Title level={2} style={{textAlign: "center"}}>Miyembro ng Pamilya</Title>
      </Form>
      { populateMembers() }
      <Divider />

      <Form ref={secondFormRef} name="basic" onValuesChange={setFormFields} onFinish={formSubmit} size="small" >
        <Input.Group compact>
          <Form.Item  style={{ width: '25%' }} label="Pangalan ng Punong Barangay" name="pangalan_ng_punong_barangay" hasFeedback {...displayErrors('pangalan_ng_punong_barangay')}>
            <Input autoComplete="off" placeholder="Pangalan ng Punong Barangay" />
          </Form.Item>
          <Form.Item  style={{ width: '25%' }} label="Pangalan ng LSWDO" name="pangalan_ng_lswdo" hasFeedback {...displayErrors('pangalan_ng_lswdo')}>
            <Input autoComplete="off" placeholder="Pangalan ng LSWDO" />
          </Form.Item>
          <Form.Item  style={{ width: '25%' }} label="Petsa ng Pagrehistro" name="petsa_ng_pagrehistro" hasFeedback {...displayErrors('petsa_ng_pagrehistro')}>
            <DatePicker style={{ width: '100%' }} format={"MM/DD/YYYY"} />
          </Form.Item>
          <Form.Item  style={{ width: '25%' }} label="Barcode Number" name="sac_number" hasFeedback {...displayErrors('sac_number')}>
            <Input type="number" autoComplete="off" placeholder="Barcode Number" />
          </Form.Item>
        </Input.Group>
        <Input.Group compact>
          <Form.Item  style={{ width: '80%' }} label="Remarks" name="remarks">
            <TextArea rows={4} placeholder="Remarks" />
          </Form.Item>
          <Form.Item  style={{ width: '20%' }}>
          <div className="d-flex justify-content-center mt-10">
          { props.viewStatus == "edit" ? (
            <Button size="large" type="primary" htmlType="submit" form="basic" disabled={submit} loading={submit}>
              Save Form
            </Button>
          ) : "" }
          </div>
          </Form.Item>
        </Input.Group>
      </Form>
      <Divider />
      <br />
      <br />
      
      
    </div>
  );
}


export default connect(
  mapStateToProps,
)(HheadForm);