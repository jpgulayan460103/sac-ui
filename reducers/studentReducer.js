import ls from 'local-storage'

const initialState = () => {
  return {
    formData: {},
    formError: {},
    user: {},
    class_sections: {},
    students: [],
    tablePagination: {},
    searchData: {},
    selectedStudent: {},
    updatedStudent: {},
  }
}

export default function residentReducer(state = initialState(), action) {
  switch (action.type) {
    case 'STUDENT_FORM_SUBMIT':
      state.formError = {};
      return state
    case 'STUDENT_FORM_ERROR':
      state.formError = action.data;
      return state
    case 'UPDATE_STUDENT':
      state.updatedStudent = action.data;
      return state
    case 'SELECT_STUDENT':
      state.selectedStudent = action.data;
      return state
    case 'SET_CLASS_SECTION':
      state.class_sections = action.data;
      return state
    case 'SET_STUDENTS':
      state.students = action.data;
      return state
    case 'SET_STUDENTS_PAGINATION':
      state.tablePagination = action.data;
      return state
    case 'SET_STUDENTS_SEARCH_DATA':
      state.searchData = action.data;
      return state

    default:
      return state
  }
}
