import React,{Component} from 'react'
import {HashRouter,Switch, Route, Redirect, IndexRedirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
import {NavBar} from 'antd-mobile'

import ProfileInit from '../profile/profileInit'
import Personal from '../personal/personal'
import Contacts from '../contacts/contacts'
import Message from '../message/message'
import NotFound from '../../components/not-found/not-found'
import {getRedirectTo} from '../../utils/utils'
import {getDispatcher, getChatMsgListDispatcher,resetUserDispatcher} from '../../redux/actionDispatchers'
import NavFooter from '../../components/nav-footer/nav-footer'
import Chat from '../chat/chat'
import login from '../login/login'


class Main extends Component{
	navList=[
		{
			path: '/contact',
			component: Contacts,
			title: 'Contacts',
			icon: 'contacts',
			text: 'contacts'
		},
		{
			path: '/message',
			component: Message,
			title: 'Messages',
			icon: 'message',
			text: 'message'
		},
		{
			path: '/personal',
			component: Personal,
			title: 'Personal',
			icon: 'personal',
			text: 'personal'
		}	

	]

	handleRoute=(addr)=>{
		var address = '/'+addr;
		this.props.history.replace(address)
	}

	// componentWillMount(){
	// 	console.log("main will mount")
	// 	// var userid = Cookies.get('userid');
	// 	// var {user}=this.props
	// 	// //instead of state persistance, query to set state
	// 	// if(userid && user._id==undefined){
	// 	// 	this.props.getDispatcher();
	// 	// }
	// 	this.props.getChatMsgListDispatcher(this.props.user._id);
	// }


	render(){
		var userid = Cookies.get('userid');
		if(userid==undefined || userid==null){
		
			this.props.resetUserDispatcher({message:"Please log in again"});
			//console.log("No cookie. Personal redirect to "+"login")
			return <Redirect to="/login"/>
		}

		//console.log("main render")
		const {user}=this.props;
		const path = this.props.location.pathname;

		if(path === '/'){
			//check if user exists in redux, could be lost if refresh
			if(!user._id){
				this.props.resetUserDispatcher({message:"Please log in again"});
				return <Redirect to = '/login'/>
			}
			//check if profile setup is done 
			if(!user.profilePicture){
				return <Redirect to = '/profileInit'/>
			}
			else return <Redirect to='/message'/>
		}

		const {navList}=this;
		//currentNav could be empty, s.a. '/profileInit'
		const currentNav = navList.find(nav=>nav.path===path)

		return(
			<div>
				{currentNav? <NavBar className='nav_bottom--sticky'>{currentNav.title}</NavBar>:null}
		
					<Switch>

						{
							navList.map(nav=>{
								return <Route key={nav.path} path={nav.path} component={nav.component}/>
							})
						}
						
						<Route path='/profileInit/' component={ProfileInit}/>
						<Route path='/chat/:userid' component={Chat}/>
						
					</Switch>
	
				{currentNav? <div><NavFooter navList={navList} unreadCount={this.props.chat.unreadCount}/></div>:null}
			</div>
		)
	}
}

export default connect(
	state=>({user: state.userReducer, chat:state.chatReducer}),
	{getDispatcher, getChatMsgListDispatcher,resetUserDispatcher}
)(Main)