import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import reducers from './reducers'

//use thunk to hanlde asyc actions
export default createStore(reducers,composeWithDevTools(applyMiddleware(thunk))) 