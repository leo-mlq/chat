import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavBar, List, InputItem, WhiteSpace, Grid, Icon} from 'antd-mobile'
import {Redirect} from 'react-router-dom'
import QueueAnim from 'rc-queue-anim';
import Moment from 'react-moment';

import {sendDispatcher,readMsgDispatcher} from '../../redux/actionDispatchers'
import '../../assets/index.less'

const Item = List.Item
const Brief = Item.Brief

class Chat extends Component{

	state={
		content: '',
		isEmoji: false
	}

	handleChange=(val)=>{
		this.setState({
			content:val
		})
	}

	handleSend=()=>{
		const from = this.props.user._id;
		const to = this.props.match.params.userid;
		//console.log(to)
		const content = this.state.content.trim();
		if(content){
			this.props.sendDispatcher({from, to, content});
		}
		this.setState({
			isEmoji: false,
			content:''
		})
	}
	//resolve emoji pad does not fully slide up
	toggleShow=()=>{
		const isEmoji = !this.state.isEmoji;
		this.setState({isEmoji});
		if(isEmoji){
			setTimeout(()=>{
				window.dispatchEvent(new Event('resize'))
			}, 0)
		}
	}

	componentWillMount () {
	    
	    const emojis = ['😀', '😁', '🤣','🥺', '🥺','😘', '😍', '😚','😛', '😁', '😏', '😅','🥺'
	      ,'🥺', '👪','💏', '🤟', '🔥','🦠', '👍', '❤️','😂', '😈', '😡'
	      ,'😥', '😆','😮', '🤧', '🥵','🥶', '🤕', '😷','😴', '🤤', '😪'
	      ,'🤥', '😬','🙄', '👨‍🎓', '👩‍🎓','🙋‍♂️', '🙋‍♀️', '🙏','👏', '👊', '👌']
	    this.emojis = emojis.map(emoji => ({text: emoji}))
	}

	//scroll to bottom after opening a chat
	componentDidMount(){
		window.scrollTo(0, document.body.scrollHeight);
}

	componentWillUnmount(){
		//once a chat is closing, mark messages sent to me 'read'
		const curUserId = this.props.user._id;
		const chatTargetId = this.props.match.params.userid;
		this.props.readMsgDispatcher(chatTargetId, curUserId);
	}

	//scroll to bottom after sending a message
	componentDidUpdate(){
		window.scrollTo(0, document.body.scrollHeight);
	}
	render(){

		const {users, chatMsgs} = this.props.chat;

		const curUserId = this.props.user._id;
		const chatTargetId = this.props.match.params.userid;

		if(!users[curUserId]) return null;

		const chatTargetName = users[chatTargetId].displayName

		const curUserPic = require(`../../assets/images/${this.props.user.profilePicture}`);
		const chatTargetPic = require(`../../assets/images/${users[chatTargetId].profilePicture}`);

		const chatId = [curUserId, chatTargetId].sort().join('-')
		const msgs = chatMsgs.filter(msg=>msg.chat_id===chatId);


		return(
			<div id='chat-page'>
				<NavBar icon={<Icon type='left' onClick={()=>{this.props.history.goBack()}}/>} 
						className='nav_bottom--sticky'>
						{chatTargetName}
				</NavBar>

				<List style={{margin: '50px 0'}}>
					{
						msgs.map(msg=>{
							//send to me
							if(msg.from===chatTargetId){
								return(	<Item key={msg._id} thumb={chatTargetPic}>
											{msg.content}
											<Brief><Moment fromNow>{msg.create_on}</Moment></Brief>
										</Item>
								)
							}
							else{
								return(
										<Item key={msg._id} className='chat-me' multipleLine={true} wrap={true}>
											<div className='chat-me-text'>{msg.content}</div>
											<img className='chat-me-img'src={curUserPic}/>
											<Brief><Moment fromNow>{msg.create_on}</Moment></Brief>
										</Item>
								)
							}
						})
					}
				</List>

				<div className='am-tab-bar'>
					<InputItem placeholder='enter here' 
								value={this.state.content} 
								onChange={(val)=>this.handleChange(val)} 
								onFocus={()=>this.setState({isEmoji:false})}
								extra={
										<div>
											<span onClick={this.toggleShow} style={{marginRight:'5px',fontSize:'80%'}}>😊</span> 
											<span onClick={this.handleSend}>send</span>
										</div>
									}
					/>
					{this.state.isEmoji?
					(<Grid
						data={this.emojis}
						columnNum={8}
						carouselMaxRow={4}
						isCarousel={true}
						style={{touchAction: 'none'}}
						onClick={(item)=>{this.setState({content:this.state.content + item.text})}}
					/>):null}
				</div>
			</div>
		)
	}
}

export default connect(
	state=>({user:state.userReducer, chat: state.chatReducer}),
	{sendDispatcher,readMsgDispatcher}
)(Chat)