import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import markers from './modules/counter'

export default combineReducers({
  markers,
  router
})
