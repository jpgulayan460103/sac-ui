import ls from 'local-storage'

const initialState = () => {
  return {
    recipients: {},
    formError: {},
    sentCount: 0,
    sendStatus: false,
    formError: {},
  }
}

export default function smsBlastReducer(state = initialState(), action) {
  switch (action.type) {
    case 'SET_SMS_RECIPIENT':
      state.recipients = action.data;
      return state
    case 'SET_SMS_SENT_COUNT':
      state.sentCount = state.sentCount + 1;
      return state
    case 'SMS_FORM_ERROR':
      state.formError = action.data;
      return state
    case 'SET_SMS_SENDING_STATUS':
      state.sendStatus = action.data;
      if(!action.data){
        state.sentCount = 0;
      }
      return state
    default:
      return state
  }
}
