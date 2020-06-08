import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Select, DatePicker } from 'antd';
import _forEach from 'lodash/forEach'
import _isEmpty from 'lodash/isEmpty'
import _debounce from 'lodash/debounce'
import _cloneDeep from 'lodash/cloneDeep'
import moment from 'moment';

const { Option } = Select;

function mapStateToProps(state) {
  return {
    formError: state.hhead.formError,
    formData: state.hhead.formData,
    members: state.hhead.members,
    formStatus: state.hhead.formStatus,
  };
}


const HmemberForm = (props) => {
  const memberFormRef = React.useRef();
  const [formData, setFormData] = useState({});
  const displayErrors = (field) => {
    if(props.formError[`members.${props.memberIndex}.${field}`]){
      return {
        validateStatus: 'error',
        help: props.formError[`members.${props.memberIndex}.${field}`][0]
      }
    }
  }
  useEffect(() => {
    if(props.viewStatus == "edit"){
      let clonedMemberData = _cloneDeep(props.members[props.memberIndex]);
      memberFormRef.current.setFieldsValue({
        ...clonedMemberData
      });
      setFormData(clonedMemberData);
    }
  }, [props.members[props.memberIndex]]);
  useEffect(() => {
    if(props.viewStatus == "view" || props.formType == "edit"){
      let viewMemberData = _cloneDeep(props.viewData);
      memberFormRef.current.setFieldsValue({
        ...viewMemberData
      });
      setFormData(viewMemberData);
    }
  }, [props.viewData]);
  useEffect(() => {
    resetForm();
  }, [props.formStatus]);
  const resetForm = () => {
    memberFormRef.current.resetFields();
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
  const setFormFields = (e) => {
    if(props.viewStatus == "view"){
      return false;
    }
    let transformedValue = {};
    _forEach(e, function(value, key) {
      transformedValue['type'] = 'old';
      if(typeof value == "string"){
        switch (key) {
          case 'sektor':
          case 'kondisyon_ng_kalusugan':
          case 'relasyon_sa_punong_pamilya':
            transformedValue[key] = value;
            break;
          default:
            transformedValue[key] = value.toUpperCase();
            break;
        }
      }else{
        transformedValue[key] = value;
      }
      if(key == "kapanganakan" || key == "petsa_ng_pagrehistro"){
        transformedValue[key] = moment.parseZone(value).utc();
        if(key == "kapanganakan"){
          let age = getAge(transformedValue[key].format("YYYY/MM/DD"));
          transformedValue['age'] = age;
          if(age < 0){
            transformedValue[key] = moment().utc();
            transformedValue['age'] = 0;
          }else if((age<8 || age>55) && (formData.sektor == "B - Buntis" || formData.sektor == "C - Nagpapasusong Ina")){
            transformedValue['sektor'] = "";
          }else if(age<60 && formData.sektor == "A - Nakatatanda"){
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
        if(formData.sektor == "B - Buntis" || formData.sektor == "C - Nagpapasusong Ina"){
          transformedValue['sektor']  = "";
        }
      }
    });
    let index = props.memberIndex;
    let memberData = [];
    memberData[index] = {
        ...props.members[index],
        ...transformedValue
    };
    props.dispatch({
      type: "SET_HMEMBER_FORM_DATA",
      data: {
        ...props.members,
        ...memberData
      }
    }) 
  }
  const diplayLabel = (label, index) => {
    if(index == 0){
      return label;
    }
    return "";
  }
  return (
    <React.Fragment>
      <Form ref={memberFormRef} name="basic" onValuesChange={setFormFields} size="small" >
      <Input.Group compact>
          <Form.Item  style={{ width: '10%' }} label={diplayLabel("Apelyido",props.memberIndex)} name="last_name" {...displayErrors('last_name')}>
            <Input autoComplete="off" placeholder="Apelyido" />
          </Form.Item>
          <Form.Item  style={{ width: '10%' }} label={diplayLabel("Pangalan",props.memberIndex)} name="first_name" {...displayErrors('first_name')}>
            <Input autoComplete="off" placeholder="Pangalan" />
          </Form.Item>
          <Form.Item  style={{ width: '10%' }} label={diplayLabel("Gitnang Pangalan",props.memberIndex)} name="middle_name" {...displayErrors('middle_name')}>
            <Input autoComplete="off" placeholder="Gitnang Pangalan" />
          </Form.Item>
          <Form.Item  style={{ width: '5%' }} label={diplayLabel("Ext",props.memberIndex)} name="ext_name" {...displayErrors('ext_name')}>
            <Input autoComplete="off" placeholder="Ext Name" />
          </Form.Item>
          <Form.Item  style={{ width: '13%' }} label={diplayLabel("Relasyon",props.memberIndex)} name="relasyon_sa_punong_pamilya" {...displayErrors('relasyon_sa_punong_pamilya')}>
            <select placeholder="Relasyon sa Puno ng Pamilya" value="" className="form-control form-control-sm" style={{height: "26px"}}>
              <option value="">Relasyon sa Puno ng Pamilya</option>
              {/* <option value="1 - Puno ng Pamilya">1 - Puno ng Pamilya</option> */}
              <option value="2 - Asawa">2 - Asawa</option>
              <option value="3 - Anak">3 - Anak</option>
              <option value="4 - Kapatid">4 - Kapatid</option>
              <option value="5 - Bayaw o Hipag">5 - Bayaw o Hipag</option>
              <option value="6 - Apo">6 - Apo</option>
              <option value="7 - Ama / Ina">7 - Ama / Ina</option>
              <option value="8 - Iba pang Kamag-anak">8 - Iba pang Kamag-anak</option>
            </select>
          </Form.Item>
          <Form.Item  style={{ width: '10%' }} label={diplayLabel("Kapanganakan",props.memberIndex)} name="kapanganakan" {...displayErrors('kapanganakan')}>
            <DatePicker style={{ width: '100%' }} format={"MM/DD/YYYY"} />
          </Form.Item>
          <Form.Item  style={{ width: '5%' }} label={diplayLabel("Edad",props.memberIndex)} name="age">
            <Input autoComplete="off" placeholder="Edad" disabled />
          </Form.Item>
          <Form.Item  style={{ width: '7%' }} label={diplayLabel("Kasarian",props.memberIndex)} name="kasarian" {...displayErrors('kasarian')}>
            <select placeholder="Kasarian" value="" className="form-control form-control-sm" style={{height: "26px"}}>
              <option value="">Kasarian</option>
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
          </Form.Item>
          <Form.Item  style={{ width: '10%' }} label={diplayLabel("Trabaho",props.memberIndex)} name="trabaho" {...displayErrors('trabaho')}>
            <Input autoComplete="off" placeholder="trabaho" />
          </Form.Item>
          <Form.Item  style={{ width: '9.5%' }} label={diplayLabel("Sektor",props.memberIndex)} name="sektor" {...displayErrors('sektor')}>
            <select placeholder="Secktor" value="" className="form-control form-control-sm" style={{height: "26px"}}>
              <option value="">Sektor</option>
              <option value="W - Wala sa pagpipilian">W - Wala sa pagpipilian</option>
              { (typeof formData.age != undefined && formData.age < 60) ? "" : <option value="A - Nakatatanda">A - Nakatatanda</option>}
              { (typeof formData.kasarian != undefined && formData.kasarian == "M" || formData.age < 8 || formData.age > 55 ) ? "": <option value="B - Buntis">B - Buntis</option>}
              { (typeof formData.kasarian != undefined && formData.kasarian == "M" || formData.age < 8 || formData.age > 55 ) ? "": <option value="C - Nagpapasusong Ina">C - Nagpapasusong Ina</option>}
              <option value="D - PWD">D - PWD</option>
              <option value="E - Solo Parent">E - Solo Parent</option>
              <option value="F - Walang Tirahan">F - Walang Tirahan</option>
            </select>
          </Form.Item>
          <Form.Item  style={{ width: '10%' }} label={diplayLabel("Kondisyon ng Kalusugan",props.memberIndex)} name="kondisyon_ng_kalusugan" {...displayErrors('kondisyon_ng_kalusugan')}>
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
        </Form>
    </React.Fragment>
  );
}



export default connect(
  mapStateToProps,
)(HmemberForm);