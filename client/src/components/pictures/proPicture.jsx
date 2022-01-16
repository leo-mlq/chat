import React, {Component} from 'react'
import {List, Grid} from 'antd-mobile'
import Proptypes from 'prop-types'

const imgNames = [];
function importAll(r) {
  return Array.from(r.keys().map(img=>{
  		var imgName = img.slice(2,img.length)
  		imgNames.push(imgName);
  		return({
  			icon: require(`../../assets/images/${imgName}`)}
  		)
  	}
  ));
}
const images = importAll(require.context('../../assets/images/', false, /\.(png|jpe?g|svg)$/));

export default class ProfilePicture extends Component{
	//propType for validating any data we are receiving from props
	static propTypes = {
		setProfilePicture: Proptypes.func.isRequired
	}
	constructor(props){
		super(props);
		this.state={
			icon: null
		}
	}
	handleSelect=(el,idx)=>{
		this.setState({
			icon:require(`../../assets/images/${imgNames[idx]}`)
		})
		this.props.setProfilePicture(imgNames[idx]);
	}
	render(){
		const listHeader = !this.state.icon? 'Select profile picture':(
			<div>
				profile picture: <img src={this.state.icon}/>
			</div>
		);
		return(
			<List renderHeader={()=>listHeader}>
				<Grid data={images} columnNum={3} onClick={(el,idx)=>this.handleSelect(el,idx)}/>
			</List>
		)
	}
}