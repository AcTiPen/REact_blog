import React, { useState } from 'react'
import 'antd/dist/antd.css'
import { Button, Card, Input, Icon, Spin, message } from 'antd'
import '../static/css/Login.css';
import servicePath from '../config/apiURL'

import axios from 'axios'
function Login(props) {

    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const checkLogin = () => {
        setIsLoading(true)
        if (!userName) {
            message.error('猪猪名称不能为空')
            setTimeout(()=>{
                setIsLoading(false)
            },1000)
            return false
        } else if (!password) {
            message.error('猪猪密码不能为空')
            setTimeout(()=>{
                setIsLoading(false)
            },1000)
            return false
        }
        let dataProps = {
            'userName': userName,
            'password': password
        }
        axios({
            //axios请求方式
            method: 'post',
            //axios请求路径
            url: servicePath.checkLogin,
            //axios数据来源
            data: dataProps,
            //前后端共享
            withCredentials: true
        }).then(
            (res) => {
                setIsLoading(false)
                if (res.data.data === '猪猪认证成功！') {
                    localStorage.setItem('openId', res.data.openId)
                    props.history.push('/index')
                }else{
                    message.error('？？？猪猪认证失败')
                }
            }
        )
    }
    return (
        <div className='login-div'>
            {/* 防止重复提交 */}
            <Spin tip='Loading...' spinning={isLoading}>
                <Card title='芋圆小猪猪Blog 登录！' bordered={true} style={{ width: 400 }}>
                    <Input
                        id='userName'
                        size='large'
                        placeholder='输入猪猪名称'
                        prefix={
                            <Icon type='heart' style={{ color: 'rgba(0,0,0,.25)' }} />
                        }
                        onChange={(e) => {
                            setUserName(e.target.value)
                        }}
                    />
                    <br></br>
                    <br></br>
                    <Input.Password
                        id='password'
                        size='large'
                        placeholder='输入猪猪密码'
                        prefix={
                            <Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />
                        }
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                    />
                    <br></br>
                    <br></br>
                    <Button type='primary' size='large' block onClick={checkLogin}>
                        猪猪认证！
                    </Button>
                </Card>
            </Spin>
        </div >
    )
}
export default Login