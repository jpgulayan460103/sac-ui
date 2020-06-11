import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import API from '../../api'
import { Typography, Table, Drawer, Button, Modal, Pagination, DatePicker, Input } from 'antd';
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


const { confirm } = Modal;
const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Search } = Input;
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
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [searchStringFilter, setSearchStringFilter] = useState("");
  useEffect(() => {
    getHouseholdHeads(1);
    props.dispatch({
      type: "SET_INITIAL_HHEAD_STATE",
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
  const exportData = () => {
    API.Hhead.export()
    .then(res => {
      let url = (process.env.NODE_ENV == "development" ? process.env.DEVELOPMENT_URL : process.env.PRODUCTION_URL);
      let intiialSettings = {
        startDate: startDateFilter,
        endDate: endDateFilter,
        query: searchStringFilter,
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
  }

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

  const getHouseholdHeads = (currentPage = 1, searchString = "") => {
    setTableLoading(true);
    searchString = searchString == "" ? searchStringFilter : searchString;
    let options = {
      page: currentPage,
      query: searchString,
    };
    if(startDateFilter != ""){
      options.startDate = startDateFilter;
      options.endDate = endDateFilter;
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
    clonedHheadData.kapanganakan = moment.parseZone(clonedHheadData.kapanganakan);
    clonedHheadData.petsa_ng_pagrehistro = moment.parseZone(clonedHheadData.petsa_ng_pagrehistro);
    clonedHheadData.age = getAge(clonedHheadData.kapanganakan.format("YYYY/MM/DD"));
    setDrawerTitle(clonedHheadData.barcode_number);
    clonedHheadData.members.data.map(member => {
      member.kapanganakan = moment.parseZone(member.kapanganakan);
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

  const searchHhead = (searchString) => {
    getHouseholdHeads(1, searchString);
    setSearchStringFilter(searchString);
  }
  const paginationClick = (e) => {
    getHouseholdHeads(e);
  }
  const datePickerChange = (ranges) => {
    if(ranges == null){
      setStartDateFilter("");
      setEndDateFilter("");
      return true;
    }
    let [ startDate, endDate ] = ranges;
    startDate = moment.parseZone(startDate).format("YYYY-MM-DD");
    endDate = moment.parseZone(endDate).format("YYYY-MM-DD");
    setStartDateFilter(startDate);
    setEndDateFilter(endDate);
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
      render: (text, record, index) => (
        <>
          <Button title="View" onClick={() => { showHhead(record) }} key={`view-${record.id}`}><EyeOutlined /></Button>
          <Button title="Edit" onClick={() => { editHhead(record) }} key={`edit-${record.id}`}><EditOutlined /></Button>
          { record.allow_delete || props.user.role == "admin" ? (<Button title="Delete" type="danger" onClick={() => { deleteHhead(record, index) }} key={`delete-${record.id}`}><DeleteOutlined /></Button>) : "" }
          
        </>
      ),
    },
  ];


  return (
    <div>
      <Title level={2} style={{textAlign: "center"}}>Encoded SAC Forms</Title>
      <br />
      <div className="space-x-2">
        <span>Search:</span>
        <Search
          placeholder="input search text"
          onSearch={value => searchHhead(value)}
          style={{ width: 200 }}
        />
        <RangePicker onChange={(e) => {datePickerChange(e)}} />
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
            <a href="#!" onClick={() => {exportData()}}>Export Data</a>
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