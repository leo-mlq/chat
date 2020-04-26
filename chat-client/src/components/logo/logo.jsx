import React from 'react'
import '../../assets/index.less'
import logo from '../../assets/logo.png'

export default function Logo(){
	return(
		<div className="logo-container">
			<img src ={logo} alt="logo" className='logo-img'/>
		</div>
	)
}