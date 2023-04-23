<template>
    <div class="files">
        <h1>{{ msg }}</h1>
        <!-- action:发送服务器的地址 -->
        <el-upload action="http://localhost:3000/uploadfiles" list-type="picture-card"
            :on-preview="handlePictureCardPreview" :on-remove="handleRemove" multiple :file-list="fileList"
            :show-file-list="true">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>
  
<script>
import axios from 'axios'


export default {
    name: 'UploadFile',
    data() {
        return {
            msg: '上传文件',
            dialogImageUrl: '',
            dialogVisible: false,
            fileList: [],
        }
    },
    methods: {
        handleRemove(file, fileList) {
            console.log(file, fileList);
            axios.post('http://localhost:3000/delfile', { fileName: file.name })
                .then(res => {
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                    console.log(res);
                })
        },
        handlePictureCardPreview(file) {
            console.log(file);
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        getFileList() {
            axios.get('http://localhost:3000/getfiles')
                .then(res => {
                    console.log(res.data);
                    let list = res.data.result.map(item => {
                        return { name: item, url: `http://localhost:3000/getfiles/${item}` }
                    })
                    console.log(list);
                    this.fileList = list;
                })
        },
    },
    mounted() {
        console.log(this.$route);
        this.getFileList();
    }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
  