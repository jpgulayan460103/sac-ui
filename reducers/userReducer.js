import ls from 'local-storage'

const initialState = () => {
  return {
    isLogged: false,
    accessToken: "",
    user: {},
  }
}

const userLoginDetail = () => {
  let state = {};
  state.isLogged = true;
  state.user = ls('user').user;
  state.accessToken = ls('user').access_token;
  return state;
}

export default function userReducer(state = initialState(), action) {
  if(ls('user') != null){
    state = userLoginDetail();
  }else{
    
  }
  switch (action.type) {
    case 'USER_LOGIN_SUCCESSFUL':
      ls.set('user',action.data);
      state = {
        isLogged: true,
        accessToken: action.data.accessToken,
        user: action.data.user,
      };
      return state
    case 'USER_LOGIN_FAILED':
      ls.remove('user')
      state = initialState();
      return state
    case 'SET_INITIAL_STATE':
      state = initialState();
      return state
    default:
      return state
  }
}
