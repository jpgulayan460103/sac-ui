import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Checkbox } from 'antd';
import API from '../api'
import Router from 'next/router'
import { LockOutlined, UserOutlined } from '@ant-design/icons';

function mapStateToProps(state) {
  return {

  };
}

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 24,
  },
};
const tailLayout = {
  wrapperCol: {
    span: 24,
  },
};

class LoginForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      
    }
    this.handleTest = this.handleTest.bind(this);
    this.onFinish = this.onFinish.bind(this);
    this.onFinishFailed = this.onFinishFailed.bind(this);
  }
  handleTest = () => {
    API.User.getUsers()
      .then(res => {
        
      })
      .catch(err => {

      })
      .then(res => {})
  }
  onFinish = values => {
    API.User.login(values)
    .then(res => {
      this.props.dispatch({
        type: "USER_LOGIN_SUCCESSFUL",
        data: res.data
      });
      Router.push('/')
    })
    .catch(err => {
      if(err.response && err.response.data){
        this.props.dispatch({
          type: "USER_LOGIN_FAILED",
          data: err
        });
        Router.push('/login')
      }
    })
    .then(res => {})
  }
  onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo);
  }
  render() {
    return (
      <div className="pt-16">
        <Form
          {...layout}
          name="basic"
          layout="vertical"
          initialValues={{
            remember: true,
          }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input placeholder="Type your username" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password placeholder="Type your password" prefix={<LockOutlined />} />
          </Form.Item>

          

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" size="large" block>
              Login
            </Button>
          </Form.Item>

        </Form>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(LoginForm);