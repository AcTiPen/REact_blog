import React, { useState, useEffect } from 'react'
import marked from 'marked'
import '../static/css/AddArticle.css'
import { Row, Col, Input, Select, Button, DatePicker, message } from 'antd'
import axios from 'axios'
import servicePath from '../config/apiURL'
const { Option } = Select;
const { TextArea } = Input;

function AddArticle(props) {
    const [articleId, setArticleId] = useState(0)  // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
    const [articleTitle, setArticleTitle] = useState('')   //文章标题
    const [articleContent, setArticleContent] = useState('')  //markdown的编辑内容
    const [markdownContent, setMarkdownContent] = useState('预览内容') //html内容
    const [introducemd, setIntroducemd] = useState()            //简介的markdown内容
    const [introducehtml, setIntroducehtml] = useState('等待编辑') //简介的html内容
    const [showDate, setShowDate] = useState()   //发布日期
    const [updateDate, setUpdateDate] = useState() //修改日志的日期
    const [typeInfo, setTypeInfo] = useState([]) // 文章类别信息
    const [selectedType, setSelectType] = useState('请选择类别') //选择的文章类别

    useEffect(() => {
        // 在页面载入的时候只执行下面的函数一次
        getTypeInfo()
        //获取文章ID
        let tmpId = props.match.params.id
        if (tmpId) {
            setArticleId(tmpId)
            getArticleById(tmpId)
        }
    }, [])

    marked.setOptions({
        renderer: marked.renderer,
        gfm: true,
        pedantic: false,
        sanitize: false,
        tables: true,
        breaks: false,
        smartLists: true,
        smartypants: false
    });
    // 实时响应正文markdown
    const changeContent = (e) => {
        setArticleContent(e.target.value)
        let html = marked(e.target.value)
        setMarkdownContent(html)
    }
    // 实时响应简介markdown
    const changeIntroduce = (e) => {
        setIntroducemd(e.target.value)
        let html = marked(e.target.value)
        setIntroducehtml(html)
    }

    const getTypeInfo = () => {
        axios({
            method: 'get',
            url: servicePath.getTypeInfo,
            header: { 'Access-Control-Allow-Origin': '*' },
            withCredentials: true
        }).then(
            res => {
                if (res.data.data === '需要猪猪认证！') {
                    localStorage.removeItem('openId')
                    props.history.push('/')
                } else {
                    setTypeInfo(res.data.data)
                }
            }
        )
    }

    const selectTypeHandler = (value) => {
        setSelectType(value)
    }

    const saveArticle = () => {
        if (selectedType === '请选择类别') {
            message.error('必须选择Blog类型')
            return false
        } else if (!articleTitle) {
            message.error('必须输入Blog标题')
            return false
        } else if (!articleContent) {
            message.error('必须输入Blog正文')
            return false
        } else if (!introducemd) {
            message.error('必须输入Blog简介')
            return false
        } else if (!showDate) {
            message.error('必须输入Blog日期')
            return false
        } else {
            let dataProps = {}
            dataProps.typeId = selectedType
            dataProps.title = articleTitle
            dataProps.articleContent = articleContent
            dataProps.introduce = introducemd
            let dataText = showDate.replace('-', '/')
            dataProps.addTime = (new Date(dataText).getTime()) / 1000
            if (articleId === 0) {
                dataProps.viewCount = 0;
                axios({
                    method: 'post',
                    url: servicePath.addArticle,
                    data: dataProps,
                    withCredentials: true
                }).then(
                    (res) => {
                        setArticleId(res.data.insertId)
                        if (res.data.isSuccess) {
                            message.success('Blog 发布成功')
                        } else {
                            message.error('Blog 发布失败')
                        }
                    }
                )
            } else {
                dataProps.id = articleId
                axios({
                    method: 'post',
                    url: servicePath.updateArticle,
                    data: dataProps,
                    withCredentials: true
                }).then(
                    (res) => {
                        if (res.data.isSuccess) {
                            message.success('Blog 更新成功')
                        } else {
                            message.error('Blog 更新失败')
                        }
                    }
                )
            }
        }

    }

    const getArticleById = (id) => {
        axios(servicePath.getArticleById + id, {
            withCredentials: true,
            header: { 'Access-Control-Allow-Origin': '*' }
        }).then(
            res => {
                //let articleInfo= res.data.data[0]
                setArticleTitle(res.data.data[0].title)
                setArticleContent(res.data.data[0].articleContent)
                let html = marked(res.data.data[0].articleContent)
                setMarkdownContent(html)
                setIntroducemd(res.data.data[0].introduce)
                let tmpInt = marked(res.data.data[0].introduce)
                setIntroducehtml(tmpInt)
                setShowDate(res.data.data[0].addTime)
                setSelectType(res.data.data[0].typeId)
            }
        )
    }

    return (
        <div>
            <Row gutter={5}>
                {/* 左边布局 */}
                <Col span={18}>
                    <Row gutter={10}>
                        <Col span={20}>
                            <Input
                                value={articleTitle}
                                placeholder='Blog 标题'
                                size='large'
                                onChange={(e) => { setArticleTitle(e.target.value) }}
                            />
                        </Col>
                        <Col span={4}>
                            &nbsp;
                            <Select
                                defaultValue={selectedType}
                                size='large'
                                onChange={selectTypeHandler}
                            >
                                {
                                    typeInfo.map((item, index) => {
                                        return (
                                            <Option key={item + index} value={item.Id}>{item.typeName}</Option>
                                        )
                                    })
                                }
                            </Select>
                        </Col>
                    </Row>
                    <br />
                    <Row gutter={10}>
                        {/* markdown输入区域 */}
                        <Col span={12}>
                            <TextArea
                                className='markdown-content'
                                rows={35}
                                placeholder='Blog 正文'
                                value={articleContent}
                                onChange={changeContent}
                            />
                        </Col>
                        {/* markdown展示区域 */}
                        <Col span={12}>
                            <div
                                className='show-html'
                                dangerouslySetInnerHTML={{ __html: markdownContent }}
                            />
                        </Col>
                    </Row>
                </Col>
                {/* 右边布局 */}
                <Col span={6}>
                    <Row>
                        <Col span={24}>
                            {/* 右上按钮区域 */}
                            <Button size='large'>暂存文章</Button>&nbsp;&nbsp;
                            <Button size='large' type='primary' onClick={saveArticle}>发布文章</Button>
                            <br />
                            {/* 右中简介区域 */}
                            <Col span={24}>
                                <br />
                                <TextArea
                                    rows={4}
                                    placeholder='Blog 简介'
                                    value={introducemd}
                                    onChange={changeIntroduce}
                                />
                                <br />
                                <br />
                                <div
                                    className='introduce-html'
                                    dangerouslySetInnerHTML={{ __html: introducehtml }}
                                />
                            </Col>
                            {/* 右下时间区域 */}
                            <Col span={12}>
                                <div className='date-select'>
                                    <DatePicker
                                        onChange={(date, dateString) => {
                                            setShowDate(dateString)
                                        }}
                                        placeholder='发布日期'
                                        size='large'
                                    />
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className='date-select'>
                                    <DatePicker
                                        placeholder='修改日期'
                                        size='large'
                                    />
                                </div>
                            </Col>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}
export default AddArticle

