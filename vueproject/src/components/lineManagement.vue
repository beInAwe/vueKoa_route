<template>
    <div class="lineList">
        <div class="header">
            <el-input placeholder="输入关键字搜索" v-model="search" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="findLine"></el-button>
            </el-input>
            <el-button type="primary" @click="handleAdd">添加物流线路</el-button>
            <el-dialog title="用户信息" :visible.sync="dialogAddVisible">
                <div class="dialogAdd">
                    <FormAdd btnMsg="添加线路" @success="doNext"></FormAdd>
                </div>
            </el-dialog>

        </div>
        <el-table :data="lineList" height="520" border style="width: 95.2%;margin: 0 auto;">
            <el-table-column prop="lineName" label="线路名称" width="200" show-overflow-tooltip
                align="center"></el-table-column>
            <el-table-column prop="way" label="途径" width="260" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="address" label="地址" width="260" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="phone" label="电话" width="260" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="操作" width="260" align="center">
                <template slot-scope="scope">
                    <!-- <div style="display: flex;flex-direction: row;"> -->
                    <el-button size="mini" @click="handleTop(scope.$index, scope.row)">置顶</el-button>
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    <!-- </div> -->
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="用户信息" :visible.sync="dialogFormVisible">
            <el-form :model="editInfo" :rules="rules" ref="editForm">
                <el-form-item label="线路名称" :label-width="formLabelWidth" prop="lineName">
                    <el-input v-model="editInfo.lineName" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="途径" :label-width="formLabelWidth" prop="way">
                    <el-input v-model="editInfo.way" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="地址" :label-width="formLabelWidth" prop="address">
                    <el-input v-model="editInfo.address" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
                    <el-input v-model="editInfo.phone" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="changeInfo('editForm')">确 定</el-button>
            </div>
        </el-dialog>

        <div class="pages">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import FormAdd from './FormAdd.vue';

export default {
    name: 'lineManagement',
    components: {
        FormAdd,
    },
    data() {
        return {
            msg: '物流线路管理',
            lineList: [],
            // 分页
            currentPage: 1,
            pageSize: 10,
            total: 0,
            // 搜索
            search: '',
            // 编辑
            editInfo: {},
            dialogFormVisible: false,
            dialogAddVisible: false,
            formLabelWidth: '120px',
            rules: {
                lineName: [
                    { required: true, message: '线路名称不能为空', trigger: 'change' }
                ],
                phone: [
                    { required: true, message: '电话不能为空', trigger: 'change' }
                ],
                way: [
                    { required: true, message: '途径不能为空', trigger: 'change' }
                ],
                address: [
                    { required: true, message: '地址不能为空', trigger: 'change' }
                ],
            },
        }
    },
    methods: {
        async handleTop(index, row) {
            console.log(index, row);
            let result = await this.$axios.post('/gotop', { lineObj: row });
            if (result.ok) {
                await this.getList();
                this.$message({
                    message: result.msg,
                    type: 'success'
                });
            } else {
                this.$message.error(result.msg)
            }
        },
        handleEdit(index, row) {
            console.log(index, row);
            this.editInfo = { ...row };
            this.dialogFormVisible = true;
        },
        changeInfo(form) {
            this.$refs[form].validate((valid) => {//表单校验
                if (valid) {//valid表示验证是否通过，返回值为布尔类型
                    this.dialogFormVisible = false;
                    this.$axios.post('/changeline', { lineInfo: this.editInfo })
                        .then(async (res) => {
                            console.log(res);
                            if (res.ok) {
                                await this.getList();
                                this.$message({
                                    message: res.msg,
                                    type: 'success'
                                });
                            } else {
                                this.$message.error(res.msg);
                            }
                        })
                } else {
                    console.log('表格不能为空!!');
                    return false;
                }
            });
        },
        handleDelete(index, row) {
            console.log(index, row.userId);
            // 提示信息
            this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            })
                .then(async () => {
                    let res = await this.$axios.post('/delline', { id: row.lineId });
                    console.log(res);
                    if (res.ok) {
                        await this.getList();
                        this.$message({
                            type: 'success',
                            message: res.msg
                        });
                        if (this.lineList.length == 0 && this.currentPage > 1) {
                            this.currentPage = this.currentPage - 1;
                            this.getList();
                        }
                    }
                })
        },
        handleAdd() {
            this.dialogAddVisible = true;
        },
        doNext(msg) {
            if (msg) {
                this.dialogAddVisible = false;
                this.getList();
            }
        },
        async getList() {
            // post
            let res = await this.$axios.post('/getlines', { currentPage: this.currentPage, pageSize: this.pageSize });
            this.total = res.total;
            this.lineList = res.currentList;
        },
        async handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pageSize = val
            this.getList();
        },
        async handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
            this.getList();
        },
        async findLine() {
            if (this.search == '') {
                this.getList();
                this.$message.error('请输入关键字进行查找!')
            }
            else {
                let res = await this.$axios.post('/searchline', { keyWord: this.search });
                console.log(res);
                this.total = res.total;
                this.lineList = res.List;
                if (res.total == 0) {
                    this.$message.error(res.msg)
                } else {
                    this.$message.success(res.msg)
                }
                this.search = '';
            }
        }
    },
    // 生命周期函数--钩子函数一般在初始化页面完成后，再对DOM节点进行相关操作
    async mounted() {
        console.log(this.$route.query);
        this.$emit("transfer", this.msg);
        await this.getList()
    }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid #ccc;
    padding: 5px;
}

.input-with-select {
    width: 400px;
    /* margin-right: 20px; */
}

.dialogAdd {
    display: flex;
    justify-content: center;
    align-items: center;
}

.pages {
    margin: 28px auto;
}
</style>
  