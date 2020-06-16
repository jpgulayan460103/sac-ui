import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Typography } from 'antd';
import API from '../../api'

const { Title } = Typography;

function mapStateToProps(state) {
  return {
    
  };
}
const handleClick = () => {}
const Encoded = (props) => {
  useEffect(() => {
    getEncodedSummary();
  }, []);
  const [summary, setSummary] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const getEncodedSummary = () => {
    API.Report.encoded()
    .then(res => {
      let response = res.data.encoded;
      response.map(item => {
        item.key = item.id;
        return item;
      });
      setSummary(response);
      let total = response.reduce((accumulator, currentValue) => {
        return accumulator + parseInt(currentValue.total_encoded);
      }, 0);
      setTotalRecord(total);
    })
    .then(err => {})
    .then(res => {})
  }
  const dataSource = summary;
  
  const columns = [
    {
      title: 'Province',
      dataIndex: 'province_name',
      key: 'province_name',
    },
    {
      title: 'City',
      dataIndex: 'city_name',
      key: 'city_name',
    },
    {
      title: 'Barangay',
      dataIndex: 'barangay_name',
      key: 'barangay_name',
    },
    {
      title: 'Total Encoded',
      dataIndex: 'total_encoded',
      key: 'total_encoded',
    },
  ];
  
  return (
    <div>
      <Title style={{textAlign: "center"}}>Encoding Report</Title>
      <Table dataSource={dataSource} columns={columns} footer={() => `Total Encoded : ${totalRecord}`} />
    </div>
  );
}



export default connect(
  mapStateToProps,
)(Encoded);