import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Col, Row, List, Icon } from 'antd'
import Header from '../components/Header'
import '../static/style/pages/index.css'
import Author from '../components/Author'
import Advertisement from '../components/Advertisement'
import Footer from '../components/Footer'
import axios from 'axios'
import servicePath from '../config/apiURL'
import marked from 'marked'
import highLight, { autoDetection } from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'
const Home = (list) => {
  const [mylist, setMylist] = useState(list.data)
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
    <div>
      <Head>
        <title>Home</title>
      </Head>
      <Header />
      <Row className='common-main' type='flex' justify='center'>
        {/* 设置不同宽度下的显示情况 */}
        <Col className='common-left' xs={22} sm={22} md={16} lg={18} xl={14}>
          {/* 左侧，含有：“文章” */}
          <List
            header={<div>最新日志</div>}
            //设置内容摆放方向
            itemLayout='vertical'
            //文章来源
            dataSource={mylist}
            //渲染文章
            renderItem={(item) => (
              <List.Item>
                <div className='list-title'>
                  <Link href={{ pathname: '/detailed', query: { id: item.id } }}>
                    <a>{item.title}</a>
                  </Link>
                </div>
                <div className='list-icon'>
                  <span><Icon type='calendar' />{item.addTime}</span>
                  <span><Icon type='folder' />{item.typeName}</span>
                  <span><Icon type='fire' />{item.viewCount}人</span>
                </div>
                <div className='list-context' dangerouslySetInnerHTML={{ __html: marked(item.introduce) }}></div>
              </List.Item>
            )}
          />
        </Col>
        <Col className='common-right' xs={0} sm={0} md={7} lg={5} xl={4}>
          {/* 右侧,含有：“作者”，“广告” */}
          <Author />
          <Advertisement />
        </Col>
      </Row>
      <Footer />
    </div>
  )
}


Home.getInitialProps = async () => {
  const promise = new Promise((resolve) => {
    //axios默认使用get方法
    axios(servicePath.getArticleList).then(
      (res) => {
        resolve(res.data)
      }
    )
  })
  return await promise
}
export default Home