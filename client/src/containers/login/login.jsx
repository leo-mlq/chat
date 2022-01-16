import React, {Component} from 'react'
import {Router,Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {NavBar,
		WingBlank, 
		List, 
		InputItem,
		WhiteSpace,
		Button,
		Modal
		} from 'antd-mobile'

import Logo from '../../components/logo/logo'
import {loginDispatcher, resetDispatcher, retrieveLoginDispatcher} from '../../redux/actionDispatchers.js'

const prompt = Modal.prompt;

class Login extends Component{
	state = {
		username: "",
		password: "",
	}
	handleChange = (s, val)=>{
		this.setState({
			[s]: val
		})
	}
	handleLogin=()=>{
		this.props.resetDispatcher();
		this.props.loginDispatcher(this.state)
	}
	handleRoute=(addr)=>{
		this.props.history.replace(addr)
	}
	componentDidUpdate(prevProps, prevState){
		if(this.props.user.redirectTo !== prevProps.user.redirectTo){
			const {message, redirectTo} = this.props.user;
			if(redirectTo){
				//console.log("Login redirect to "+redirectTo )
				this.handleRoute(redirectTo);	
			}
		}
	}

	render(){
		const {message, redirectTo} = this.props.user;
		return(
			<div>
				<NavBar mode="dark">Chat</NavBar>
				<WhiteSpace size="lg"/>
				<Logo/>
				<WhiteSpace size="lg"/>
				<WingBlank>
					{message? <div className='error-msg'>{message}</div>:null}
					<form>
						<List>
							<InputItem style={{fontWeight: 'bold'}} onChange={val=>{this.handleChange('username',val)}}>Username: </InputItem>
							<WhiteSpace/>
							<InputItem  style={{fontWeight: 'bold'}} type="password" onChange={val=>{this.handleChange('password',val)}}>Password: </InputItem>
						</List>
					</form>
					
					<WhiteSpace/>
					<Button type="primary" onClick={this.handleLogin}>Login</Button>
					<WhiteSpace/>
					<Button onClick={()=>{this.props.resetDispatcher();this.handleRoute('/register')}}>Register</Button>
					<WhiteSpace/>
					<Button onClick={()=>{
						prompt('Retrieve login info', 'You will recieve an Email', 
						[{ text: 'Cancel' },
						{ text: 'Submit', onPress: value => this.props.retrieveLoginDispatcher(value) },],
						'default', null, ['input your username'])}
					}>
					Forget password?
					</Button>

				</WingBlank>

			</div>
		)
	}
}

export default connect(
	state=>({user: state.userReducer}),
	{loginDispatcher,resetDispatcher,retrieveLoginDispatcher}
)(Login)