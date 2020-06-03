import ls from 'local-storage'

const initialState = () => {
  return {
    formData: {},
    formError: {},
    subjects: [],
    tablePagination: {},
    searchData: {},
    selectedSubject: {},
    updatedSubject: {},
  }
}

export default function residentReducer(state = initialState(), action) {
  switch (action.type) {
    case 'SUBJECT_FORM_SUBMIT':
      state.formError = {};
      return state
    case 'SUBJECT_FORM_ERROR':
      state.formError = action.data;
      return state
    case 'UPDATE_SUBJECT':
      state.updatedSUBJECT = action.data;
      return state
    case 'SELECT_SUBJECT':
      state.selectedSUBJECT = action.data;
      return state
    case 'SET_CLASS_SECTION':
      state.class_sections = action.data;
      return state
    case 'SET_SUBJECTS':
      state.subjects = action.data;
      return state
    case 'SET_SUBJECTS_PAGINATION':
      state.tablePagination = action.data;
      return state
    case 'SET_SUBJECTS_SEARCH_DATA':
      state.searchData = action.data;
      return state

    default:
      return state
  }
}
