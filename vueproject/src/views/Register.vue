<template>
    <div class="board">
        <div class="title">
            <h1>{{ msg }}</h1>
        </div>
        <div class="register">
            <h2 style="margin:10px auto;">账号注册</h2>
            <FormAdd btnMsg="注册" @success="doNext">
                <router-link to="/" slot="login">已有账号,去登录</router-link>
            </FormAdd>
        </div>
    </div>
</template>
  
<script>
import FormAdd from '@/components/FormAdd.vue';

export default {

    name: 'RegisterPage',
    components: {
        FormAdd,
    },
    data() {
        return {
            msg: '物流管理系统',
        }
    },
    methods: {
        doNext(msg) {
            if (msg) {
                this.$router.push('/login')
            }
        }
    },
    // 生命周期函数--钩子函数一般在初始化页面完成后，再对DOM节点进行相关操作
    mounted() {

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

.register {
    width: 60vh;
    height: 80vh;
    border-radius: 50px;
    background-image: linear-gradient(0deg, #4facfe 0%, #00f2fe 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

</style>
  