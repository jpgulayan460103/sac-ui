import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import API from '../../api'
import { Typography, Table, Drawer, Button, Modal, Pagination, DatePicker, Input, Select  } from 'antd';
import HheadForm from './HheadForm'
import _cloneDeep from 'lodash/cloneDeep'
import _isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import Router from 'next/router';
import {
  ExclamationCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import HheadExportProgress from './HheadExportProgress'
import _debounce from 'lodash/debounce';


const { confirm } = Modal;
const { Title, Link } = Typography;
const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select ;
function mapStateToProps(state) {
  return {
    exportData: state.user.exportData,
    exporting: state.user.exporting,
    user: state.user.user,
  };
}
const handleClick = () => {}
const HheadTable = (props) => {
  const [hheads, setHheads] = useState([]);
  const [selectedHhead, setSelectedHhead] = useState({});
  const [drawerTitle, setDrawerTitle] = useState("");
  const [pagination, setPagination] = useState({});
  const [tableLoading, setTableLoading] = useState(true);
  const [searchOptions, setSearchOptions] = useState({});
  const [users, setUsers] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [barangay, setBarangay] = useState("");
  useEffect(() => {
    getHouseholdHeads(1);
    getUser();
    getProvinces();
    // props.dispatch({
    //   type: "SET_INITIAL_HHEAD_STATE",
    //   data: {}
    // });
  }, []);

  const getProvinces = () => {
    API.Barangay.getProvinces()
    .then(res => {
      setProvinces(res.data.provinces);
    })
    .catch(res => {
    })
    .then(res => {})
    ;;
  }
  const getCities = (e) => {
    setCities([]);
    if(typeof e == "undefined"){
      setProvince("");
      setSearchOptions({
        ...searchOptions,
        province_psgc: "",
      });
    }else{
      setProvince(e);
      setSearchOptions({
        ...searchOptions,
        province_psgc: e,
      });
    }
    API.Barangay.getCities(e)
    .then(res => {
      setCities(res.data.cities);
    })
    .catch(res => {
    })
    .then(res => {})
    ;;
  }
  const getBarangays = (city) => {
    setBarangays([]);
    if(typeof city == "undefined"){
      setCity("");
      setSearchOptions({
        ...searchOptions,
        city_psgc: "",
      });
    }else{
      setCity(city);
      setSearchOptions({
        ...searchOptions,
        city_psgc: city,
      });
    }
    API.Barangay.getBarangays(province,city)
    .then(res => {
      setBarangays(res.data.barangays);
    })
    .catch(res => {
    })
    .then(res => {})
    ;;
  }

  const formSetBarangay = (e) => {
    if(typeof e == "undefined"){
      setBarangay("");
      setSearchOptions({
        ...searchOptions,
        barangay_psgc: "",
      });
    }else{
      setBarangay(e);
      setSearchOptions({
        ...searchOptions,
        barangay_psgc: e,
      });
    }
  }

  const getUser = () => {
    API.User.getUsers()
    .then(res => {
      setUsers(res.data.users.data);
    })
    .catch(res => {})
    .then(res => {})
    ;
  }

  const populateUsers = () => {
    let items = [];
    users.map(item => {
      items.push(<Option value={item.id} key={item.id}>{`[${item.username}] ${item.name}`}</Option>);
    })
    return items;
  }

  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  const exportData = _debounce(() => {
    API.Hhead.export()
    .then(res => {
      let url = (process.env.NODE_ENV == "development" ? process.env.DEVELOPMENT_URL : process.env.PRODUCTION_URL);
      let intiialSettings = {
        ...searchOptions,
        path: `${url}${res.data.path}`,
        filename: res.data.filename,
        totalPage: 0,
        currentPage: 0,
        percentage: 0,
      };
      props.dispatch({
        type: "SET_HHEAD_EXPORT_REQUEST",
        data: intiialSettings
      });
      props.dispatch({
        type: "SET_HHEAD_EXPORTING",
        data: true
      });
      processExport(intiialSettings);
    })
    .catch(err => {})
    .then(res => {})
    ;
  }, 150)

  const processExport = (intiialSettings = {}) => {
    let exportSettings;
    if(!_isEmpty(intiialSettings)){
      exportSettings = _cloneDeep(intiialSettings);
    }else{
      exportSettings = _cloneDeep(props.exportData);
    }
    exportSettings.page = exportSettings.currentPage + 1;
    API.Hhead.processExport(exportSettings)
    .then(res => {
      exportSettings.totalPage = res.data.total_pages;
      if(exportSettings.currentPage != exportSettings.totalPage){
        exportSettings.currentPage++;
        let percentage = ((exportSettings.currentPage / exportSettings.totalPage) * 100).toFixed(2)
        exportSettings.percentage = percentage;
        processExport(exportSettings);
        props.dispatch({
          type: "SET_HHEAD_EXPORT_REQUEST",
          data: {
            ...props.exportData,
            ...exportSettings
          }
        });
      }else{
        props.dispatch({
          type: "SET_HHEAD_EXPORTING",
          data: false
        });
        window.location.href = exportSettings.path;
      }
    })
    .catch(res => {
      processExport(exportSettings);
    })
    .then(res => {});
  }

  const getHouseholdHeads = (currentPage = 1) => {
    setTableLoading(true);
    let options = {
      ...searchOptions,
      page: currentPage,
    }
    API.Hhead.all(options)
    .then(res => {
      setTableLoading(false);
      let hheads_response = res.data.household_heads.data;
      let pagination_response = res.data.household_heads.meta.pagination;
      hheads_response.map(item => {
        item.key = item.id;
        return item;
      })
      setHheads(hheads_response);
      setPagination(pagination_response);
    })
    .catch(err => {
      setTableLoading(false);
    })
    .then(res => {
      setTableLoading(false);
    })
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
      type: "SET_HHEAD_FORM_TYPE",
      data: "edit"
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

  const deleteHhead = (record, index) => {
    console.log(index);
    
    confirm({
      title: `Do you want to delete ${record.barcode_number}?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This action is irreversible.',
      onOk() {
        console.log('OK');
        API.Hhead.delete(record.id)
        .then((res) => {
          handleDelete(record.id);
        })
        .catch((err) => {})
        .then((res) => {})
        ;

      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const handleDelete = (id) => {
    let dataSource = [...hheads];
    let newData = dataSource.filter(item => item.id !== id);
    setHheads(newData);
  }

  const queryString = (e) => {
    let searchString = e.target.value;
    setSearchOptions({
      ...searchOptions,
      query: searchString,
    });
  }
  const paginationClick = (e) => {
    getHouseholdHeads(e);
  }
  const datePickerChange = (ranges) => {
    if(ranges == null){
      setSearchOptions({
        ...searchOptions,
        startDate:"",
        endDate:"",
      });
      return true;
    }
    let [ startDate, endDate ] = ranges;
    startDate = moment.parseZone(startDate).format("YYYY-MM-DD");
    endDate = moment.parseZone(endDate).format("YYYY-MM-DD");
    setSearchOptions({
      ...searchOptions,
      startDate:startDate,
      endDate:endDate,
    });
  }
  const selectUser = (e) => {
    setSearchOptions({
      ...searchOptions,
      user_id:e,
    });
  }
  const setSapType = (e) => {
    setSearchOptions({
      ...searchOptions,
      sap_type:e,
    });
  }

  const dataSource = hheads;
  
  const columns = [
    {
      title: 'Barcode',
      key: 'barcode_number',
      dataIndex: 'barcode_number',
      width: 170,
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
          <span key={`address_${record.id}`}>
            <span>{record.barangay.barangay_name}, {record.barangay.city_name} {record.barangay.province_name}</span>
          </span>
        </>
      ),
    },
    {
      title: 'Encoded by/on',
      key: 'created_at',
      render: (text, record) => (
        <>
          <span key={`created_at_${record.id}`}>
            <span>{ record.user.name }</span> <br />
            <span>{ moment(record.created_at).format("MM/DD/YYYY") }</span>
          </span>
        </>
      ),
    },
    {
      title: '',
      key: 'action',
      dataIndex: 'action',
      align: "right",
      width: 170,
      render: (text, record, index) => (
        <>
          <Button title="View" onClick={() => { showHhead(record) }} key={`view-${record.id}`}><EyeOutlined /></Button>
          <Button title="Edit" onClick={() => { editHhead(record) }} key={`edit-${record.id}`}><EditOutlined /></Button>
          { record.allow_delete || props.user.role == "admin" ? (<Button title="Delete" type="danger" onClick={() => { deleteHhead(record, index) }} key={`delete-${record.id}`}><DeleteOutlined /></Button>) : "" }
          
        </>
      ),
    },
  ];

  const populateProvinces = () => {
    let items = [];
    provinces.map(item => {
      items.push(<Option value={item.province_psgc} key={item.province_psgc}>{item.province_name}</Option>);
    })
    return items;
  }
  const populateCities = () => {
    let items = [];
    cities.map(item => {
      items.push(<Option value={item.city_psgc} key={item.city_psgc}>{item.city_name}</Option>);
    })
    return items;
  }
  const populateBarangays = () => {
    let items = [];
    barangays.map(item => {
      items.push(<Option value={item.barangay_psgc} key={item.barangay_psgc}>{item.barangay_name}</Option>);
    })
    return items;
  }


  return (
    <div>
      <Title level={2} style={{textAlign: "center"}}>Encoded SAC Forms</Title>
      <br />
      <div className="space-x-2">
        <span>Search:</span>
        <Input placeholder="Search" onBlur={(e) => {queryString(e)}} style={{width: "150px"}} />
        <RangePicker onChange={(e) => {datePickerChange(e)}} />
        <Select allowClear placeholder="Sap Type" style={{ width: '150px' }} onChange={(e) => setSapType(e)} >
            <Option value="">All</Option>
            <Option value="REGULAR">Regular SAP</Option>
            <Option value="LEFTOUT">Leftout SAP</Option>
          </Select>
        { props.user.role == "admin" ? (
          <>
          <br />
          <br />
          <span>Users:</span>
          <Select allowClear placeholder="Users" onChange={(e) => selectUser(e)} style={{ width: '270px' }} showSearch optionFilterProp="children" filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
            { populateUsers() }
          </Select>
          <Select allowClear placeholder="Probinsya" style={{ width: '150px' }} onChange={(e) => getCities(e)} disabled={city != ""} showSearch optionFilterProp="children" filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
            { populateProvinces() }
          </Select>
          <Select allowClear placeholder="Lungsod/Bayan" style={{ width: '150px' }} onChange={(e) => getBarangays(e)}  disabled={barangay != ""} showSearch optionFilterProp="children" filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
              { populateCities() }
            </Select>
          <Select allowClear placeholder="Barangay" style={{ width: '150px' }}  showSearch optionFilterProp="children" filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onChange={(e) => {formSetBarangay(e)}  }>
            { populateBarangays() }
          </Select>
          </>
        ) : "" }
        <Button type="primary" onClick={() => {getHouseholdHeads(1)}}>
          Search
        </Button>
      </div>
      <br />
      <span className="space-x-1">
          <span>Total records: <b>{pagination.total}</b>.</span>
          { (props.exporting ? (
            <span className="space-x-1">
            <span>Exporting in the background, you may continue using the app.</span>
            <HheadExportProgress />
            </span>
          ) : (
            <Link href="#!" onClick={() => {exportData()}}>
              Export Data
            </Link>
          )) }
        </span>
      <Table dataSource={dataSource} columns={columns} pagination={false} loading={tableLoading} />
      <div className="p-4 pull-right">
        { !_isEmpty(pagination) ? (
          <Pagination
            defaultCurrent={pagination.current_page}
            total={pagination.total}
            pageSize={pagination.per_page}
            showSizeChanger={false}
            onChange={(e) => {paginationClick(e)}}
            showQuickJumper
          />
        ) : "" }
      </div>
      

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