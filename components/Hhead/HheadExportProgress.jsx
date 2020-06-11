import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Progress } from 'antd';

function mapStateToProps(state) {
  return {
    exportData: state.user.exportData
  };
}
const handleClick = () => {}
const HheadExportProgress = (props) => {
  useEffect(() => {
    
  }, []);
  return (
    <div style={{width:"200px"}}>
      <Progress percent={props.exportData.percentage}  size="small" />
    </div>
  );
}



export default connect(
  mapStateToProps,
)(HheadExportProgress);