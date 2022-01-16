import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {WingBlank, WhiteSpace, Card} from 'antd-mobile'
import {withRouter} from 'react-router-dom'
import QueueAnim from 'rc-queue-anim';

const Header = Card.Header
const Body = Card.Body

class UserList extends Component{
	static propTypes = {
		userList: PropTypes.array.isRequired
	}
	render(){
		return(
			<WingBlank style={{margin: '50px 0'}}>
				<QueueAnim type="scale">
				{this.props.userList.map(user=>{
					if(user.profilePicture !=undefined && user.displayName!=undefined){
						return(
						<div key={user._id}>
							<WhiteSpace/>
							<Card onClick={()=>this.props.history.push(`/chat/${user._id}`)}>
								<Header thumb={require(`../../assets/images/${user.profilePicture}`)} extra={user.displayName} />
								<Body>
									<div>Email: {user.email}</div>
									{user.funFact?<div>Fun fact: {user.funFact}</div>:null}
								</Body>
							</Card>
						</div>
						)
					}
					})
				}
				</QueueAnim>
			</WingBlank>
		)
	}
}
export default withRouter(UserList)