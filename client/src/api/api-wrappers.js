import ajax from './ajax'

//register
export const reqRegister = (user) => ajax('register', user, 'POST')
// login
export const reqLogin = ({username, password}) => ajax('login',{username, password}, 'POST')
//retrieve info
export const reqRetrieve = (username)=> ajax('findInfo', {username},'POST')
//initialize
export const reqInit = (user) => ajax('initialize',user, 'POST')
//get user info
export const reqGet = ()=>ajax('user')
//update user
export const reqUpdate= (user)=>ajax('update', user, 'POST')
//get user list
export const reqUserList = ()=>ajax('userList')
//get chat msg list
export const reqChatMsgList = ()=>ajax('msgList')
//change msg to read status
export const reqChatMsgRead = (from)=>ajax('readMsg',from, 'POST')
