import React, {Component} from 'react'
import {connect} from 'react-redux'
import {List, Badge} from 'antd-mobile'
import QueueAnim from 'rc-queue-anim';
import Moment from 'react-moment';
import Cookies from 'js-cookie';
import {getDispatcher,getChatMsgListDispatcher} from '../../redux/actionDispatchers'

const Item = List.Item
const Brief = Item.Brief

//divide messages into different groups according to target id 
//return the latest messages as an array

function getLatestMsgs(chatMsgs, userid){
	var latestMsgsObj={};
	let chatMsgsTemp = chatMsgs.map((x) => x);
	chatMsgsTemp.forEach(msg=>{
		const chatId = msg.chat_id;
		var latestMsg=latestMsgsObj[chatId];
		var unread=(!msg.read && msg.to===userid)?1:0;
		if(!latestMsg){
			latestMsgsObj[chatId]=msg
			//latestMsgsObj[chatId].unreadCount = unread;
		}
		else{
			//var temp = latestMsgsObj[chatId].unreadCount+unread;
			if(msg.create_on>latestMsg.create_on){
				latestMsgsObj[chatId]=msg;

			}
			//latestMsgsObj[chatId].unreadCount = temp;
		}
	})
	
	const latestMsgs = Object.values(latestMsgsObj);
	latestMsgs.sort((msg1, msg2)=>{
		return msg2.create_on-msg1.create_on
	})
	
	return latestMsgs;

}

class Message extends Component{

	componentWillMount(){
		//console.log("Message will mount")
		var userid = Cookies.get('userid');
		var {user}=this.props
		//on refresh:instead of state persistance, query to set state
		if(userid && user._id==undefined){
		    //console.log("Message will mount, _id is undefined")
			this.props.getDispatcher();
		}
		//console.log("Message will mount, _id is defined")
		if(user._id!=undefined) this.props.getChatMsgListDispatcher(user._id);
	}

	componentWillReceiveProps(nextProps){
	    //console.log("Message will will receive props")
		if(this.props.user._id!=nextProps.user._id){
			//console.log("Message will will receive props, new _id")
			this.props.getChatMsgListDispatcher(nextProps.user._id);
		}
	}
	render(){
	    //console.log("Message renders")
		if(this.props.user._id==undefined){
			//console.log("Message renders, _id is undefined")
			return null;
		}
		const {user} = this.props;
		const {users, chatMsgs, unreadCount} = this.props.chat;
		const latestMsgs = getLatestMsgs(chatMsgs,user._id);

		return(
			<List style={{margin:'50px 0'}}>
				<QueueAnim type="scale">
				{
					latestMsgs.map(msg=>{
						
						const tarGetUserId=msg.to===user._id?msg.from:msg.to;
						const targetUser=users[tarGetUserId];
						return( 
						<Item 
							key={msg._id}
							extra={<Badge text={unreadCount}/>}
							thumb={require(`../../assets/images/${targetUser.profilePicture}`)}
							arrow='horizontal'
							onClick={()=>this.props.history.push(`/chat/${tarGetUserId}`)}
						>
							{targetUser.displayName}
							<Brief>{msg.content}, <Moment fromNow>{msg.create_on}</Moment></Brief>
						</Item>
						)
					})
				}
				</QueueAnim>
			</List>
		)
	}
	
}

export default connect(
	state=>({user: state.userReducer, chat: state.chatReducer}),
	{getDispatcher, getChatMsgListDispatcher},
)(Message)