'use strict';
// 入口路由
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  require('./router/default.js')(app)
  require('./router/admin.js')(app)
};
