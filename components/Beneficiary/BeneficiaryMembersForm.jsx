import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Select } from 'antd';
import _forEach from 'lodash/forEach'
import _isEmpty from 'lodash/isEmpty'
import _debounce from 'lodash/debounce'

const { Option } = Select;

function mapStateToProps(state) {
  return {
    formError: state.beneficiary.formError,
    members: state.beneficiary.members,
  };
}


const BeneficiaryMembersForm = (props) => {
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

  }, []);
  const setFormFields = (e) => {
    let transformedValue = {};
    _forEach(e, function(value, key) {
      if(typeof value == "string"){
        transformedValue[key] = value.toUpperCase();
      }else{
        transformedValue[key] = value;
      }
      if(key == "petsa_ng_kapanganakan" || key == "petsa_ng_pagrehistro"){
        transformedValue[key] = moment.parseZone(value).utc().format("MM/DD/YYYY");
      }
    });
    props.dispatch({
      type: "SET_BENEFICIARY_MEMBER_FORM_DATA",
      data: {
        index: props.memberIndex,
        data: transformedValue
      }
    })
  }
  return (
    <React.Fragment>
      <Form ref={formRef} name="basic" onValuesChange={setFormFields} size="small" >
      <Input.Group compact>
          <Form.Item  style={{ width: '10%' }} label="" name="last_name" hasFeedback {...displayErrors('last_name')}>
            <Input autoComplete="off" placeholder="Last Name" />
          </Form.Item>
          <Form.Item  style={{ width: '10%' }} label="" name="first_name" hasFeedback {...displayErrors('first_name')}>
            <Input autoComplete="off" placeholder="First Name" />
          </Form.Item>
          <Form.Item  style={{ width: '10%' }} label="" name="middle_name" hasFeedback {...displayErrors('middle_name')}>
            <Input autoComplete="off" placeholder="Middle Name" />
          </Form.Item>
          <Form.Item  style={{ width: '5%' }} label="" name="ext_name" hasFeedback {...displayErrors('ext_name')}>
            <Input autoComplete="off" placeholder="Ext Name" />
          </Form.Item>
          <Form.Item  style={{ width: '15%' }} label="" name="relasyon_sa_punong_pamilya" hasFeedback {...displayErrors('relasyon_sa_punong_pamilya')}>
            <Input autoComplete="off" placeholder="Relasyon sa Puno ng Pamilya" />
          </Form.Item>
          <Form.Item  style={{ width: '15%' }} label="" name="kapanganakan" hasFeedback {...displayErrors('kapanganakan')}>
            <Input autoComplete="off" placeholder="Kapanganakan" />
          </Form.Item>
          <Form.Item  style={{ width: '5%' }} label="" name="kasarian" hasFeedback {...displayErrors('kasarian')}>
            <Select placeholder="Kasarian" showSearch optionFilterProp="children" style={{ width: '100%' }} filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
              <Option value="M">M</Option>
              <Option value="F">F</Option>
            </Select>
          </Form.Item>
          <Form.Item  style={{ width: '15%' }} label="" name="trabaho" hasFeedback {...displayErrors('trabaho')}>
            <Input autoComplete="off" placeholder="trabaho" />
          </Form.Item>
          <Form.Item  style={{ width: '9.5%' }} label="" name="sektor" hasFeedback {...displayErrors('sektor')}>
            <Select placeholder="Secktor" showSearch optionFilterProp="children" style={{ width: '100%' }} filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                <Option value="A - Nakatatanda">A - Nakatatanda</Option>
                <Option value="B - Buntis">B - Buntis</Option>
                <Option value="C - Nagpapasusong Ina">C - Nagpapasusong Ina</Option>
                <Option value="D - PWD">D - PWD</Option>
                <Option value="E - Solo Parent">E - Solo Parent</Option>
                <Option value="F - Walang Tirahan">F - Walang Tirahan</Option>
                <Option value="W - Wala sa pagpipilian">W - Wala sa pagpipilian</Option>
              </Select>
          </Form.Item>
          <Form.Item  style={{ width: '5%' }} label="" name="kondisyon_ng_kalusugan" hasFeedback {...displayErrors('kondisyon_ng_kalusugan')}>
            <Input autoComplete="off" placeholder="kondisyon_ng_kalusugan" />
          </Form.Item>
        </Input.Group>
        </Form>
    </React.Fragment>
  );
}



export default connect(
  mapStateToProps,
)(BeneficiaryMembersForm);