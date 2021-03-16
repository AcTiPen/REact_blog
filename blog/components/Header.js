import React, { useEffect, useState } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import servicePath from '../config/apiURL'
import '../static/style/components/header.css'
import { Row, Col, Menu, Icon } from 'antd'
const Header = () => {
    //获得文章类型信息
    const [navArray, setNavArray] = useState([])
    //第二个参数置为空，只有在第一次渲染的时候才会执行
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(servicePath.getTypeInfo).then(
                (res) => {
                    //获取文章类型
                    setNavArray(res.data.data)
                    return res.data.data
                }
            )
            setNavArray(result)
        }
        fetchData()
    }, [])
    //点击跳转
    const handleClick = (e) => {
        if (e.key === '0') {
            Router.push('/')
        } else {
            Router.push('/list?id=' + e.key)
        }
    }
    return (
        <div className='header'>
            <Row type='flex' justify='center'>
                <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                    <span className='header-logo'>Hello</span>
                    <span className='header-txt'>Happy Coding</span>
                </Col>
                <Col className="menu-div" xs={0} sm={0} md={14} lg={8} xl={8}>
                    <Menu mode='horizontal' onClick={handleClick}>
                        <Menu.Item key="0">
                            <Icon type="home" />
                            博客首页
                        </Menu.Item>
                        {
                            navArray.map((item) => {
                                return (
                                    <Menu.Item key={item.Id}>
                                        <Icon type={item.icon} />
                                        {item.typeName}
                                    </Menu.Item>
                                )
                            })
                        }
                    </Menu>
                </Col>
            </Row>
        </div>
    )
}
export default Header