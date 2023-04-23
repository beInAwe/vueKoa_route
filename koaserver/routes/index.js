const router = require('koa-router')()


router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

router.get('/getdata', async (ctx, next) => {
  console.log('received request!');
  // 浏览器同源策略：同源指 协议、Ip地址、端口都一致称之为同源；不同源之间网络请求会存在跨域问题；不同域名下的数据不能随意传输；
  // 解决办法：
  // 一、服务器代理
  // 二、服务端设置允许跨域--koa2端
  // 1.npm install koa2-cors
  // 2.在app.js中添加const cors = require('koa2-cors')、app.use(cors())
  // ctx.body = 'received data.'
  ctx.body = {
    title: 'vue axios test'
  }
})


module.exports = router
