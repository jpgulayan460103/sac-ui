import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Select, DatePicker } from 'antd';
import _forEach from 'lodash/forEach'
import _isEmpty from 'lodash/isEmpty'
import _debounce from 'lodash/debounce'
import moment from 'moment';

const { Option } = Select;

function mapStateToProps(state) {
  return {
    formError: state.hhead.formError,
    formData: state.hhead.formData,
    members: state.hhead.members,
  };
}


const HmemberForm = (props) => {
  const formRef = React.useRef();
  const displayErrors = (field) => {
    if(props.formError[field]){
      return {
        validateStatus: 'error',
        help: props.formError[field][0]
      }
    }
  }
  useEffect(() => {
    formRef.current.setFieldsValue({
      ...props.members[props.memberIndex]
    });
  }, [props.members]);
  const setFormFields = (e) => {
    let transformedValue = {};
    _forEach(e, function(value, key) {
      if(typeof value == "string"){
        transformedValue[key] = value.toUpperCase();
        switch (key) {
          case 'sektor':
          case 'kondisyon_ng_kalusugan':
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
  return (
    <React.Fragment>
      <Form ref={formRef} name="basic" onValuesChange={setFormFields} size="small" >
      <Input.Group compact>
          <Form.Item  style={{ width: '10%' }} label="" name="last_name" {...displayErrors('last_name')}>
            <Input autoComplete="off" placeholder="Last Name" />
          </Form.Item>
          <Form.Item  style={{ width: '10%' }} label="" name="first_name" {...displayErrors('first_name')}>
            <Input autoComplete="off" placeholder="First Name" />
          </Form.Item>
          <Form.Item  style={{ width: '10%' }} label="" name="middle_name" {...displayErrors('middle_name')}>
            <Input autoComplete="off" placeholder="Middle Name" />
          </Form.Item>
          <Form.Item  style={{ width: '5%' }} label="" name="ext_name" {...displayErrors('ext_name')}>
            <Input autoComplete="off" placeholder="Ext Name" />
          </Form.Item>
          <Form.Item  style={{ width: '15%' }} label="" name="relasyon_sa_punong_pamilya" {...displayErrors('relasyon_sa_punong_pamilya')}>
            <Input autoComplete="off" placeholder="Relasyon sa Puno ng Pamilya" />
          </Form.Item>
          <Form.Item  style={{ width: '15%' }} label="" name="kapanganakan" {...displayErrors('kapanganakan')}>
            <DatePicker style={{ width: '100%' }} format={"MM/DD/YYYY"} />
          </Form.Item>
          <Form.Item  style={{ width: '5%' }} label="" name="kasarian" {...displayErrors('kasarian')}>
            <select placeholder="Kasarian" value="" className="form-control form-control-sm" style={{height: "26px"}}>
              <option value="">Kasarian</option>
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
          </Form.Item>
          <Form.Item  style={{ width: '10%' }} label="" name="trabaho" {...displayErrors('trabaho')}>
            <Input autoComplete="off" placeholder="trabaho" />
          </Form.Item>
          <Form.Item  style={{ width: '9.5%' }} label="" name="sektor" {...displayErrors('sektor')}>
            <select placeholder="Secktor" value="" className="form-control form-control-sm" style={{height: "26px"}}>
              <option value="">Sektor</option>
              <option value="W - Wala sa pagpipilian">W - Wala sa pagpipilian</option>
              <option value="A - Nakatatanda">A - Nakatatanda</option>
              <option value="B - Buntis">B - Buntis</option>
              <option value="C - Nagpapasusong Ina">C - Nagpapasusong Ina</option>
              <option value="D - PWD">D - PWD</option>
              <option value="E - Solo Parent">E - Solo Parent</option>
              <option value="F - Walang Tirahan">F - Walang Tirahan</option>
            </select>
          </Form.Item>
          <Form.Item  style={{ width: '10%' }} label="" name="kondisyon_ng_kalusugan" {...displayErrors('kondisyon_ng_kalusugan')}>
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