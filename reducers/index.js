import { combineReducers } from 'redux'
import user from './userReducer'
import student from './studentReducer'
import beneficiary from './beneficiaryReducer'
import teacher from './teacherReducer'
import subject from './subjectReducer'
import appDefault from './appDefaultReducer'
import classSection from './classSectionReducer'
import smsBlast from './smsBlastReducer'
import scoreItem from './scoreItemReducer'

const rootReducer = combineReducers({
  // user,
  // student,
  // teacher,
  // subject,
  // appDefault,
  // classSection,
  // smsBlast,
  // scoreItem,
  beneficiary,
})

export default rootReducer
