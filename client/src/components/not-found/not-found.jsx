import React, {Component} from 'react'
import {Button, List} from 'antd-mobile'


export default class NotFound extends Component{
	render(){
		return(
			<div>
				 <List style={{ margin: '5px 0'}}>
					<List.Item extra={<Button type="ghost" inline size="small" onClick={()=>{this.props.history.replace('/login')}}>Login</Button>}>
						<h2 style={{diplay: "inline"}}>404, page not found</h2>
					</List.Item>

				</List>
			</div>
		)
	}
}