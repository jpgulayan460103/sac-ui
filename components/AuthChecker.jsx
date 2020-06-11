import React, {useEffect} from 'react';
import Router from 'next/router'
import ls from 'local-storage'
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    
  };
}
const AuthChecker = (props) => {
  useEffect(() => {
    let user = ls('auth');
    if(!user){
      Router.push('/login')
    }else{
      props.dispatch({
        type: "SET_USER",
        data: user
      });
    }
  }, []);
  return (
    <React.Fragment></React.Fragment>
  );
};

export default connect(
  mapStateToProps,
)(AuthChecker);