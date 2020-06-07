import React, {useEffect} from 'react';
import Router from 'next/router'
import ls from 'local-storage'

const AuthChecker = () => {
  useEffect(() => {
    let user = ls('auth');
    if(!user){
      Router.push('/login')
    }
  }, []);
  return (
    <React.Fragment></React.Fragment>
  );
};

export default AuthChecker;