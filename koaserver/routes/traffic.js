// const router = require('koa-router')()
// const svgCaptcha = require('svg-captcha')
// const fs = require('fs')
// const path = require('path')

// // 雪梨
// // 验证用户名、密码
// const matchData = (nickName, password) => {
//     return new Promise((resolve, reject) => {
//         let filePath = path.join(path.resolve(__dirname, '..'), '/public/json/users.json');
//         let fileContent = '';
//         fs.readFile(filePath, (err, data) => {// 异步读取文件；当操作系统完成读文件操作之后才会执行
//             if (err) {
//                 reject(err);
//             } else {
//                 fileContent = JSON.parse(data.toString()); // 读取到的是Buffer类型数据，需要转化为字符串形式；之后再将字符串转换为数组类型
//                 let userList = [...fileContent]
//                 console.log('4', userList);
//                 let arr = userList.filter(itme => {//与json文件中的用户信息进行比较，符合条件的返还给arr
//                     if (itme.nickName == nickName && itme.password == password) {
//                         return itme
//                     }
//                 })
//                 console.log('5', arr);
//                 if (arr.length !== 0) {//判断arr的长度，若长度不为零，表示用户信息存在，可以登录
//                     resolve({ ok: true, msg: '登陆成功' })
//                 }
//                 else {//json文件中没有用户信息，登录失败
//                     resolve({ ok: false, msg: '用户或密码错误' })
//                 }
//             }
//         });
//     })
// }

// // 获取验证码的请求
// router.get('/captcha', async (ctx, next) => {
//     let captcha = svgCaptcha.create({
//         inverse: false,
//         fontSize: 48,
//         noise: 2,
//         width: 100,
//         height: 40,
//         size: 4,
//         background: '#ccc',
//         ignoreChars: '0o1i'
//     })
//     const { data, text } = captcha
//     ctx.session.captcha = text.toLowerCase();
//     console.log(ctx.session);
//     ctx.body = data
// })

// // 登录验证请求
// router.post('/form', async (ctx, next) => {
//     console.log(ctx.request.body);
//     const { nickName, password, check } = ctx.request.body
//     if (check.toLowerCase() === ctx.session.captcha) {//验证码检验通过
//         let Info = {}
//         await matchData(nickName, password).then(res => {
//             Info = res
//         })
//         ctx.body = Info
//     } else {//验证码检验不通过通过
//         ctx.body = { ok: false, msg: '验证码错误' }
//     }
// })

// module.exports = router

const router = require('koa-router')()
const svgCaptcha = require('svg-captcha')
const fs = require('fs')
const path = require('path')

// token
const jwt = require('koa-jwt');
const jsonwebtoken = require('jsonwebtoken');

const secret = 'moyufed-test'; // 定义一个密钥secret，这里只是做演示，建议放在项目配置里面

// 这里调用引入的jwt方法，最终会得到一个中间件
router.use(
    jwt({
        secret,
        cookie: 'token', // 从 cookie 中获取token
        debug: true // 开启debug可以看到准确的错误信息
    })
        .unless({ path: [/^\/captcha/, /^\/form/] }) // 以 captcha、form 开头的请求地址不使用 jwt 中间件
);

router.get('/auth', async (ctx, next) => {
    ctx.body = ctx.state.user; // 该中间件将验证后的用户数据直接返回给浏览器
});

// 浏览器同源策略：同源指 协议、Ip地址、端口都一致称之为同源；不同源之间网络请求会存在跨域问题；不同域名下的数据不能随意传输；
// 解决办法：
// 一、服务器代理
// 二、服务端设置允许跨域--koa2端
// 1.npm install koa2-cors
// 2.在app.js中添加const cors = require('koa2-cors')、app.use(cors())
// ctx.body = 'received data.'


// 雪梨
// 验证用户名、密码
// json
// const matchData = (userName, password) => {
//     return new Promise((resolve, reject) => {
//         let filePath = path.join(path.resolve(__dirname, '..'), '/public/json/users.json');
//         // let fileContent = '';
//         fs.readFile(filePath, (err, data) => {// 异步读取文件；当操作系统完成读文件操作之后才会执行
//             if (err) {
//                 reject(err);
//             } else {
//                 userList = JSON.parse(data); // 读取到的是Buffer类型数据，需要转化为字符串形式；之后再将字符串转换为数组类型
//                 // console.log('4', userList);
//                 let arr = userList.filter(itme => {//与json文件中的用户信息进行比较，符合条件的返还给arr
//                     if (itme.userName == userName && itme.password == password) {
//                         return itme
//                     }
//                 })
//                 // console.log('5', arr);
//                 if (arr.length !== 0) {//判断arr的长度，若长度不为零，表示用户信息存在，可以登录
//                     resolve({ code: 200, ok: true, msg: '登陆成功', user: arr[0] })
//                 }
//                 else {//json文件中没有用户信息，登录失败
//                     resolve({ code: 500, ok: false, msg: '用户或密码错误' })
//                 }
//             }
//         });
//     })
// }

// db
const matchData = (ctx, userName, password) => {
    return new Promise(async (resolve, reject) => {
        let sql = 'select * from hk_users where userName=? and password=?'
        let user = await ctx.db.EXCUTE(sql, [userName, password]);
        console.log(user);
        if (user.length !== 0) {//判断user的长度，若长度不为零，表示用户信息存在，可以登录
            resolve({ code: 200, ok: true, msg: '登陆成功', user: user[0] })
        }
        else {//数据库中没有用户信息，登录失败
            resolve({ code: 500, ok: false, msg: '用户或密码错误' })
        }
    })
}

// 获取验证码的请求
router.get('/captcha', async (ctx, next) => {
    let captcha = svgCaptcha.create({
        inverse: false,
        fontSize: 48,
        noise: 2,
        width: 100,
        height: 40,
        size: 4,
        background: '#ccc',
        ignoreChars: '0o1i'
    })
    const { data, text } = captcha
    ctx.session.captcha = text.toLowerCase();
    console.log(ctx.session);
    ctx.body = data
})

// 登录验证请求
router.post('/form', async (ctx, next) => {
    console.log(ctx.request.body);
    console.log(ctx.session);
    const { userName, password, check } = ctx.request.body
    console.log(userName, password, check);
    if (check.toLowerCase() == ctx.session.captcha) {//验证码检验通过
        let Info = {}
        await matchData(ctx, userName, password).then(res => {
            if (res.ok) {
                const token = jsonwebtoken.sign({ name: 'moyufed' }, secret, { expiresIn: '3h' }) // token 有效期为3小时
                ctx.cookies.set(
                    'token',
                    token,
                    {
                        domain: 'localhost', // 设置 cookie 的域
                        path: '/', // 设置 cookie 的路径
                        maxAge: 3 * 60 * 60 * 1000, // cookie 的有效时间 ms
                        expires: new Date('2021-12-30'), // cookie 的失效日期，如果设置了 maxAge，expires 将没有作用
                        httpOnly: true, // 是否要设置 httpOnly
                        overwrite: true // 是否要覆盖已有的 cookie 设置
                    }
                )
                Info = { ...res, token: token }//将token返回前端
            } else {
                Info = res
            }
        })
        ctx.body = Info
    } else {//验证码检验不通过通过
        ctx.body = { ok: false, msg: '验证码错误', code: 500 }
    }
})

module.exports = router