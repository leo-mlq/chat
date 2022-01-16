import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Result, List, WhiteSpace, Button, Modal, InputItem, TextareaItem} from 'antd-mobile'
import Cookies from 'js-cookie'

import {resetUserDispatcher, updateDispatcher,getDispatcher,resetDispatcher} from '../../redux/actionDispatchers'
import { Redirect } from 'react-router-dom'

const Item = List.Item;
const Brief = Item.Brief;

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

class Personal extends Component{

	state={
		visible:false,
		newEmail: this.props.user.email,
		newDisplayName: this.props.user.displayName,
		newFunFact: this.props.user.funFact
	}
	handleChange=(val, s)=>{
		this.setState({
			[s]:val
		})
	}

	handleLogout=()=>{
		Modal.alert('Logout','Confirm?',[
			{
				text:'No'
			},
			{
				text: 'Yes',
				onPress: ()=>{
					Cookies.remove('userid')
					//automatically redirect to login because of if(!userid) return <Redirect to='/login'/> in main
					// /personal is technically still within /
					this.props.resetDispatcher();
				}
			}
		])
	}
	handleOpen=()=>{
		this.setState({
			visible:true
		})
	}
	handleClose=()=>{
		this.setState({
			visible:false
		})
	}
	handleSubmit=()=>{
		this.setState({
			visible:false
		})
		this.props.updateDispatcher(this.state)
	}
	onWrapTouchStart = (e) => {
		// fix touch to scroll background page on iOS
		if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
			return;
		}
		const pNode = closest(e.target, '.am-modal-content');
		if (!pNode) {
			e.preventDefault();
		}
	}

	handleRoute=(addr)=>{
		var address = '/'+addr;
		this.props.history.replace(address)
	}

	/*TODO: use hot page to prevent state being lost after refresh*/
	// componentWillReceiveProps(nextProps){
	// 	console.log("personal will receive props")
	// 	this.setState({
	// 	 params: nextProps.params
	// 	})
	//  } 
	componentWillMount(){
		//console.log("personal will mount")
		var userid = Cookies.get('userid');
		var {user}=this.props
		//instead of state persistance, query to set state
		if(userid && user._id==undefined){
			this.props.getDispatcher();
		}
	}

	render(){

		/*!!!
		componentwillmount handleroute will not stop render
		for instance, if no cookie visit personal, main "componentwillmount"->main "render"->personal->"componentwillmount"->personal render
		thus, lifecycle component is good to hook data but not act as interceptor
		*/
		//UPDATE: remove componentwillmount from main and set this into main render, no longer needed
		// var userid = Cookies.get('userid');
		// if(userid==undefined || userid==null){
		
		// 	this.props.resetUserDispatcher({message:"Please log in again"});
		// 	console.log("No cookie. Personal redirect to "+"login")
		// 	return <Redirect to="/login"/>
		// }

		//after refresh, these will be one cycle behine redux state update
		var {username, email, displayName, funFact, profilePicture} = this.props.user;
		if(profilePicture==undefined) return null;
		//console.log("personal render")
		return(
			<div style={{marginTop: '50px'}}>
				<Result
					img={<img className="logo-personal" src={require(`../../assets/images/${profilePicture}`)} alt={profilePicture}/>}
					title={displayName}
				/>
				<List renderHeader={()=>'Personal information'}>
					<Item multipleLine>
						<Brief>Username: {username}</Brief>
						<Brief>Email: {email}</Brief>
						<Brief>Fun fact: {funFact}</Brief>
					</Item>
				</List>
				<WhiteSpace size="lg" />
				<List>
					<Button type="primary" onClick={this.handleOpen}>Edit profile</Button>
			        <WhiteSpace />
			        <Modal
			          closable={true}
			          visible={this.state.visible}
          			  popup
          			  transparent
          			  animationType="slide-up"
                      maskClosable={false}
			          onClose={this.handleClose}
			          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
			          //afterClose={() => { alert('afterClose'); }}
			        >
			          <List renderHeader={() => <div>Enter new personal information</div>}>
			          	<InputItem  defaultValue={displayName} labelNumber={10} onChange={(val)=>this.handleChange(val,'newDisplayName')}>Display name:</InputItem>
			          	<InputItem  defaultValue={email} labelNumber={10} onChange={(val)=>this.handleChange(val,'newEmail')}>Email:</InputItem>
									<TextareaItem  title='Fun fact' autoHeight placeholder='optional' onChange={(val)=>this.handleChange(val, 'newFunFact')}/>
			            <List.Item>
			              <Button type="primary" onClick={this.handleSubmit}>submit</Button>
			            </List.Item>
			          </List>
			        </Modal>
					<Button type='warning' onClick={this.handleLogout}>Logout</Button>
				</List>
			</div>
		)
	}
}

export default connect(
	state=>({user: state.userReducer}),
	{resetUserDispatcher,updateDispatcher,getDispatcher,resetDispatcher}
)(Personal)