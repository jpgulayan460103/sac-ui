import React, {useEffect} from 'react';
import Router from 'next/router'
import ls from 'local-storage'

const DefaultComponent = () => {
  useEffect(() => {
    let user = ls('auth');
    if(!user){
      Router.push('/login')
    }
  }, []);
  return (
    <div>
      <div style={{height:"100vw",zIndex: "1000000000"}}>

      </div>
    </div>
  );
};

export default DefaultComponent;