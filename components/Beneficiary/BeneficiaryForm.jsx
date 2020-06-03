import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Divider, Select, DatePicker, Typography, Radio, Col, Row, Checkbox } from 'antd';
import API from '../../api'
import _forEach from 'lodash/forEach'
import _isEmpty from 'lodash/isEmpty'
import _debounce from 'lodash/debounce'
import moment from 'moment';
import queryString from "query-string";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import BeneficiaryMembersForm from './BeneficiaryMembersForm'

const { Option } = Select;

function mapStateToProps(state) {
  return {
    formError: state.beneficiary.formError,
    formData: state.beneficiary.formData
  };
}
const handleClick = () => {}
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const value = 1;


const BeneficiaryForm = (props) => {
  useEffect(() => {

  }, []);
  const formRef = React.useRef();
  const [submit, setSubmit] = useState(false);
  
  const displayErrors = (field) => {
    if(props.formError[field]){
      return {
        validateStatus: 'error',
        help: props.formError[field][0]
      }
    }
  }
  const formSubmit = _debounce(() => {
    API.Student.add(formData)
    .then(res => {})
    .catch(res => {
      props.dispatch({
        type: "STUDENT_FORM_ERROR",
        data: res.response.data.errors
      })
    })
    .then(res => {})
    ;
  },150);
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
      type: "SET_BENEFICIARY_FORM_DATA",
      data: transformedValue
    })
  }
  return (
    <div>
      <Form ref={formRef} name="basic" onValuesChange={setFormFields} onFinish={formSubmit} size="small" >
      <h3 style={{textAlign: "center"}}>Household Head</h3>
        <Input.Group compact>
          <Form.Item  style={{ width: '20%' }} label="Last Name" name="last_name" hasFeedback {...displayErrors('last_name')}>
            <Input autoComplete="off" placeholder="Last Name" />
          </Form.Item>
          <Form.Item  style={{ width: '20%' }} label="First Name" name="first_name" hasFeedback {...displayErrors('first_name')}>
            <Input autoComplete="off" placeholder="First Name" />
          </Form.Item>
          <Form.Item  style={{ width: '20%' }} label="Middle Name" name="middle_name" hasFeedback {...displayErrors('middle_name')}>
            <Input autoComplete="off" placeholder="First Name" />
          </Form.Item>
          <Form.Item  style={{ width: '20%' }} label="Ext Name" name="ext_name" hasFeedback {...displayErrors('ext_name')}>
            <Input autoComplete="off" placeholder="First Name" />
          </Form.Item>
          <Form.Item  style={{ width: '19.3%' }} label="Kasarian" name="kasarian" hasFeedback {...displayErrors('kasarian')}>
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
          <Form.Item style={{ width: '33%' }} label="Kalye" name="kayle" hasFeedback {...displayErrors('kayle')}>
            <Input autoComplete="off" placeholder="Kalye" />
          </Form.Item>
          <Form.Item style={{ width: '33%' }} label="Uri ng ID" name="uri_ng_id" hasFeedback {...displayErrors('uri_ng_id')}>
            <Input autoComplete="off" placeholder="Uri ng ID" />
          </Form.Item>
        </Input.Group>
        <Input.Group compact>
          <Form.Item style={{ width: '33%' }} label="Barangay" name="barangay" hasFeedback {...displayErrors('barangay')}>
            <Input autoComplete="off" placeholder="Barangay" />
          </Form.Item>
          <Form.Item style={{ width: '33%' }} label="Lungsod/Bayan" name="lungsod" hasFeedback {...displayErrors('lungsod')}>
            <Input autoComplete="off" placeholder="Lungsod/Bayan" />
          </Form.Item>
          <Form.Item style={{ width: '33%' }} label="Numero ng ID" name="numero_ng_id" hasFeedback {...displayErrors('numero_ng_id')}>
            <Input autoComplete="off" placeholder="Numero ng ID" />
          </Form.Item>
        </Input.Group>
        <Input.Group compact>
          <Form.Item style={{ width: '33%' }} label="Probinsya" name="probinsya" hasFeedback {...displayErrors('probinsya')}>
            <Input autoComplete="off" placeholder="Probinsya" />
          </Form.Item>
          <Form.Item style={{ width: '33%' }} label="Rehiyon" name="rehiyon" hasFeedback {...displayErrors('rehiyon')}>
            <Input autoComplete="off" placeholder="Rehiyon" />
          </Form.Item>
          <Form.Item style={{ width: '33%' }} label="Petsa ng kapanganakan" name="petsa_ng_kapanganakan" hasFeedback {...displayErrors('petsa_ng_kapanganakan')}>
            <DatePicker style={{ width: '100%' }} format={"MM/DD/YYYY"} />
          </Form.Item>
        </Input.Group>
        <Input.Group compact>
          <Form.Item style={{ width: '33%' }} label="Trabaho" name="trabaho" hasFeedback {...displayErrors('trabaho')}>
            <Input autoComplete="off" placeholder="Trabaho" />
          </Form.Item>
          <Form.Item style={{ width: '33%' }} label="Buwanang Kita" name="buwanang_kita" hasFeedback {...displayErrors('buwanang_kita')}>
            <Input autoComplete="off" placeholder="Buwanang Kita" />
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
            <select placeholder="Secktor" className="form-control form-control-sm" style={{height: "26px"}}>
                <option value="A - Nakatatanda">A - Nakatatanda</option>
                <option value="B - Buntis">B - Buntis</option>
                <option value="C - Nagpapasusong Ina">C - Nagpapasusong Ina</option>
                <option value="D - PWD">D - PWD</option>
                <option value="E - Solo Parent">E - Solo Parent</option>
                <option value="F - Walang Tirahan">F - Walang Tirahan</option>
                <option value="W - Wala sa pagpipilian">W - Wala sa pagpipilian</option>
              </select>
          </Form.Item>
          <Form.Item style={{ width: '33%' }} label="Kondisyon ng Kalusugan" name="kondisyon_ng_kalusugan" hasFeedback {...displayErrors('kondisyon_ng_kalusugan')}>
            <Input autoComplete="off" placeholder="Kondisyon ng Kalusugan" />
          </Form.Item>
        </Input.Group>
        <Input.Group compact>
          <Form.Item style={{ width: '16.5%' }} label="" name="bene_uct">
            <Checkbox value="Y">Benepisyaryo ng UCT</Checkbox>
          </Form.Item>
          <Form.Item style={{ width: '16.5%' }} label="" name="bene_4ps">
            <Checkbox value="Y">Benepisyaryo ng 4ps</Checkbox>
          </Form.Item>
          <Form.Item style={{ width: '33%' }} label="" name="katutubo">
            <Checkbox value="Y">Katutubo (Grupo)</Checkbox>
            <Form.Item style={{ width: '100%' }} label="" name="katutubo_name" hasFeedback {...displayErrors('katutubo_name')}>
              <Input autoComplete="off" placeholder="Katutubo Name" />
            </Form.Item>
          </Form.Item>
          <Form.Item style={{ width: '33%' }} label="" name="katutubo">
            <Checkbox value="Y">Others</Checkbox>
            <Form.Item style={{ width: '100%' }} label="" name="others_name" hasFeedback {...displayErrors('others_name')}>
              <Input autoComplete="off" placeholder="Others Name" />
            </Form.Item>
          </Form.Item>
        </Input.Group>
        <Divider />
        <h3 style={{textAlign: "center"}}>Household Members</h3>
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
        {/* <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" disabled={submit}>
            Submit
          </Button>
        </Form.Item> */}
      </Form>
        <BeneficiaryMembersForm memberIndex={0} />
        <BeneficiaryMembersForm memberIndex={1} />


    </div>
  );
}



export default connect(
  mapStateToProps,
)(BeneficiaryForm);