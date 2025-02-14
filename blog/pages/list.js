import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { Row, Col, List, Icon, Breadcrumb } from 'antd'
import Header from '../components/Header'
import Author from '../components/Author'
import Advertisement from '../components/Advertisement'
import Footer from '../components/Footer'
import '../static/style/pages/common.css'
import axios from 'axios'
import servicePath from '../config/apiURL'
import Link from 'next/link'
import marked from 'marked'
import highLight, { autoDetection } from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'



const MyList = (list) => {

  const [mylist, setMylist] = useState(list.data)
  useEffect(() => {
    setMylist(list.data)
  })
  const renderer = new marked.Renderer()
  marked.setOptions({
    renderer: renderer,
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: false,
    smartLists: true,
    highlight: function (code) {
      return highLight.highlightAuto(code).value
    }
  })

  return (
    <>
      <Head>
        <title>List</title>
      </Head>
      <Header />
      <Row className="common-main" type="flex" justify="center">
        <Col className="common-left" xs={24} sm={24} md={16} lg={18} xl={14}  >
          <div>
            <div className="bread-div">
              <Breadcrumb>
                <Breadcrumb.Item><a href="/">首页</a></Breadcrumb.Item>
                <Breadcrumb.Item>文章列表</Breadcrumb.Item>
              </Breadcrumb>
            </div>

            <List
              itemLayout="vertical"
              dataSource={mylist}
              renderItem={item => (
                <List.Item>
                  <div className="list-title">
                    <Link href={{ pathname: '/', query: { id: item.id } }}>
                      <a>{item.title}</a>
                    </Link>
                  </div>
                  <div className="list-icon">
                    <span><Icon type="calendar" /> {item.addTime}</span>
                    <span><Icon type="folder" />{item.typeName}</span>
                    <span><Icon type="fire" /> {item.viewCount}人</span>
                  </div>
                  <div className='list-context' dangerouslySetInnerHTML={{ __html: marked(item.introduce) }}></div>
                </List.Item>
              )}
            />

          </div>
        </Col>

        <Col className="common-right" xs={0} sm={0} md={7} lg={5} xl={4}>
          <Author />
          <Advertisement />
        </Col>
      </Row>
      <Footer />

    </>
  )

}
MyList.getInitialProps = async (context) => {
  let id = context.query.id
  const promise = new Promise((resolve) => {
    axios(servicePath.getListById + id).then(
      (res) => {
        resolve(res.data)
      }
    )
  })
  return await promise
}
export default MyList