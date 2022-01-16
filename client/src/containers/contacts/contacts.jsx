import React, {Component} from 'react'
import {connect} from 'react-redux'

import UserList from '../../components/user-list/user-list'
import {getListDispatcher} from '../../redux/actionDispatchers'

class Contacts extends Component{
	componentWillMount(){
		this.props.getListDispatcher();
	}
	render(){
		
		return(
			<UserList userList={this.props.userList}/>

		)
	}
}

export default connect(
	state=>({userList: state.userListReducer}),
	{getListDispatcher}
)(Contacts)