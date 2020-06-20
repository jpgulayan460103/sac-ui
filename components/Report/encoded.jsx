import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Typography } from 'antd';
import API from '../../api'
import { Button, Radio } from 'antd';

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
  const [summaryType, setSummaryType] = useState("province");
  const [totalRecord, setTotalRecord] = useState(0);
  const getEncodedSummary = (type = 'province') => {
    API.Report.encoded(type)
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

  const selectType = (e) => {
    let type = e.target.value;
    setSummaryType(type);
    getEncodedSummary(type);
  }
  
  return (
    <div>
      <Title style={{textAlign: "center"}}>Encoding Report</Title>
      <Radio.Group value={summaryType} onChange={ (e) => { selectType(e) } }>
        <Radio.Button value="province">Province</Radio.Button>
        <Radio.Button value="city">City/Municipality</Radio.Button>
        <Radio.Button value="barangay">Barangay</Radio.Button>
      </Radio.Group>
      <br />
      <br />
      <Table dataSource={dataSource} columns={columns} footer={() => `Total Encoded : ${totalRecord}`} />
    </div>
  );
}



export default connect(
  mapStateToProps,
)(Encoded);