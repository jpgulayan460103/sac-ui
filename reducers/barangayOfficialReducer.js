import ls from 'local-storage'

const initialState = () => {
  return {
    formData: {},
    formError: {},
    user: {},
    barangayOfficials: [],
    tablePagination: {},
    searchData: {},
  }
}

export default function residentReducer(state = initialState(), action) {
  switch (action.type) {
    case 'BARANGAY_OFFICIAL_FORM_SUBMIT':
      state.formError = {};
      return state
    case 'BARANGAY_OFFICIAL_FORM_ERROR':
      state.formError = action.data;
      return state
    case 'SET_BARANGAY_OFFICIAL':
      state.barangayOfficials = action.data;
      return state
    case 'SET_BARANGAY_OFFICIAL_PAGINATION':
      state.tablePagination = action.data;
      return state
    case 'SET_BARANGAY_OFFICIAL_SEARCH_DATA':
      state.searchData = action.data;
      return state

    default:
      return state
  }
}
