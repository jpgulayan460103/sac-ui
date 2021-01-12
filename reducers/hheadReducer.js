import ls from 'local-storage'

const initialState = () => {
  return {
    formData: {
      bene_uct: false,
      bene_4ps: false,
      katutubo: false,
      bene_others: false,
      members: [],
      sap_type: "BAYANIHAN 2",
    },
    formError: {},
    formType: "create",
    formStatus: "new",
    selectedHhead: {},
  }
}

export default function hheadReducer(state = initialState(), action) {
  switch (action.type) {
    case 'HHEAD_FORM_SUBMIT':
      state.formError = {};
      return state;
    case 'HHEAD_FORM_ERROR':
      return {
        ...state,
        formError: action.data,
      };
    case 'SET_HHEAD_FORM_DATA':
      return {
        ...state,
        formData: action.data,
      };
    case 'SET_HMEMBER_FORM_DATA':
      return {
        ...state,
        members: action.data,
      };
    case 'ADD_HMEMBERS':
      return {
        ...state,
        members: action.data,
      };
    case 'SET_HMEMBER_FORM_STATUS':
      return {
        ...state,
        formStatus: action.data,
      };
    case 'SET_HHEAD':
      state.selectedHhead = action.data;
      return state;
    case 'SET_HHEAD_FORM_TYPE':
      return {
        ...state,
        formType: action.data
      }
    case 'SET_INITIAL_STATE':
      state = initialState();
      return state
    case 'SET_INITIAL_HHEAD_STATE':
      state = initialState();
      return state
    default:
      return state;
  }
}
