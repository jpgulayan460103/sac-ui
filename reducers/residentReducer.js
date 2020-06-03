import ls from 'local-storage'

const initialState = () => {
  return {
    formData: {},
    formError: {},
    user: {},
    barangays: {},
    residents: [],
    tablePagination: {},
    searchData: {},
  }
}

export default function residentReducer(state = initialState(), action) {
  switch (action.type) {
    case 'RESIDENT_FORM_SUBMIT':
      state.formError = {};
      return state
    case 'RESIDENT_FORM_ERROR':
      state.formError = action.data;
      return state
    case 'SET_BARANGAY':
      state.barangays = action.data;
      return state
    case 'SET_RESIDENTS':
      state.residents = action.data;
      return state
    case 'SET_RESIDENTS_PAGINATION':
      state.tablePagination = action.data;
      return state
    case 'SET_RESIDENTS_SEARCH_DATA':
      state.searchData = action.data;
      return state

    default:
      return state
  }
}
