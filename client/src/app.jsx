import React from 'react';
import {Provider} from 'react-redux'
import {HashRouter, Route, Switch, Redirect} from 'react-router-dom'

import Register from './containers/register/register'
import Login from './containers/login/login'
import Main from './containers/main/main'
import store from './redux/store'
import NotFound from './components/not-found/not-found'


const App = () => (
	<Provider store={store}>
		<HashRouter>
			<Switch>
				
				<Route path='/register' component={Register}/>
				<Route path='/login' component={Login}/>
				<Route path='/' component={Main}/>
				<Route component={NotFound}/>
			</Switch>
		</HashRouter>
	</Provider>
);

export default (App);