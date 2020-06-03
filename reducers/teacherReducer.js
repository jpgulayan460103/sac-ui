import ls from 'local-storage'

const initialState = () => {
  return {
    formData: {},
    formError: {},
    user: {},
    class_sections: {},
    teachers: [],
    tablePagination: {},
    searchData: {},
    selectedTeacher: {},
    updatedTeacher: {},
  }
}

export default function residentReducer(state = initialState(), action) {
  switch (action.type) {
    case 'TEACHER_FORM_SUBMIT':
      state.formError = {};
      return state
    case 'TEACHER_FORM_ERROR':
      state.formError = action.data;
      return state
    case 'UPDATE_TEACHER':
      state.updatedTeacher = action.data;
      return state
    case 'SELECT_TEACHER':
      state.selectedTeacher = action.data;
      return state
    case 'SET_CLASS_SECTION':
      state.class_sections = action.data;
      return state
    case 'SET_TEACHERS':
      state.teachers = action.data;
      return state
    case 'SET_TEACHERS_PAGINATION':
      state.tablePagination = action.data;
      return state
    case 'SET_TEACHERS_SEARCH_DATA':
      state.searchData = action.data;
      return state

    default:
      return state
  }
}
