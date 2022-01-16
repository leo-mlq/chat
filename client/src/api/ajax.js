//return promises
import axios from 'axios'
import { Toast } from 'antd-mobile'
//const baseUrl = '/'
const baseUrl = 'https://mm0917.xyz/project/chat/api/'
//const baseUrl = 'http://127.0.0.1:19591/'


axios.interceptors.request.use(config => {
    Toast.loading()
    return config
})
axios.interceptors.response.use(config => {
    Toast.hide()
    return config
})

export default function ajax(url, data={}, type='GET') {

  url = baseUrl + url
  if(type==='GET') { 
    // data: {username: tom, password: 123}
    // paramStr: username=tom&password=123
    let paramStr = ''
    Object.keys(data).forEach(key => {
      paramStr += key + '=' + data[key] + '&'
    })
    if(paramStr) {
      paramStr = paramStr.substring(0, paramStr.length-1)
    }

    return axios.get(url + '?' + paramStr,{credentials: 'include'})
  } else {
    //dev server
    //return axios.post(url, data)
    return axios.post(url, data,{credentials: 'include'})
  }
}