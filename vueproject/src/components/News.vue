<template>
    <div class="newsList">
        <!-- <h1>{{ msg }}</h1> -->
        <el-table :data="chapterList" style="width: 1000px;margin: 0 auto;">
            <el-table-column label="日期" width="230">
                <template slot-scope="scope">

                    <!-- 时间选择器 -->
                    <div v-if="scope.row.change">
                        <el-date-picker v-model="redact.timer" type="date" placeholder="选择日期">
                        </el-date-picker>
                    </div>

                    <div v-if="!scope.row.change">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.timer }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="新闻标题" width="360">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>标题: {{ scope.row.chapterTitle }}</p>
                        <p>内容: {{ scope.row.chapterContent }}</p>
                        <div slot="reference" class="name-wrapper">
                            <div v-if="scope.row.change" style="display: flex;">
                                <el-select v-model="select" slot="prepend" placeholder="请选择" style="width: 120px;">
                                    <el-option label="新闻标题" value="title"></el-option>
                                    <el-option label="新闻内容" value="content"></el-option>
                                </el-select>
                                <el-input v-if="select === 'title'" placeholder="title" v-model="redact.title" autosize
                                    style="width: 238px;"></el-input>
                                <el-input v-if="select === 'content'" placeholder="content" v-model="redact.content"
                                    autosize style="width: 238px;"></el-input>
                            </div>
                            <el-tag size="medium" v-if="!scope.row.change">{{ scope.row.chapterTitle }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleChange(scope.$index, scope.row)"
                        v-if="!scope.row.change">编辑</el-button>
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
                        v-if="scope.row.change">完成</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row>
            <el-button @click="dialogFormVisible = true" type="primary">添加新闻数据</el-button>
        </el-row>
        <!-- 弹出对话框 -->
        <!-- 本以为:visible.sync是elementui的写法，用来显示和隐藏一个弹框，但是看了以后，才知道这个是vue的写法，:visible指的是属性绑定，表示弹框的显示隐藏，当:visible的值为ture的时候，弹框显示，当为false的时候，弹框隐藏，后面的.sync是什么意思呢，指的就是同步动态双向的来表示visible的值，当我们关闭窗口的时候，这个弹框隐藏了，visible的值发生了变化，但是关闭窗口这个动作，我们没法用确定的动作去判断这个值，所以用到了vue中的双向绑定的原则，在vue中统一加上了.sync来表示同步的修改了visible的值。 -->
        <el-dialog title="新闻列表" :visible.sync="dialogFormVisible">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="新闻标题" :label-width="formLabelWidth" prop="title">
                    <el-input v-model="form.title" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="新闻内容" :label-width="formLabelWidth" prop="content">
                    <el-input v-model="form.content" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="时间" :label-width="formLabelWidth" prop="timer">
                    <el-date-picker v-model="form.timer" type="date" placeholder="选择日期" style="width: 100%;">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addChapter('form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
  
<script>

export default {
    name: 'NewsList',
    data() {
        return {
            msg: '新闻列表',
            chapterList: [],
            // 编辑
            redact: {
                title: '',
                timer: '',
                content: ''
            },
            // 表格
            dialogFormVisible: false,
            form: {
                title: '',
                timer: '',
                content: '',
            },
            formLabelWidth: '120px',
            rules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'change' }
                ],
                content: [
                    { required: true, message: '请输入内容', trigger: 'change' }
                ],
                timer: [
                    { required: true, message: '请选择时间', trigger: 'change' }
                ]
            },
            // 下拉选项
            select: 'title',//默认选择，与option中的value绑定;选择改变时也会动态改变
        }
    },
    methods: {
        async changeData(obj) {
            console.log('submit');
            let res = await this.$axios.post('/changedata', obj);
            console.log(res);
            if (res.ok) {
                this.$message({
                    message: '恭喜你，修改成功',
                    type: 'success'
                });
                this.chapterList = res.List;
            }
        },
        async getList() {
            let res = await this.$axios.get('/getlist');
            console.log(res);
            this.chapterList = res;
        },
        addChapter(form) {
            this.$refs[form].validate(async (valid) => {//表单校验
                if (valid) {//valid表示验证是否通过，返回值为布尔类型
                    this.dialogFormVisible = false;
                    let res = await this.$axios.post('/sub', {
                        chapterTitle: this.form.title,
                        timer: this.form.timer,
                        chapterContent: this.form.content,
                        change: false
                    })
                    console.log(res);
                    this.chapterList = res;
                } else {
                    console.log('添加失败!!');
                    return false;
                }
            });
        },
        // 时间格式转换
        timeChange(time) {
            let date = new Date(time);  // 参数需要毫秒数，所以这里将秒数乘于 1000
            let Y = date.getFullYear() + '/';
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
            let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
            return Y + M + D;
        },
        handleEdit(index, row) {
            console.log(index, row);
            this.chapterList[index] = { ...row, change: false }
            this.chapterList = [...this.chapterList]
            console.log(row);
            console.log(this.chapterList);
            let obj = {
                index,
                objContent: {
                    chapterTitle: this.redact.title,
                    chapterContent: this.redact.content,
                    timer: this.timeChange(this.redact.timer)
                }
            };
            this.changeData(obj);
        },
        handleChange(index, row) {
            console.log(index, row);
            // 点击编辑时，输入框显示之前数据
            this.redact.timer = row.timer;
            this.redact.title = row.chapterTitle;
            this.redact.content = row.chapterContent;
            this.chapterList[index] = { ...row, change: true }
            this.chapterList = [...this.chapterList]
        },
        handleDelete(index, row) {
            console.log(index, row.chapterId);
            // 提示信息
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(async () => {
                let res = await this.$axios.post('/del', { id: row.chapterId });
                console.log(res);
                if (res.ok) {
                    this.chapterList = res.List
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    },
    // 生命周期函数--钩子函数一般在初始化页面完成后，再对DOM节点进行相关操作
    mounted() {
        console.log(this.$route.query);
        this.$emit("transfer", this.msg);
        this.getList()
    }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
  