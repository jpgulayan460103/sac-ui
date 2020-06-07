import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import API from '../../api'
import { Typography, Table, Drawer } from 'antd';
import HheadForm from './HheadForm'
import _cloneDeep from 'lodash/cloneDeep'
import moment from 'moment'
import Router from 'next/router';


const { Title } = Typography;
function mapStateToProps(state) {
  return {
    
  };
}
const handleClick = () => {}
const HheadTable = (props) => {
  const [hheads, setHheads] = useState([]);
  const [selectedHhead, setSelectedHhead] = useState({});
  useEffect(() => {
    getHouseholdHeads();
  }, []);

  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const getHouseholdHeads = () => {
    API.Hhead.all()
    .then(res => {
      let hheads_response = res.data.household_heads.data;
      hheads_response.map(item => {
        item.key = item.id;
        return item;
      })
      setHheads(hheads_response);
    })
    .catch(err => {})
    .then(res => {})
  }

  const showHhead = (data) => {
    let loadedData = convertToForm(data);    
    setSelectedHhead(loadedData);
    setVisible(true);
  }
  const editHhead = (data) => {
    let loadedData = convertToForm(data);
    let hhdata = loadedData;
    let hmembers = loadedData.members;
    props.dispatch({
      type: "SET_HHEAD_FORM_DATA",
      data: hhdata
    });
    props.dispatch({
      type: "SET_HMEMBER_FORM_DATA",
      data: hmembers
    });
    props.dispatch({
      type: "SET_HHEAD_FORM_TYPE",
      data: "edit"
    });
    props.dispatch({
      type: "SET_HMEMBER_FORM_STATUS",
      data: "old"
    });
    Router.push("/");
    setSelectedHhead(loadedData);
  }


  const convertToForm = (data) => {
    let clonedHheadData = _cloneDeep(data);
    clonedHheadData.probinsya = clonedHheadData.barangay.province_psgc;
    clonedHheadData.lungsod = clonedHheadData.barangay.city_psgc;
    clonedHheadData.bene_uct = clonedHheadData.bene_uct == "Y" ? true : false;
    clonedHheadData.bene_4ps = clonedHheadData.bene_4ps == "Y" ? true : false;
    clonedHheadData.katutubo = clonedHheadData.katutubo == "Y" ? true : false;
    clonedHheadData.bene_others = clonedHheadData.bene_others == "Y" ? true : false;
    clonedHheadData.kapanganakan = moment.parseZone(clonedHheadData.kapanganakan).utc();
    clonedHheadData.petsa_ng_pagrehistro = moment.parseZone(clonedHheadData.petsa_ng_pagrehistro).utc();
    clonedHheadData.members.map(member => {
      member.kapanganakan = moment.parseZone(member.kapanganakan).utc();
      return member; 
    })
    return clonedHheadData;
  }


  const dataSource = hheads;
  
  const columns = [
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
    },
    {
      title: 'Middle Name',
      dataIndex: 'middle_name',
      key: 'middle_name',
    },
    {
      title: 'View',
      key: 'view',
      dataIndex: 'view',
      render: (text, record) => (
        <>
          <span onClick={() => { showHhead(record) }} key={record.id}>view</span>
        </>
      ),
    },
    {
      title: 'Tags',
      key: 'edit',
      dataIndex: 'edit',
      render: (text, record) => (
        <>
          <span onClick={() => { editHhead(record) }} key={record.id}>edit</span>
        </>
      ),
    },
  ];


  return (
    <div>
      <Title level={2} style={{textAlign: "center"}}>Encoded SAC Forms</Title>
      <Table dataSource={dataSource} columns={columns} />

      <Drawer
        title="Basic Drawer"
        width={900}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <HheadForm viewStatus="view" viewData={selectedHhead} />
      </Drawer>
    </div>
  );
}



export default connect(
  mapStateToProps,
)(HheadTable);