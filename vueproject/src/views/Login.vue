<template>
    <div class="board">
        <div class="login">
            <h2>您还未登陆，请填写信息登录！</h2>
            <div class="form">
                <el-form :model="form" status-icon :rules="rules" ref="form">
                    <el-form-item prop="user">
                        <el-input v-model="form.user" autocomplete="off" placeholder="账号"></el-input>
                    </el-form-item>

                    <el-form-item prop="pwd">
                        <el-input v-model="form.pwd" autocomplete="off" placeholder="密码" type="password"></el-input>
                    </el-form-item>

                    <el-form-item prop="check">
                        <div class="check">
                            <el-input v-model="form.check" autocomplete="off" placeholder="验证码"></el-input>
                            <div class="checkNum" @click="getCaptcha" v-html="captcha"></div>
                        </div>
                    </el-form-item>
                </el-form>
                <div class="submit">
                    <el-button type="primary" @click="submitForm('form')" style="width: 100%;">登录</el-button>
                </div>
                <router-link to="/register">没有账号?去注册</router-link>
            </div>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios'


axios.defaults.withCredentials = true;

export default {

    name: 'LoginPage',
    data() {
        return {
            msg: '物流管理系统',
            captcha: '',
            form: {
                user: '',
                pwd: '',
                check: ''
            },
            rules: {
                user: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                pwd: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ],
                check: [
                    { required: true, message: '验证码不能为空', trigger: 'blur' }
                ]
            },
        }
    },
    methods: {
        submitForm(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    (async () => {
                        let result = await this.$axios.post('/form', {
                            userName: this.form.user,
                            password: this.form.pwd,
                            check: this.form.check
                        })
                        console.log(result);
                        if (result.ok) {
                            // alert(result.msg);
                            // 页面跳转
                            sessionStorage.setItem('token', result.token)//将后端返回的token值存储在本地
                            sessionStorage.setItem('user', JSON.stringify(result.user))//将后端返回的token值存储在本地
                            this.$router.push('/main')
                            this.$message({
                                showClose: true,
                                message: result.msg,
                                type: 'success'
                            });
                        } else {
                            alert(result.msg);
                            this.form.check = '';
                            this.getCaptcha();
                        }
                    })()
                } else {
                    this.$message.error('存在未填项')
                    return false;
                }
            });
        },
        async getCaptcha() {
            let result = await this.$axios.get('/captcha');
            this.captcha = result
        }
    },
    // 生命周期函数--钩子函数一般在初始化页面完成后，再对DOM节点进行相关操作
    mounted() {
        this.getCaptcha()
    }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
    text-decoration: none;
    color: #333;
}

.board {
    width: 100%;
    height: 100vh;
    position: absolute;
    background: url("../assets/board.png") no-repeat center center;
    background-size: 100% 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
}

.title {
    width: 400px;
    height: 500px;
    margin-right: 50px;
    color: #fff;
    font-size: 20px;
}

.login {
    width: 60vh;
    height: 60vh;
    border-radius: 50px;
    background-image: linear-gradient(0deg, black 0%, #D4D4D3 100%);
    opacity: 0.8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color:#fff
}

.form {
    padding: 30px;
    width: 70%;
}

.submit {
    margin: 30px auto;
}

.check {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.checkNum {
    margin-left: 10px;
    cursor: pointer;
}
</style>
  