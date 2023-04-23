<template>
    <div class="container">
        <div class="header">
            <el-button type="primary" plain class="btn" @click="uploaddialog = true">上传图片</el-button>
        </div>
        <div class="imgBox" v-if="total == 0">
            <span>暂无数据</span>
        </div>

        <div class="imgBox" v-if="total > 0">
            <div v-for="file in currentList" :key="file.name" class="img">
                <el-image style="height: 200px;" :src="file.url"></el-image>

                <div class="icon">
                    <span class="msg">{{ file.originalFilename }}</span>
                    <span class="msg">{{ file.mimetype }}</span>
                    <span class="msg">{{ file.size }}</span>
                    <div class="iconbtn">
                        <span @click="handlePictureCardPreview(file)" class="magnify">
                            <i class="el-icon-zoom-in"></i>
                        </span>
                        <span v-if="!disabled" @click="handleRemove(file)" class="delete">
                            <i class="el-icon-delete"></i>
                        </span>
                    </div>
                </div>

            </div>
        </div>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>

        <el-dialog title="点击下方来上传你的图片" :visible.sync="uploaddialog" width="60%">
            <UploadFiles @transfer="change" />
            <!-- 子组件向父组件传参 -->
        </el-dialog>
        <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>
  
<script>
import UploadFiles from '@/components/UploadFiles.vue'
export default {
    name: 'ImgList',
    components: {
        UploadFiles,
    },
    data() {
        return {
            msg: '图片管理',
            dialogImageUrl: '',
            dialogVisible: false,
            uploaddialog: false,
            disabled: false,
            total: 1,
            currentPage: 1,
            pageSize: 10,
            currentList: [],
        }
    },
    methods: {
        async getFiles() {
            // post
            let res = await this.$axios.post('/getfiles', { currentPage: this.currentPage, pageSize: this.pageSize });
            console.log('getimage:', res);
            if (res.total == 0) {
                this.total = 0
            } else {
                this.total = res.total;
                this.currentList = res.currentList.map(item => {
                    return { ...item, url: `http://localhost:3000/getfiles/${item.originalFilename}` }
                })
            }
        },
        async handleRemove(file) {//图片删除
            let result = await this.$axios.post('/delfile', { imgId: file.imgId, fileName: file.originalFilename });
            // console.log(result);
            if (result.ok) {
                this.$message({
                    message: result.msg,
                    type: 'success'
                });
                await this.getFiles();
                if (this.currentList.length == 0 && this.currentPage > 1) {
                    this.currentPage = this.currentPage - 1;
                    this.getFiles();
                }
            } else {
                this.$message.error(result.msg)
            }
        },
        handlePictureCardPreview(file) {//dialog图片预览
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        async handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pageSize = val
            this.getFiles();
        },
        async handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
            this.getFiles();
        },
        async change(msg) {//父组件向子组件传递的方法
            if (msg) {//msg--子组件传递过来的参数，判断图片是否上传成功
                this.uploaddialog = false;//关闭dialog弹窗
                // 从新获取图片列表，以实现更新状态
                this.getFiles();
            }
        }
    },
    async mounted() {
        this.$emit("transfer", this.msg);
        this.getFiles();
    }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
    width: 100%;
}

.header {
    width: 90%;
    margin: 10px auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.btn {
    display: block;
    margin-left: 100px;
    width: 100px;
    height: 40px;
}

.imgBox {
    width: 90%;
    height: 500px;
    overflow: auto;
    margin: 20px auto;
    border: 4px solid #9a78e9;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
}

.img {
    position: relative;
    margin: 10px;
    width: 200px;
    height: 200px;
    background-color: #ccc;
    overflow: hidden;
}

.icon {
    display: none;
    color: #fff;
}

.img:hover .icon {
    position: absolute;
    left: 0px;
    bottom: 0px;
    background-color: rgba(0, 0, 0, .3);
    width: 200px;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.delete,
.magnify {
    cursor: pointer;
    margin: 20px;
}

.iconbtn {
    margin-top: 20px;
}

.msg {
    margin: 5px;
}
</style>
  