let ipURL = 'http://127.0.0.1:7001/default/'
let servicePath = {
    getArticleList: ipURL + 'getArticleList/',//首页接口
    getArticleById: ipURL + 'getArticleById/',//详细页接口
    getTypeInfo: ipURL + 'getTypeInfo/',//获得文章类别接口
    getListById: ipURL + 'getListById/',//根据类别ID获得文章列表
}
export default servicePath