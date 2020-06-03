const initialState = () => {
  return {
    formData: {},
    members: [],
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
    case 'BENEFICIARY_FORM_SUBMIT':
      state.formError = {};
      return state
    case 'SET_BENEFICIARY_FORM_DATA':
      state.formData = {
        ...state.formData,
        ...action.data
      };
      return state
    case 'SET_BENEFICIARY_MEMBER_FORM_DATA':
      state.members[action.data.index] = {
        ...state.members[action.data.index],
        ...action.data.data
      };
      return state
    default:
      return state
  }
}
