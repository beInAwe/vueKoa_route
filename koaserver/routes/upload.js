
/**
 * formidable模块，对上传文件进行处理
 * multiples:是否支持多文件上传
 * uploadDir:文件上传路径
 * keepExtensions:是否保留文件后缀
 * allowEmptyFiles:是否允许上传空文件
 */
// const router = require('koa-router')()
// const path = require('path')
// const fs = require('fs')
// const formidable = require('formidable')

// const dirPath = path.join(path.resolve(__dirname, '../'), '/public/images')

// const CheckUpload = (ctx) => {
//     const form = formidable({
//         multiples: true,
//         uploadDir: dirPath,
//         keepExtensions: true,
//         allowEmptyFiles: false
//     });

//     return new Promise((resolve, reject) => {
//         form.parse(ctx.req, (err, fields, files) => {//ctx.req原生的node的http请求模块；ctx.require.body是经过koa二次封装之后的
//             if (err) {
//                 reject(err);
//                 return;
//             }
//             let keys = Object.keys(files);//获取files对象中的属性名[formData传入的图片]
//             keys?.map(key => {
//                 fs.rename(path.join(dirPath, `/${files[key].newFilename}`), path.join(dirPath, `/${files[key].originalFilename}`), (err) => {
//                     if (err) {
//                         console.log(err);
//                     } else {
//                         console.log('file is reset!');
//                     }
//                 })
//             })
//             resolve({ fields, files });
//         });
//     });
// }

// // 上传图片
// router.post('/uploadfiles', function (ctx, next) {
//     let state = {}
//     CheckUpload(ctx).then(res => {
//         console.log(res);
//         state = res
//     })
//     ctx.body = state
// })

// // 请求后端图片列表
// router.get('/getfiles/', function (ctx, next) {
//     // 读取文件夹内容，得到一个数组
//     let result = fs.readdirSync(dirPath);
//     ctx.body = { result }
// })

// // 返回具体图片内容
// router.get('/getfiles/:name', function (ctx, next) {
//     // 动态路由的参数
//     console.log('name:', ctx.params.name);
//     let filePath = path.join(dirPath, ctx.params.name);
//     let fileContent = fs.readFileSync(filePath);
//     ctx.body = fileContent
// })

// // 删除图片
// router.post('/delfile', function (ctx, next) {
//     console.log(ctx.request.body);
//     let result = {}
//     let filePath = path.join(dirPath, ctx.request.body.fileName)
//     if (fs.existsSync(filePath)) {
//         fs.unlinkSync(filePath);
//         result = { msg: 'file is deleted!' }
//         console.log('file is deleted!');
//     } else {
//         console.log('file is not exist!');
//         result = { msg: 'file is not exist!' }
//     }
//     ctx.body = result
// })

// module.exports = router

    // json
    // return new Promise((resolve, reject) => {
    //     form.parse(ctx.req, (err, fields, files) => {//ctx.req原生的node的http请求模块；ctx.require.body是经过koa二次封装之后的
    //         if (err) {
    //             reject(err);
    //             return;
    //         }
    //         let arr = JSON.parse(fs.readFileSync(jsonPath));//读取json文件数据，并解析为原本数据类型
    //         let keys = Object.keys(files);//获取files对象中的属性名[formData传入的图片]
    //         keys?.map((key) => {
    //             console.log(key);
    //             // 去重，并将上传的文件信息写入json文件
    //             arr = [...arr, files[key]]
    //             // 将文件重命名为原本的文件名
    //             fs.rename(path.join(dirPath, `/${files[key].newFilename}`), path.join(dirPath, `/${files[key].originalFilename}`),
    //                 (err) => {
    //                     if (err) {
    //                         console.log(err);
    //                     } else {
    //                         console.log('file is reset!');
    //                     }
    //                 })
    //         })
    //         fs.writeFileSync(jsonPath, JSON.stringify(removeDuplicate(arr), null, 2));
    //         resolve({ ok: true, fields, files });
    //     });
    // });




