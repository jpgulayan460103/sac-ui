import ls from 'local-storage'

const initialState = () => {
  return {
    isLogged: false,
    accessToken: "",
    user: {},
    guidelineDrawer: false,
    exportData: {},
    exporting: false
  }
}

const userLoginDetail = () => {
  let state = {};
  state.isLogged = true;
  state.user = ls('user').user;
  state.accessToken = ls('user').createdToken.access_token;
  return state;
}

export default function userReducer(state = initialState(), action) {
  if(ls('user') != null){
    state = userLoginDetail();
  }else{
    
  }
  switch (action.type) {
    case 'SHOW_GUIDELINES':
      return {
        ...state,
        guidelineDrawer: action.data
      };
    case 'USER_LOGIN_FAILED':
      ls.remove('user')
      state = initialState();
      return state
    case 'SET_HHEAD_EXPORT_REQUEST':
      return {
        ...state,
        exportData: action.data
      }
    case 'SET_HHEAD_EXPORTING':
      return {
        ...state,
        exporting: action.data
      }
    case 'SET_INITIAL_STATE':
      state = initialState();
      return state
    default:
      return state
  }
}
