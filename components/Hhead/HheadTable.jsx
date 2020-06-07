import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import API from '../../api'
import { Typography, Table, Drawer, Button } from 'antd';
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
  const [drawerTitle, setDrawerTitle] = useState("");
  useEffect(() => {
    getHouseholdHeads();
    props.dispatch({
      type: "SET_INITIAL_STATE",
      data: {}
    });
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

  const pad = (str, max) => {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
  }
  const getAge = (dateString) => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }
  const convertToForm = (data) => {
    let clonedHheadData = _cloneDeep(data);
    clonedHheadData.probinsya = clonedHheadData.barangay.province_psgc;
    clonedHheadData.lungsod = clonedHheadData.barangay.city_psgc;
    clonedHheadData.bene_uct = clonedHheadData.bene_uct == "Y" ? true : false;
    clonedHheadData.bene_4ps = clonedHheadData.bene_4ps == "Y" ? true : false;
    clonedHheadData.katutubo = clonedHheadData.katutubo == "Y" ? true : false;
    clonedHheadData.sac_number = pad(parseInt(clonedHheadData.sac_number), 8); ;
    clonedHheadData.bene_others = clonedHheadData.bene_others == "Y" ? true : false;
    clonedHheadData.kapanganakan = moment.parseZone(clonedHheadData.kapanganakan).utc();
    clonedHheadData.petsa_ng_pagrehistro = moment.parseZone(clonedHheadData.petsa_ng_pagrehistro).utc();
    clonedHheadData.age = getAge(clonedHheadData.kapanganakan.format("YYYY/MM/DD"));
    setDrawerTitle(clonedHheadData.barcode_number);
    clonedHheadData.members.data.map(member => {
      member.kapanganakan = moment.parseZone(member.kapanganakan).utc();
      member.age = getAge(member.kapanganakan.format("YYYY/MM/DD"));
      return member; 
    })
    clonedHheadData.members = clonedHheadData.members.data;
    return clonedHheadData;
  }


  const dataSource = hheads;
  
  const columns = [
    {
      title: 'Barcode',
      key: 'barcode_number',
      dataIndex: 'barcode_number',
    },
    {
      title: 'Name',
      key: 'full_name',
      render: (text, record) => (
        <>
          <span key={record.id}>
            <span>{record.last_name}, {record.first_name} {record.middle_name} {record.ext_name}</span>
          </span>
        </>
      ),
    },
    {
      title: 'Address',
      key: 'address',
      render: (text, record) => (
        <>
          <span key={record.id}>
            <span>{record.barangay.barangay_name}, {record.barangay.city_name} {record.barangay.province_name}</span>
          </span>
        </>
      ),
    },
    {
      title: '',
      key: 'action',
      dataIndex: 'action',
      align: "right",
      render: (text, record) => (
        <>
          <Button onClick={() => { showHhead(record) }} key={`view-${record.id}`}>View</Button>
          <Button onClick={() => { editHhead(record) }} key={`edit-${record.id}`}>Edit</Button>
          { record.allow_delete ? (<Button type="danger" onClick={() => { deleteHhead(record) }} key={`delete-${record.id}`}>Delete</Button>) : "" }
          
        </>
      ),
    },
  ];


  return (
    <div>
      <Title level={2} style={{textAlign: "center"}}>Encoded SAC Forms</Title>
      <Table dataSource={dataSource} columns={columns} />

      <Drawer
        title={drawerTitle}
        width={900}
        placement="left"
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