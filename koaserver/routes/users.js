
const router = require('koa-router')()
const path = require('path')
const fs = require('fs')
const formidable = require('formidable')

const dirPath = path.join(path.resolve(__dirname, '../'), '/public/images/avatars')
// const jsonPath = path.join(path.resolve(__dirname, '..'), '/public/json/users.json');

// 注册用户
router.post('/register', async (ctx, next) => {
  console.log(ctx.request.body.userInfo);
  let Info = ctx.request.body.userInfo;
  let msgObj = {};

  // json
  // let userList = JSON.parse(fs.readFileSync(jsonPath));//读取json文件数据，并解析为原本数据类型
  // let user = userList.filter(user => user.userName == Info.userName);
  // if (user.length == 0) {
  //   List = [...userList, Info];
  //   fs.writeFileSync(jsonPath, JSON.stringify(List, null, 2));
  //   msgObj = { ok: true, msg: '注册/添加成功!' }
  // } else {
  //   msgObj = { ok: false, msg: '该用户名已存在!' }
  // }

  // db
  let sql1 = 'select * from hk_users where userName=?'
  let user = await ctx.db.EXCUTE(sql1, [Info.userName]);
  console.log(user);
  if (user.length == 0) {
    let sql = 'insert into hk_users(userId,userName,password,phone,email,address,avatar) values(?,?,?,?,?,?,?)';
    let result = await ctx.db.EXCUTE(sql, [Info.userId, Info.userName, Info.password, Info.phone, Info.email, Info.address, Info.avatar]);
    // console.log(result);
    msgObj = { ok: true, msg: '注册/添加成功!' }
  } else {
    msgObj = { ok: false, msg: '该用户名已存在!' }
  }

  ctx.body = msgObj
})

// 获取用户列表
router.post('/getusers', async (ctx, next) => {
  let { currentPage, pageSize } = ctx.request.body;

  // json
  // let result = JSON.parse(fs.readFileSync(jsonPath));

  // db
  let sql = 'select * from hk_users'
  let result = await ctx.db.EXCUTE(sql);
  console.log(result);

  ctx.body = { currentList: result.slice((currentPage - 1) * pageSize, currentPage * pageSize), total: result.length }
})

// 修改用户信息
router.post('/changeinfo', async (ctx, next) => {
  let info = ctx.request.body.userInfo;
  console.log(info);
  let msgObj = {};

  // json
  // let userList = JSON.parse(fs.readFileSync(jsonPath));//读取json文件数据，并解析为原本数据类型
  // let nameList = userList.filter(user => user.userName == info.userName);
  // if (nameList.length == 0 || (nameList.length == 1 && nameList.filter(item => item.userId == info.userId).length == 1)) {
  //   let List = userList.map(user => {
  //     if (user.userId == info.userId) {
  //       return info
  //     } else {
  //       return user
  //     }
  //   })
  //   fs.writeFileSync(jsonPath, JSON.stringify(List, null, 2));
  //   msgObj = { ok: true, msg: '修改成功!' }
  // } else {
  //   msgObj = { ok: false, msg: '该用户名已存在!' }
  // }

  // db
  let sql = 'select * from hk_users where userId=?'
  let editUser = await ctx.db.EXCUTE(sql, [info.userId]);
  console.log('editUser:', editUser);
  let sql1 = 'select * from hk_users where userName=?'
  let sameUser = await ctx.db.EXCUTE(sql1, [info.userName]);
  console.log('sameUser:', sameUser);
  console.log('length:', sameUser.length);
  console.log('if=', sameUser[0].userId == editUser[0].userId);
  if (sameUser.length == 0 || (sameUser.length == 1 && sameUser[0].userId == editUser[0].userId)) {
    let sql2 = 'update hk_users set userName=?,password=?,phone=?,email=?,address=?,avatar=? where userId=?'
    let result = await ctx.db.EXCUTE(sql2, [info.userName, info.password, info.phone, info.email, info.address, info.avatar, info.userId]);
    console.log('changeRes:', result);
    msgObj = { ok: true, msg: '修改成功!' }
  } else {
    msgObj = { ok: false, msg: '该用户名已存在!' }
  }

  ctx.body = msgObj;
})

