
const router = require('koa-router')()

// 添加物流路线
router.post('/addline', async (ctx, next) => {
    let { lineInfo } = ctx.request.body;
    let { lineId, lineName, way, address, phone } = lineInfo;
    let msgObj = {};
    let sql1 = 'select * from linemanager where lineName=?'
    let line = await ctx.db.EXCUTE(sql1, [lineInfo.lineName]);
    console.log(line);
    if (line.length == 0) {
        let sql = 'insert into linemanager(lineId, lineName, way, address, phone) values(?,?,?,?,?)';
        let result = await ctx.db.EXCUTE(sql, [lineId, lineName, way, address, phone]);
        console.log('addline:', result);
        msgObj = { ok: true, msg: '路线添加成功!' }
    } else {
        msgObj = { ok: false, msg: '该线路已存在!' }
    }

    ctx.body = msgObj
})

// 获取用户列表
router.post('/getlines', async (ctx, next) => {
    let { currentPage, pageSize } = ctx.request.body;
    let sql = 'select *from linemanager ORDER BY seq asc'
    let result = await ctx.db.EXCUTE(sql);
    console.log(result);

    ctx.body = { currentList: result.slice((currentPage - 1) * pageSize, currentPage * pageSize), total: result.length }
})

// 修改路线信息
router.post('/changeline', async (ctx, next) => {
    let { lineInfo } = ctx.request.body;
    console.log(lineInfo);
    let { lineId, lineName, way, address, phone } = lineInfo;
    let msgObj = {};
    let sql = 'select * from linemanager where lineId=?'
    let editLine = await ctx.db.EXCUTE(sql, [lineId]);
    console.log('editUser:', editLine);
    let sql1 = 'select * from linemanager where lineName=?'
    let sameLine = await ctx.db.EXCUTE(sql1, [lineName]);
    console.log('sameLine:', sameLine);
    console.log('length:', sameLine.length);
    console.log('if=', sameLine[0].lineId == editLine[0].lineId);
    if (sameLine.length == 0 || (sameLine.length == 1 && sameLine[0].lineId == editLine[0].lineId)) {
        let sql2 = 'update linemanager set lineName=?,way=?,address=?,phone=? where lineId=?'
        let result = await ctx.db.EXCUTE(sql2, [lineName, way, address, phone, lineId]);
        console.log('changeRes:', result);
        msgObj = { ok: true, msg: '修改成功!' }
    } else {
        msgObj = { ok: false, msg: '该路线已存在!' }
    }

    ctx.body = msgObj;
})

// 删除线路信息
router.post('/delline', async (ctx, next) => {
    let { id } = ctx.request.body;
    console.log(id);
    let msgObj = {};
    let sql = 'delete from linemanager where lineId=?'
    let result = await ctx.db.EXCUTE(sql, [id]);
    console.log('delRes:', result);
    if (result.affectedRows == 1) {
        msgObj = { ok: true, msg: '删除成功!' };
    } else {
        msgObj = { ok: false, msg: '删除失败!' }
    }

    ctx.body = msgObj;
})

// 查找线路信息
router.post('/searchline', async (ctx, next) => {
    let { keyWord } = ctx.request.body;
    let msgObj = {};
    let sql = `select * from linemanager where lineName LIKE '%${keyWord}%' or phone LIKE '%${keyWord}%' or way LIKE '%${keyWord}%' or address LIKE '%${keyWord}%'`
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

// 指定线路
router.post('/gotop', async (ctx, next) => {
    let { lineObj } = ctx.request.body;
    let { seq, lineId } = lineObj;
    let msgObj = {}
    let sql = 'update linemanager set seq = seq + 1 where seq < ?'
    let res = await ctx.db.EXCUTE(sql, [seq]);
    if (res.affectedRows > 0) {
        let sql2 = 'update linemanager set seq = 1 where lineId = ?'
        let res2 = await ctx.db.EXCUTE(sql2, [lineId]);
        if (res2.affectedRows == 1) {
            msgObj = { ok: true, msg: '置顶成功!', }
        } else {
            msgObj = { ok: false, msg: 'set seq=1 error!' }
        }
    } else {
        msgObj = { ok: false, msg: 'set seq+1 error!' }
    }

    ctx.body = msgObj
})

module.exports = router