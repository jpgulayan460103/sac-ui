const initialState = () => {
  return {
    tracks: [],
    quarters: [],
    semesters: [],
    teachers: [],
    menuCollapsed: false,
  }
}

export default function appDefaultReducer(state = initialState(), action) {
  switch (action.type) {
    case 'SET_TRACKS':
      state.tracks = action.data;
      return state;
    case 'SET_QUARTERS':
      state.quarters = action.data;
      return state;
    case 'SET_ALL_TEACHERS':
      state.teachers = action.data;
      return state;
    case 'SET_MENU_COLLAPSED':
      state.menuCollapsed = action.data;
      return state;
    case 'SET_SEMESTERS':
      state.semesters = action.data;
      return state;
    default:
      return state;
  }
}
