import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap';
import { CaretDownOutlined } from '@ant-design/icons';
import Link from 'next/link'

class Headers extends Component {
  constructor(props){
    super(props);
    this.state = {
      accessToken: "",
      isLogged: false,
    };
    this.toggle = this.toggle.bind(this);
    this.loggedState = this.loggedState.bind(this);
    this.logout = this.logout.bind(this);
    this.redirect = this.redirect.bind(this);
  }
  static getDerivedStateFromProps(props, state) {
    return {
      isLogged: props.isLogged,
      accessToken: props.accessToken,
    };
  }
  toggle = () => {
    this.setState({isOpen: !this.state.isOpen});
  }
  loggedState = () => {
    if(this.state.isLogged){
      return (
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav>
            {this.props.user.username} <CaretDownOutlined />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>
              Change Password
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem>
              <NavLink href="#" onClick={() => this.logout() }>Logout</NavLink>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      )
    }else{
      return (
        <NavItem>
          <NavLink href="/login" onClick={() => this.logout}>Login</NavLink>
        </NavItem>
      )
    }
  }
  logout = () => {
    this.props.dispatch({
      type: "USER_LOGIN_FAILED",
      data: {}
    });
    Router.push('/login')
  }
  redirect = (redirectTo) => {
    Router.push(`/${redirectTo}`)
  }
  render() {
    return (
      <div>
      <Navbar color="light" light expand="md" fixed="top">
        <NavbarBrand href="#!"  onClick={() => this.redirect('') }>
        
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="#!" onClick={() => this.redirect('about') }>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/reactstrap/reactstrap">asdasd</NavLink>
            </NavItem>
          </Nav>
          <Nav navbar>
            
          </Nav>
        </Collapse>
      </Navbar>
    </div>
    );
  }
}

const mapStateToProps = (state) => ({
  
});
export default connect(mapStateToProps)(Headers);