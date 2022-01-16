import {combineReducers} from 'redux'

const initUser={
	username: '',
	email: '',
	message: '',
	redirectTo: ''
}

const userReducer = (state=initUser, action)=>{
	switch(action.type){
		case "AUTH_SUCCESS":
		  return action.item
		case "ERR_MSG":
		  return {...state, message: action.item}
		case "RESET":
		  return initUser
		case "RECEIVE_USER":
		  return {...state, ...action.item}
		case "RESET_USER":
		  return {...initUser,...action.item}
		default:
		  return state
	}
}

const initUserList=[]

const userListReducer = (state=initUserList, action)=>{
	switch(action.type){
		case "RECEIVE_USERLIST":
			return action.item
		case "RESET":
			return initUserList;
		default:
			return state
	}
}

const initChat={
	users: {},
	chatMsgs: [],
	unreadCount: 0
}


const chatReducer = (state=initChat, action)=>{
	switch(action.type){
		case "RECEIVE_CHATMSGLIST":
			//console.log(action.item)
			//console.log(action.item.chatMsgs.reduce((preTotal, msg)=>(preTotal+((!msg.read && msg.to===action.item.userId)?1:0)),0))
			var ret={
				users: action.item.users,
				chatMsgs: action.item.chatMsgs,
				unreadCount: action.item.chatMsgs.reduce((preTotal, msg)=>(preTotal+((!msg.read && msg.to===action.item.userId)?1:0)),0)
			}
			return ret
		case "RECEIVE_CHATMSG":
			var {chatMsg} = action.item;
			//console.log((!chatMsg.read && chatMsg.to===action.item.userId));
			var ret={
				users: state.users,
				chatMsgs: [...state.chatMsgs,chatMsg],
				unreadCount: state.unreadCount + ((chatMsg.read==false && chatMsg.to===action.item.userId)?1:0)
			}
			return ret
		case "READ_MSG":
			var ret={
				users: state.users,
				chatMsgs: state.chatMsgs.map(msg=>{
					if(msg.to===action.item.userId && msg.from===action.item.targetId && msg.read===false){
						return {...msg, read:true}
					}
					else return msg
				}),
				unreadCount: state.unreadCount-action.item.numMsgsRead
			}
			return ret
		case "RESET":
			return initChat;
		default:
			return state
	}

}

export default combineReducers({
	userReducer,
	userListReducer,
	chatReducer
})