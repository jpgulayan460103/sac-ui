import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Checkbox } from 'antd';
import API from '../api'
import Router from 'next/router'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import ls from 'local-storage'

function mapStateToProps(state) {
  return {

  };
}

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};
const tailLayout = {
  wrapperCol: { offset: 5, span: 17 },
};

const LoginForm = props => {
  const [submit, setSubmit] = useState(false);
  const [formError, setFormError] = useState(false);
  const onSubmit = values => {
    setSubmit(true);
    API.User.login(values)
    .then(res => {
      setSubmit(false);
      let user = res.data.user;
      let createdToken = res.data.createdToken;
      user.createdToken = createdToken;
      ls.set('auth',user);
      if(user.role == "admin"){
        window.location = "/encoding-report";
      }else{
        location.reload();
      }
    })
    .catch(err => {
      console.log(err);
      
      setSubmit(false);
      if(err.response.status == 422){
        setFormError(err.response.data);
      }
    })
    .then(res => {
      setSubmit(false);
    })
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const displayErrors = () => {
    if(formError){
      return {
        validateStatus: 'error',
        help: formError.message
      }
    }
  }
  return (
    <div>
      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="username"
          {...displayErrors()}
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input prefix={<UserOutlined />} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
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