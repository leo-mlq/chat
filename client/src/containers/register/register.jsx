import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {NavBar,
		WingBlank, 
		List, 
		InputItem,
		WhiteSpace,
		Button
		} from 'antd-mobile'

import Logo from '../../components/logo/logo'
import {registerDispatcher, resetDispatcher} from '../../redux/actionDispatchers'


class Register extends Component{
	state = {
		username: "",
		password: "",
		email: "",
	}
	//unbinded function, will need to wrap in an arrow function (arrow function binds) if need to pass in parameters
	handleChange = (s, val)=>{
		this.setState({
			[s]: val
		})
	}
	handleRegister=()=>{
		this.props.resetDispatcher();
		this.props.registerDispatcher(this.state)
	}
	handleRoute=(addr)=>{
		this.props.history.replace(addr)
	}
	// componentDidUpdate(prevProps, prevState){
	// 	if(this.props.user.redirectTo !== prevProps.user.redirectTo){
	// 		const {message, redirectTo} = this.props.user;
	// 		if(redirectTo){
	// 			this.handleRoute('profileInit')
	// 		}
	// 	}
	// }
	render(){
		const {message, redirectTo} = this.props.user;
		if(redirectTo){
			return <Redirect to={redirectTo}/>
		}
		return(
			<div>
				<NavBar mode="dark">Chat</NavBar>
				<WhiteSpace size="lg"/>
				<Logo/>
				<WhiteSpace size="lg"/>
				<WingBlank>
					<form>
						<List>
							<InputItem style={{fontWeight: 'bold'}}  onChange={val=>{this.handleChange('username',val)}}>Username:</InputItem>
							<WhiteSpace/>
							<InputItem  style={{fontWeight: 'bold'}} type="password" onChange={val=>{this.handleChange('password',val)}}>Password:</InputItem>
							<WhiteSpace/>
							<InputItem style={{fontWeight: 'bold'}}  placeholder="To retrieve password" onChange={val=>{this.handleChange('email',val)}}>Email</InputItem>
						</List>
					</form>
					{message? <div className='error-msg'>{message}</div>:null}
					<WhiteSpace/>
					<Button type="primary" onClick={this.handleRegister}>Register</Button>
					<WhiteSpace/>
					<Button onClick={()=>{this.props.resetDispatcher();this.handleRoute('/login')}}>Have an account?</Button>
				</WingBlank>

			</div>
		)
	}
}

//skip mapStateToprops and mapDispatchToProps to simplify
//state refers to redux store state, reducers are combined
export default connect(
	state=>({user: state.userReducer}),
	{registerDispatcher, resetDispatcher}
)(Register)