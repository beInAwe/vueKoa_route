
const router = require('koa-router')()

router.post('/changedata', async (ctx, next) => {
    console.log(ctx.request.body);
    let index = ctx.request.body.index;
    let chapterId = chapterList[index].chapterId;
    let obj = { chapterId, ...ctx.request.body.objContent }
    chapterList[index] = obj;
    ctx.body = { ok: true, List: chapterList };
})

let chapterList = [
    {
        chapterId: 1,
        chapterTitle: "vue循环渲染",
        chapterContent: "element表格组件滑动显示",
        timer: "23/03/03",
        change: false
    }
]
router.get('/getlist', async (ctx, next) => {
    ctx.body = chapterList
})

router.post('/sub', async (ctx, next) => {
    let chapter = {
        chapterId: Math.random(),
        chapterTitle: ctx.request.body.chapterTitle,
        timer: ctx.request.body.timer,
        chapterContent: ctx.request.body.chapterContent
    }
    chapterList.push(chapter);
    ctx.body = chapterList
})

router.post('/del', async (ctx, next) => {
    let id = ctx.request.body.id
    chapterList = chapterList.filter(chapter => chapter.chapterId !== id)
    ctx.body = { ok: true, List: chapterList }
})

module.exports = router