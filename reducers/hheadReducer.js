import ls from 'local-storage'

const initialState = () => {
  return {
    formData: {
      bene_uct: false,
      bene_4ps: false,
      katutubo: false,
      bene_others: false,
    },
    members: {
      0: {}
    },
    formError: {},
    formType: "create",
    formStatus: "hide",
    selectedHhead: {},
  }
}

export default function hheadReducer(state = initialState(), action) {
  switch (action.type) {
    case 'HHEAD_FORM_SUBMIT':
      state.formError = {};
      return state;
      break;
    case 'HHEAD_FORM_ERROR':
      return {
        ...state,
        formError: action.data,
      };
      break;
    case 'SET_HHEAD_FORM_DATA':
      return {
        ...state,
        formData: action.data,
      };
      break;
    case 'SET_HMEMBER_FORM_DATA':
      return {
        ...state,
        members: action.data,
      };
      break;
    case 'ADD_HMEMBERS':
      return {
        ...state,
        members: action.data,
      };
      break;
    case 'SET_HHEAD':
      state.selectedHhead = action.data;
      return state;
      break;
    case 'SET_HHEAD_FORM_STATUS':
      state.formStatus = action.data;
      return state;
      break;
    case 'SET_HHEAD_FORM_TYPE':
      state.formType = action.data;
      return state;
      break;
    case 'SET_INITIAL_STATE':
      state = initialState();
      return state;
      break;
    default:
      return state;
  }
}
