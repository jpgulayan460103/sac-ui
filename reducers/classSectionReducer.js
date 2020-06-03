import ls from 'local-storage'

const initialState = () => {
  return {
    formData: {},
    formError: {},
    formType: "class-section",
    user: {},
    barangays: {},
    classSections: [],
    selectedClassSection: {},
    updatedClassSection: {},
    tablePagination: {},
    searchData: {},
    students: [],
    subjects: [],
  }
}

export default function residentReducer(state = initialState(), action) {
  switch (action.type) {
    case 'CLASS_SECTION_FORM_SUBMIT':
      state.formError = {};
      return state
    case 'CLASS_SECTION_FORM_ERROR':
      state.formError = action.data;
      return state
    case 'UPDATE_CLASS_SECTION':
      state.updatedClassSection = action.data;
      return state
    case 'SELECT_CLASS_SECTION':
      state.selectedClassSection = action.data;
      return state
    case 'SET_CLASS_SECTIONS':
      state.classSections = action.data;
      return state
    case 'SET_CLASS_SECTIONS_PAGINATION':
      state.tablePagination = action.data;
      return state
    case 'SET_CLASS_SECTIONS_SEARCH_DATA':
      state.searchData = action.data;
      return state
    case 'SET_CLASS_SECTION_FORM_TYPE':
      state.formType = action.data;
      return state
    case 'SELECT_CLASS_SECTION_STUDENTS':
      state.students = action.data;
      return state
    case 'SELECT_CLASS_SECTION_SUBJECTS':
      state.subjects = action.data;
      return state

    default:
      return state
  }
}
