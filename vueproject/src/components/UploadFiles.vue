<template>
    <div class="container">
        <div class="btn">
            <div>
                <input type="file" multiple id="file" @change="select">
                <label class="upload" for="file">选择图片</label>
            </div>
            <button class="submit" @click="Submit">提交</button>
        </div>
    </div>
</template>
  


<script type='text/javascript'>
export default {
    name: 'UploadFiles',
    props: {

    },
    data() {
        return {
            fileData: ''
        }
    },
    methods: {
        async Submit() {
            if (this.fileData) {
                let result = await this.$axios.post('/upload', this.fileData);
                console.log(result);
                if (result.ok) {
                    this.$emit('transfer', true)//触发transfer方法，this.user 为向父组件传递的数据
                    this.$message.success('图片上传成功!')
                } else {
                    this.$message.error('图片上传失败!')
                }
                this.fileData = ''
            } else {
                this.$message.error('请选择图片!')
            }
        },
        select(e) {
            let fileList = e.target.files;
            let formData = new FormData();
            for (let i = 0; i < fileList.length; i++) {
                formData.append(Math.random().toString(16).slice(2), fileList[i]);
            }
            this.fileData = formData
        }
    },
    mounted() {
        this.$emit("transfer", this.msg);
    }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
    width: 70%;
    height: 300px;
    border: 4px dashed #ccc;
    margin: 50px auto;
    display: flex;
    justify-content: center;
    align-items: center;
}

#file {
    display: none;
}

.upload {
    display: block;
    width: 120px;
    height: 50px;
    background-color: #B3AFFB;
    text-align: center;
    line-height: 50px;
    border-radius: 7px;
    color: #fff;
    font-size: 20px;
    font-weight: bolder;
    cursor: pointer;
}

.submit {
    display: block;
    width: 100px;
    height: 50px;
    background-color: #B3AFFB;
    text-align: center;
    line-height: 50px;
    border-radius: 7px;
    color: #fff;
    font-size: 20px;
    font-weight: bolder;
    border: none;
    cursor: pointer;
}

.btn {
    width: 60%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}
</style>
  