/**
 * formidable模块，对上传文件进行处理
 * multiples:是否支持多文件上传
 * uploadDir:文件上传路径
 * keepExtensions:是否保留文件后缀
 * allowEmptyFiles:是否允许上传空文件
 */
const router = require('koa-router')()
const path = require('path')
const fs = require('fs')
const formidable = require('formidable')

const dirPath = path.join(path.resolve(__dirname, '../'), '/public/images')
const jsonPath = path.join(path.resolve(__dirname, '..'), '/public/json/files.json');

//数组去重     
const removeDuplicate = (arr) => {
    let len = arr.length
    for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
            if (arr[i].originalFilename === arr[j].originalFilename) {
                arr.splice(j, 1)
                len-- // 减少循环次数提高性能
                j-- // 保证j的值自加后不变
            }
        }
    }
    return arr
}

const CheckUpload = (ctx) => {
    const form = formidable({
        multiples: true,
        uploadDir: dirPath,
        keepExtensions: true,
        allowEmptyFiles: false
    });


    // db
    return new Promise((resolve, reject) => {
        form.parse(ctx.req, (err, fields, files) => {//ctx.req原生的node的http请求模块；ctx.require.body是经过koa二次封装之后的
            if (err) {
                reject(err);
                return;
            }
            let keys = Object.keys(files);//获取files对象中的属性名[formData传入的图片]
            keys?.map(async (key) => {
                console.log('key:', key);
                let { size, filepath, newFilename, originalFilename, mimetype } = files[key];
                let sql = 'insert into images(imgId,size,filepath,newFilename,originalFilename,mimetype) values(?,?,?,?,?,?)';
                let result = await ctx.db.EXCUTE(sql, [key, size, filepath, newFilename, originalFilename, mimetype]);
                console.log('uploadRes:', result);
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

// 上传图片
router.post('/upload', async function (ctx, next) {
    ctx.body = await CheckUpload(ctx)
})

// 请求后端图片列表
router.post('/getfiles', async (ctx, next) => {
    // 1、读取文件夹内容，得到一个数组
    // let result = fs.readdirSync(dirPath);
    // 2、读取json文件中的相关数据，返回前端
    // let { currentPage, pageSize } = ctx.request.body
    // let result = JSON.parse(fs.readFileSync(jsonPath));
    // 3、从数据库中获取图片信息，返回前端
    let { currentPage, pageSize } = ctx.request.body
    let sql = 'select * from images'
    let result = await ctx.db.EXCUTE(sql);
    console.log('getimages:', result);
    ctx.body = { currentList: result.slice((currentPage - 1) * pageSize, currentPage * pageSize), total: result.length }
})

// 返回具体图片内容
router.get('/getfiles/:name', function (ctx, next) {
    // 动态路由的参数
    // console.log('name:', ctx.params.name);
    let filePath = path.join(dirPath, ctx.params.name);
    // let fileObj = fs.statSync(filePath);
    // console.log('64:', fileObj);
    let fileContent = fs.readFileSync(filePath);
    ctx.body = fileContent
})

// 删除图片
router.post('/delfile', async (ctx, next) => {
    // console.log(ctx.request.body);
    let { imgId, fileName } = ctx.request.body
    let filePath = path.join(dirPath, fileName);
    let result = {}
    if (fs.existsSync(filePath)) {
        // 删除文件
        fs.unlinkSync(filePath);
        // 将该文件的信息从json文件中删除
        // let arr = JSON.parse(fs.readFileSync(jsonPath));
        // let values = arr.filter(item => item.originalFilename !== ctx.request.body.fileName);
        // fs.writeFileSync(jsonPath, JSON.stringify(values, null, 2));
        // 将该文件的信息从数据库中删除
        let sql = 'delete from images where imgId=?'
        let delRes = await ctx.db.EXCUTE(sql, [imgId]);
        console.log('delfile:', delRes);
        if (delRes.affectedRows == 1) {
            result = { ok: true, msg: 'file is deleted!' }
        } else {
            result = { ok: true, msg: 'db file delete is error!' }
        }
    } else {
        result = { ok: false, msg: 'file is not exist!' }
    }
    ctx.body = result
})

module.exports = router

