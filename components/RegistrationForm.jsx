import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Checkbox, Select } from 'antd';
import API from '../api'
import Router from 'next/router'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import ls, { set } from 'local-storage'
import Swal from 'sweetalert2/dist/sweetalert2.js'

const { Option } = Select;

function mapStateToProps(state) {
  return {

  };
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 5, span: 17 },
};

const RegistrationForm = (props) => {
  const formRef = React.useRef();
  const [submit, setSubmit] = useState(false);
  const [userPosition, setUserPosition] = useState("");
  const [formError, setFormError] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [barangay, setBarangay] = useState("");
  useEffect(() => {
    getProvinces();
  }, []);
  const onSubmit = values => {
    setSubmit(true);
    API.User.save(values)
    .then(res => {
      setSubmit(false);
      setFormError({});
      formRef.current.resetFields();
      Swal.fire({
        title: 'Registration success',
        text: 'Please contact administrator to activate your account.',
        icon: 'success',
        confirmButtonText: 'OK',
        onClose: () => {

        }
      })
      setBarangay("");
      setProvince("");
      setCity("");
    })
    .catch(err => {
      setFormError(err.response.data.errors);
      setSubmit(false);
    })
    .then(res => {
      setSubmit(false);
    })
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const displayErrors = (field) => {
    if(formError[field]){
      return {
        validateStatus: 'error',
        help: formError[field][0]
      }
    }
  }
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
    if(typeof e == "undefined"){
      setProvince("");
    }else{
      setProvince(e);
    }
    API.Barangay.getCities(e)
    .then(res => {
      setCities(res.data.cities);
    })
    .catch(res => {
    })
    .then(res => {})
    ;;
  }
  const getBarangays = (city) => {
    setBarangays([]);
    if(typeof city == "undefined"){
      setCity("");
    }else{
      setCity(city);
    }
    API.Barangay.getBarangays(province,city)
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
      items.push(<Option value={item.id} key={item.id}>{item.barangay_name}</Option>);
    })
    return items;
  }

  const formSetBarangay = (e) => {
    if(typeof e == "undefined"){
      setBarangay("");
    }else{
      setBarangay(e);
    }
  }

  const clearBarangaySelection = () =>{
    // getCities(props.formData.barangay.province_psgc)
    // getBarangays(props.formData.barangay.city_psgc)
  }
  return (
    <div>
      <Form
        {...layout}
        ref={formRef}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="username"
          {...displayErrors('username')}
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input prefix={<UserOutlined />} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          {...displayErrors('password')}
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="password_confirmation"
          {...displayErrors('password_confirmation')}
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item
          label="First Name"
          name="first_name"
          {...displayErrors('first_name')}
          rules={[{ required: true, message: 'Please input your first name.' }]}
        >
          <Input prefix={<UserOutlined />} />
        </Form.Item>

        <Form.Item
          label="Middle Name"
          name="middle_name"
          {...displayErrors('middle_name')}
        >
          <Input prefix={<UserOutlined />} />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="last_name"
          {...displayErrors('last_name')}
          rules={[{ required: true, message: 'Please input your last name.' }]}
        >
          <Input prefix={<UserOutlined />} />
        </Form.Item>

        <Form.Item
          label="Position"
          name="position"
          {...displayErrors('position')}
          rules={[{ required: true, message: 'Please select your position' }]}
        >
          <Select style={{ width: "100%" }} placeholder="Position" onSelect={(e) => {setUserPosition(e)}}>
            <Option value="Field Staff">Field Staff</Option>
            <Option value="LGU Staff">LGU Staff</Option>
          </Select>
        </Form.Item>

        { (userPosition== "LGU Staff") ? (
          <>
          <Form.Item
            label="Province"
            name="province"
            {...displayErrors('province')}
            rules={[{ required: true, message: 'Please select your position' }]}
          >
            <Select allowClear placeholder="Probinsya" style={{ width: '100%' }} onChange={(e) => getCities(e)} disabled={city != ""} showSearch optionFilterProp="children" filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
              { populateProvinces() }
            </Select>
          </Form.Item>
          <Form.Item
            label="City/Municipality"
            name="city"
            {...displayErrors('city')}
            rules={[{ required: true, message: 'Please select your position' }]}
          >
            <Select allowClear placeholder="Lungsod/Bayan" style={{ width: '100%' }} onChange={(e) => getBarangays(e)}  disabled={barangay != ""} showSearch optionFilterProp="children" filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                { populateCities() }
              </Select>
          </Form.Item>
          
          <Form.Item
            label="Barangay"
            name="barangay_id"
            {...displayErrors('barangay_id')}
            rules={[{ required: true, message: 'Please select your position' }]}
          >
            <Select allowClear placeholder="Barangay" style={{ width: '100%' }}  showSearch optionFilterProp="children" filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onChange={(e) => {formSetBarangay(e)}  }>
              { populateBarangays() }
            </Select>
          </Form.Item>
          </>
        ) : "" }


        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" disabled={submit} loading={submit}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

RegistrationForm.propTypes = {
  
};


export default connect(
  mapStateToProps,
)(RegistrationForm);