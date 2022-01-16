import React, {Component} from 'react'
import {TabBar} from 'antd-mobile'
import {PropTypes} from 'prop-types'
import {withRouter} from 'react-router-dom'

class NavFooter extends Component{
	static propTypes={
		navList: PropTypes.array.isRequired,
		unreadCount: PropTypes.number.isRequired
	}

	render(){
		const path=this.props.location.pathname
		return(
			<TabBar>
				{this.props.navList.map(nav=>{
						return <TabBar.Item key={nav.path} 
											badge={nav.path==='/message'?this.props.unreadCount:null}
											icon={{uri: require(`../../assets/navImages/${nav.icon}.png`)}}
											selectedIcon={{uri: require(`../../assets/navImages/${nav.icon}-selected.png`)}}
											selected= {path===nav.path}
											onPress={()=>this.props.history.replace(nav.path)}/>
					}
				)}
			</TabBar>

		)
	}
}

//use Route apis(history/location/math) in non-route components
export default withRouter(NavFooter)