// 删除用户信息
router.post('/deluser', async (ctx, next) => {
  let { id } = ctx.request.body;
  console.log(id);

  // json
  // let userList = JSON.parse(fs.readFileSync(jsonPath));//读取json文件数据，并解析为原本数据类型
  // let index = userList.findIndex(user => user.userId == id);
  // userList.splice(index, 1)
  // fs.writeFileSync(jsonPath, JSON.stringify(userList, null, 2));

  // db
  let msgObj = {};
  let sql = 'delete from hk_users where userId=?'
  let result = await ctx.db.EXCUTE(sql, [id]);
  console.log('delRes:', result);
  if (result.affectedRows == 1) {
    msgObj = { ok: true, msg: '删除成功!' };
  } else {
    msgObj = { ok: false, msg: '删除失败!' }
  }

  ctx.body = msgObj;
})

// 头像上传
const UploadAvatar = (ctx) => {
  const form = formidable({
    uploadDir: dirPath,
    keepExtensions: true,
    allowEmptyFiles: false
  });

  return new Promise((resolve, reject) => {
    form.parse(ctx.req, (err, fields, files) => {//ctx.req原生的node的http请求模块；ctx.require.body是经过koa二次封装之后的
      if (err) {
        reject(err);
        return;
      }
      let keys = Object.keys(files);//获取files对象中的属性名[formData传入的图片]
      keys?.map((key) => {
        // 将文件重命名为原本的文件名
        fs.rename(path.join(dirPath, `/${files[key].newFilename}`), path.join(dirPath, `/${files[key].originalFilename}`),
          (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log('file is reset!');
            }
          })
      })
      resolve({ ok: true, fields, files });
    });
  });
}

router.post('/uploadavatar', async (ctx, next) => {
  ctx.body = await UploadAvatar(ctx);
})

// 返回具体头像内容avatar
router.get('/getavatar/:name', function (ctx, next) {
  // 动态路由的参数
  // console.log('name:', ctx.params.name);
  let filePath = path.join(dirPath, ctx.params.name);
  let fileContent = fs.readFileSync(filePath);
  ctx.body = fileContent
})

// 查找用户信息
router.post('/search', async (ctx, next) => {
  let { keyWord } = ctx.request.body;
  let msgObj = {};

  // json
  // let userList = JSON.parse(fs.readFileSync(jsonPath));//读取json文件数据，并解析为原本数据类型
  // let List = userList.filter(item => item.userName.includes(keyWord) || (item.phone + '').includes(keyWord) || item.email.includes(keyWord) || item.address.includes(keyWord));
  // let total = List.length;
  // if (total == 0) {
  //   msgObj = { msg: '没有找到相关信息', total: total, List: List }
  // }
  // else {
  //   msgObj = { msg: '查询成功!', total: total, List: List }
  // }

  // db
  // let sql = "select * from users where userName like '%[?]%' or phone like '%[?]%' or email like '%[?]%' or address like '%[?]%'"
  // let result = await ctx.db.EXCUTE(sql, [keyWord]);
  let sql = `select * from hk_users where userName LIKE '%${keyWord}%' or phone LIKE '%${keyWord}%' or email LIKE '%${keyWord}%' or address LIKE '%${keyWord}%'`
  let result = await ctx.db.EXCUTE(sql);
  console.log('searchRes:', result);
  let total = result.length;
  if (total == 0) {
    msgObj = { msg: '没有找到相关信息', total: total, List: result }
  }
  else {
    msgObj = { msg: '查询成功!', total: total, List: result }
  }

  ctx.body = msgObj
})

module.exports = router