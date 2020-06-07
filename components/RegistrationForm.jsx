import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Checkbox } from 'antd';
import API from '../api'
import Router from 'next/router'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import ls from 'local-storage'
import Swal from 'sweetalert2/dist/sweetalert2.js'

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

const LoginForm = props => {
  const formRef = React.useRef();
  const [submit, setSubmit] = useState(false);
  const [formError, setFormError] = useState({});
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
          label="Name"
          name="name"
          {...displayErrors('name')}
          rules={[{ required: true, message: 'Please input your name!' }]}
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

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" disabled={submit} loading={submit}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

LoginForm.propTypes = {
  
};


export default connect(
  mapStateToProps,
)(LoginForm);