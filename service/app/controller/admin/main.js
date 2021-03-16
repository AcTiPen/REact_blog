'use strict';

const Contoller = require('egg').Controller;

class MainControllor extends Contoller {
    async index() {
        this.ctx.body = 'hi api';
    }
    async checkLogin() {
        let userName = this.ctx.request.body.userName
        let password = this.ctx.request.body.password
        const sql = " SELECT userName FROM admin_user WHERE userName = '" + userName + "' AND password = '" + password + "'"
        const res = await this.app.mysql.query(sql)
        //有返回结果，代表登录成功
        if (res.length > 0) {
            let openId = new Date().getTime()
            this.ctx.session.openId = { 'openId': openId }
            this.ctx.body = { 'data': '猪猪认证成功！', 'openId': openId }
            //console.log('primary:' + openId)
        } else {
            this.ctx.body = { 'data': '？？？猪猪认证失败' }
        }
    }
    async getTypeInfo() {
        const resType = await this.app.mysql.select('type')
        this.ctx.body = { data: resType }
    }

    async addArticle() {
        let tmpArticle = this.ctx.request.body
        const result = await this.app.mysql.insert('article', tmpArticle)
        // 如果插入一行那么就是插入成功了
        const insertSuccess = (result.affectedRows === 1)
        const insertId = result.insertId

        this.ctx.body = {
            isSuccess: insertSuccess,
            insertId: insertId,

        }
    }

    async updateArticle() {
        let tempArticle = this.ctx.request.body
        const result = await this.app.mysql.update('article', tempArticle)
        const updateSuccess = (result.affectedRows === 1)
        this.ctx.body = {
            isSuccess: updateSuccess
        }
    }
    async getArticleList() {
        let sql = 'SELECT article.id as id,' +
            'article.title as title,' +
            'article.introduce as introduce,' +
            "FROM_UNIXTIME(article.addTime,'%Y-%m-%d %H:%i:%s') as addTime," +
            'article.viewCount as viewCount ,' +
            'type.typeName as typeName ' +
            'FROM article LEFT JOIN type ON article.typeId = type.Id ' +
            'ORDER BY article.id DESC'
        const resList = await this.app.mysql.query(sql)
        this.ctx.body = { list: resList }
    }
    async delArticle() {
        let id = this.ctx.params.id
        const res = await this.app.mysql.delete('article', { 'id': id })
        this.ctx.body = { data: res }
    }

    async getArticleById() {
        let id = this.ctx.params.id
        let sql = 'SELECT article.id as id,' +
            'article.title as title,' +
            'article.introduce as introduce,' +
            'article.articleContent as articleContent,' +
            "FROM_UNIXTIME(article.addTime,'%Y-%m-%d' ) as addTime," +
            'article.viewCount as viewCount ,' +
            'type.typeName as typeName ,' +
            'type.id as typeId ' +
            'FROM article LEFT JOIN type ON article.typeId = type.Id ' +
            'WHERE article.id=' + id
        const result = await this.app.mysql.query(sql)
        this.ctx.body = { data: result }
    }
}

module.exports = MainControllor;
