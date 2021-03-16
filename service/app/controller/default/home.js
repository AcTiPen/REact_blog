'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    // 从数据库中获取信息
    this.ctx.body = 'api hi!';
  }
  async getArticleList() {

    let sql = 'SELECT article.id as id,' +
      'article.title as title,' +
      'article.introduce as introduce,' +
      // 用来进行时间戳转化
      "FROM_UNIXTIME(article.addTime,'%Y-%m-%d %H:%i:%s') as addTime," +
      'article.viewCount as viewCount ,' +
      'type.typeName as typeName ' +
      'FROM article LEFT JOIN type ON article.typeId = type.Id'

    const results = await this.app.mysql.query(sql)

    this.ctx.body = {
      data: results
    }
  }
  async getArticleById() {
    let id = this.ctx.params.id
    let sql = 'SELECT article.id as id,' +
      'article.title as title,' +
      'article.introduce as introduce,' +
      'article.articleContent as articleContent,' +
      // 用来进行时间戳转化
      "FROM_UNIXTIME(article.addTime,'%Y-%m-%d %H:%i:%s') as addTime," +
      'article.viewCount as viewCount ,' +
      'type.typeName as typeName ,' +
      'type.id as typeId ' +
      'FROM article LEFT JOIN type ON article.typeId = type.Id ' +
      'WHERE article.id=' + id
    const result = await this.app.mysql.query(sql)
    this.ctx.body = { data: result }
  }
  // 得到文章类别和编号
  async getTypeInfo() {
    const result = await this.app.mysql.select('type')
    this.ctx.body = { data: result }
  }

  // 根据类别ID获得文章列表
  async getListById() {
    let id = this.ctx.params.id
    let sql = 'SELECT article.id as id,' +
      'article.title as title,' +
      'article.introduce as introduce,' +
      "FROM_UNIXTIME(article.addTime,'%Y-%m-%d %H:%i:%s') as addTime," +
      'article.viewCount as viewCount ,' +
      'type.typeName as typeName ' +
      'FROM article LEFT JOIN type ON article.typeId = type.Id ' +
      'WHERE typeId=' + id

    const results = await this.app.mysql.query(sql)

    this.ctx.body = {
      data: results
    }
  }
}


module.exports = HomeController;