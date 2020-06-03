import ls from 'local-storage'

const initialState = () => {
  return {
    formData: {},
    members: [
      {},{}
    ],
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
      return state
    case 'HHEAD_FORM_ERROR':
      state.formError = action.data;
      return state
    case 'SET_HHEAD_FORM_DATA':
      state.formData = action.data;
      return state
    case 'SET_HMEMBER_FORM_DATA':
      state.members = action.data;
      return state
    case 'SET_HHEAD':
      state.selectedHhead = action.data;
      return state
    case 'SET_HHEAD_FORM_STATUS':
      state.formStatus = action.data;
      return state
    case 'SET_HHEAD_FORM_TYPE':
      state.formType = action.data;
      return state
    case 'SET_INITIAL_STATE':
      state = initialState();
      return state
    default:
      return state
  }
}
