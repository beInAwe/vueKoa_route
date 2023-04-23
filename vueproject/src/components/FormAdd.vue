<template>
    <div class="form">

        <el-form :model="lineForm" status-icon :rules="rules" ref="lineForm" v-if="btnMsg == '添加线路'">

            <el-form-item prop="lineName">
                <el-input v-model="lineForm.lineName" autocomplete="off" placeholder="线路名称"></el-input>
            </el-form-item>

            <el-form-item prop="way">
                <el-input v-model="lineForm.way" autocomplete="off" placeholder="途径"></el-input>
            </el-form-item>

            <el-form-item prop="address">
                <el-input v-model="lineForm.address" autocomplete="off" placeholder="地址"></el-input>
            </el-form-item>

            <el-form-item prop="phone">
                <el-input v-model="lineForm.phone" autocomplete="off" placeholder="电话"></el-input>
            </el-form-item>

        </el-form>

        <el-form :model="form" status-icon :rules="rules" ref="form" v-else>

            <el-form-item prop="userName">
                <el-input v-model="form.userName" autocomplete="off" placeholder="姓名"></el-input>
            </el-form-item>

            <el-form-item prop="password">
                <el-input v-model="form.password" autocomplete="off" placeholder="密码" type="password"></el-input>
            </el-form-item>

            <el-form-item prop="phone">
                <el-input v-model="form.phone" autocomplete="off" placeholder="电话"></el-input>
            </el-form-item>

            <el-form-item prop="email">
                <el-input v-model="form.email" autocomplete="off" placeholder="邮箱"></el-input>
            </el-form-item>

            <el-form-item prop="address">
                <el-input v-model="form.address" autocomplete="off" placeholder="地址"></el-input>
            </el-form-item>

        </el-form>

        <div class="submit">
            <el-button type="primary" @click="submitLineForm('lineForm')" style="width: 100%;" v-if="btnMsg == '添加线路'">{{
                btnMsg
            }}</el-button>
            <el-button type="primary" @click="submitForm('form')" style="width: 100%;" v-else>{{ btnMsg }}</el-button>
        </div>
        <slot name="login"></slot>
    </div>
</template>
  
<script>

export default {

    name: 'FormAdd',
    props: {
        btnMsg: String
    },
    data() {
        return {
            form: {
                userName: '',
                password: '',
                phone: '',
                email: '',
                address: ''
            },
            lineForm: {
                lineName: '',
                way: '',
                address: '',
                phone: ''
            },
            rules: {
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ],
                userName: [
                    { required: true, message: '姓名不能为空', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '电话不能为空', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '邮箱不能为空', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '地址不能为空', trigger: 'blur' }
                ],
                lineName: [
                    { required: true, message: '线路名称不能为空', trigger: 'blur' }
                ],
                way: [
                    { required: true, message: '途径不能为空', trigger: 'blur' }
                ],
            },
        }
    },
    methods: {
        async submitForm(form) {
            this.$refs[form].validate(async (valid) => {
                if (valid) {
                    console.log(this.form);
                    let res = await this.$axios.post('/register', { userInfo: { ...this.form, userId: Math.random().toString(16).slice(2), avatar: null } });
                    console.log(res);
                    if (res.ok) {
                        this.$message.success(res.msg);
                        this.$emit('success', true)
                    } else {
                        this.$message.error(res.msg);
                    }
                } else {
                    console.log(`${this.btnMsg}失败!!`);
                    return false;
                }
            });
        },
        async submitLineForm(lineForm) {
            this.$refs[lineForm].validate(async (valid) => {
                if (valid) {
                    console.log(this.lineForm);
                    let res = await this.$axios.post('/addline', { lineInfo: { ...this.lineForm, lineId: Math.random().toString(16).slice(2) } });
                    console.log(res);
                    if (res.ok) {
                        this.$message.success(res.msg);
                        this.$emit('success', true)
                    } else {
                        this.$message.error(res.msg);
                    }
                } else {
                    console.log(`${this.btnMsg}失败!!`);
                    return false;
                }
            });
        },
    },
    // 生命周期函数--钩子函数一般在初始化页面完成后，再对DOM节点进行相关操作
    mounted() {

    }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.form {
    padding: 30px;
    width: 70%;
}

.submit {
    margin: 40px auto;
}
</style>
  