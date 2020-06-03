import ls from 'local-storage'

const initialState = () => {
  return {
    formData: {},
    formError: {},
    user: {},
    class_sections: {},
    scoreItems: [],
    tablePagination: {},
    searchData: {},
    selectedStudent: {},
    updatedStudent: {},
  }
}

export default function scoreItemReducer(state = initialState(), action) {
  switch (action.type) {
    case 'SCORE_ITEM_FORM_SUBMIT':
      state.formError = {};
      return state
    case 'SCORE_ITEM_FORM_ERROR':
      state.formError = action.data;
      return state
    case 'UPDATE_SCORE_ITEM':
      state.updatedStudent = action.data;
      return state
    case 'SELECT_SCORE_ITEM':
      state.selectedStudent = action.data;
      return state
    case 'SET_CLASS_SECTION':
      state.class_sections = action.data;
      return state
    case 'SET_SCORE_ITEMS':
      state.scoreItems = action.data;
      return state
    case 'SET_SCORE_ITEMS_PAGINATION':
      state.tablePagination = action.data;
      return state
    case 'SET_SCORE_ITEMS_SEARCH_DATA':
      state.searchData = action.data;
      return state

    default:
      return state
  }
}
