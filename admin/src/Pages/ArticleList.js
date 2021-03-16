import React, { useState, useEffect, StrictMode, useReducer } from 'react'
import { List, Row, Modal, message, Button, Col } from 'antd'
import axios from 'axios'
import servicePath from '../config/apiURL'
import '../static/css/ArticleList.css'
const { confirm } = Modal;
function ArticleList(props) {
    const [list, setList] = useState([])
    useEffect(() => {
        getList()
    }, [])
    const getList = () => {
        axios({
            method: 'get',
            url: servicePath.getArticleList,
            withCredentials: true
        }).then(
            (res) => {
                setList(res.data.list)
            }
        )
    }
    //删除文章的方法
    const delArticle = (id) => {
        confirm({
            title: '是否删除该Blog？',
            content: '点击OK将永久删除该Blog！',
            onOk() {
                axios(servicePath.delArticle + id, { withCredentials: true }).then(
                    (res) => {
                        message.warn('Blog 删除成功')
                        getList()
                    }
                )
            },
            onCancel() {
                message.info('Blog已取消删除')
            }
        })
    }
    //修改文章跳转方法
    const updateArticle = (id) => {
        props.history.push('/index/add/' + id)
    }
    return (
        <div>
            <List
                header={
                    <Row className="list-div">
                        <Col span={8}>
                            <b>标题</b>
                        </Col>
                        <Col span={4}>
                            <b>类别</b>
                        </Col>
                        <Col span={4}>
                            <b>发布时间</b>
                        </Col>
                        <Col span={4}>
                            <b>浏览量</b>
                        </Col>
                        <Col span={4}>
                            <b>操作</b>
                        </Col>
                    </Row>
                }
                bordered
                dataSource={list}
                renderItem={item => (
                    <List.Item>
                        <Row className="list-div">
                            <Col span={8}>
                                {item.title}
                            </Col>
                            <Col span={4}>
                                {item.typeName}
                            </Col>
                            <Col span={4}>
                                {item.addTime}
                            </Col>
                            <Col span={4}>
                                {item.viewCount}
                            </Col>
                            <Col span={4}>
                                <Button type="primary" onClick={() => {
                                    updateArticle(item.id)
                                }}>修改</Button>&nbsp;

                              <Button onClick={() => {
                                    delArticle(item.id)
                                }}>删除 </Button>
                            </Col>
                        </Row>

                    </List.Item>
                )}
            />
        </div>
    )
}

export default ArticleList