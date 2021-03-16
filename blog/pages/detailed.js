import React from 'react'
import Head from 'next/head'
import { Col, Row, Icon, Breadcrumb, Affix } from 'antd'
import Header from '../components/Header'
import Author from '../components/Author'
import Advertisement from '../components/Advertisement'
import Footer from '../components/Footer'
import '../static/style/pages/detailed.css'
//旧markdown处理方案
//import ReactMarkdown from 'react-markdown'
//旧右侧导航栏
//import MarkdownNav from 'markdown-navbar'
import axios from 'axios'
import 'markdown-navbar/dist/navbar.css'
//处理markdown
import marked from 'marked'
//代码高亮
import highLight, { autoDetection } from 'highlight.js'
//代码高亮样式
import 'highlight.js/styles/monokai-sublime.css'
//新导航栏
import Tocify from '../components/tocify.tsx'
//用一个文件中写好的ip地址进行调用，方便修改
import servicePath from '../config/apiURL'

const Detailed = (porps) => {
  const tocify = new Tocify()
  const renderer = new marked.Renderer()
  //通过拼接的方式设置新的导航栏
  renderer.heading = function (text, level, raw) {
    //level读取md中的标签等级，text用来读取去掉标签的文本
    const anchor = tocify.add(text, level)
    return `<a id="${anchor}" href = "#${anchor}" class="anchor-fix"><h${level}>${text}</h${level}></a>\n`
  }
  marked.setOptions({
    renderer: renderer,
    //启动类似GitHub的markdown
    gfm: true,
    //格式容错（false代表可以容错）
    pedantic: false,
    //忽略Html标签(false代表不忽略)
    sanitize: false,
    //是否按照GitHub样式进行表格输出
    tables: true,
    //是否支持GitHub的换行符(flase代表不支持)
    breaks: false,
    //是否自动渲染列表(true代表渲染)
    smartLists: true,
    //如何让代码进行高亮
    highlight: function (code) {
      //highlightAuto代表自动检测代码类型进行高亮（！增加响应时间）
      return highLight.highlightAuto(code).value
    }
  })
  //从接口获得正文，然后从md转化成html样式
  let htmlContent = marked(porps.articleContent)
  return (
    <div>
      <Head>
        <title>Detailed</title>
      </Head>
      <Header />
      <Row className='common-main' type='flex' justify='center'>
        <Col className='common-left' xs={22} sm={22} md={16} lg={18} xl={14}>
          {/* 左侧 */}
          <div className='bread-div'>
            {/* 面包屑导航 */}
            <Breadcrumb>
              <Breadcrumb.Item>
                <a href='/'>首页</a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <a href='/'>视频列表</a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                xxx
            </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div>
            <div className='detailed-title'>React实战视频-Blog开发</div>
            <div className='list-icon center'>
              <span><Icon type='calendar' />2019-06-21</span>
              <span><Icon type='folder' />视频教程</span>
              <span><Icon type='fire' />2334人</span>
            </div>
            <div
              className="detailed-content"
              //解析Html标签使其生效，防止源文件被当作TXT直接输出
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            >
              {/* 这个组件就可以把Markdown渲染成普通文章 */}
              {/* <ReactMarkdown
                source={markdown}
                escapeHtml={false}
              /> */}
            </div>
          </div>
        </Col>
        <Col className='common-right' xs={0} sm={0} md={7} lg={5} xl={4}>
          {/* 右侧，包含“作者”，“广告” */}
          <Author />
          <Advertisement />
          <Affix offsetTop={5}>
            <div className='detailed-nav common-box'>
              <div className='nav-title'>文章目录</div>
              {/* 右侧旧导航栏：Markdown-Nav组件点击就可以进行跳转 */}
              {/* <MarkdownNav
                className='article-menu'
                //文章标题来源
                source={htmlContent}
                // 是否在文章导航的时候启用编号
                ordered={false}
              /> */}
              {tocify && tocify.render()}
            </div>
          </Affix>
        </Col>
      </Row>
      {/* 编写底部 */}
      <Footer />
    </div>
  )
}
Detailed.getInitialProps = async (content) => {
  let id = content.query.id
  const promise = new Promise((resolve) => {
    axios(servicePath.getArticleById + id).then(
      (res) => {
        resolve(res.data.data[0])
      }
    )
  })
  return await promise
}
export default Detailed