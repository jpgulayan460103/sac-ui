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
  const [totalRegularRecord, setTotalRegularRecord] = useState(0);
  const [totalLeftoutRecord, setTotalLeftoutRecord] = useState(0);
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
      total = response.reduce((accumulator, currentValue) => {
        return accumulator + parseInt(currentValue.total_regular);
      }, 0);
      setTotalRegularRecord(total);
      total = response.reduce((accumulator, currentValue) => {
        return accumulator + parseInt(currentValue.total_leftout);
      }, 0);
      setTotalLeftoutRecord(total);
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
      title: `Total Regular (${totalRegularRecord})`,
      dataIndex: 'total_regular',
      key: 'total_regular',
    },
    {
      title: `Total Leftout (${totalLeftoutRecord})`,
      dataIndex: 'total_leftout',
      key: 'total_leftout',
    },
    {
      title: `Total Encoded (${totalRecord})`,
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
      <Table dataSource={dataSource} columns={columns} footer={() => `` } />
    </div>
  );
}



export default connect(
  mapStateToProps,
)(Encoded);