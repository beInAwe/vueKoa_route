
<template>
    <el-container style="min-height: 500px; border: 1px solid #eee">
        <el-aside width="230px" style="background-color: rgb(238, 241, 246)">
            <el-menu :default-openeds="['1', '2']" :default-active="active" router background-color="#B3AFFB"
                text-color="#fff" active-text-color="#ffd04b" style="margin:0 auto;border:none;">
                <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-menu"></i>导航
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/main">
                            <i class="el-icon-s-home"></i>
                            <span>首页</span>
                        </el-menu-item>
                        
                        <el-menu-item index="/main/imglist">
                            <i class="el-icon-picture"></i>
                            <span>图片管理</span>
                        </el-menu-item>

                        <el-menu-item index="/main/users">
                            <i class="el-icon-user"></i>
                            <span>用户管理</span>
                        </el-menu-item>

                        <el-menu-item index="/main/lineM">
                            <i class="el-icon-time"></i>
                            
                            <span>物流线路管理</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>

                <!-- <el-submenu index="2">
                    <template slot="title"><i class="el-icon-menu"></i>导航二</template>
                    <el-menu-item-group>
                        <template slot="title">分组一</template>
                        <el-menu-item index="/main/news">
                            <i class="el-icon-chat-dot-round"></i>
                            <span>News</span>
                        </el-menu-item>
                        <el-menu-item index="/main/count">
                            <i class="el-icon-plus"></i>
                            <span>Count</span>
                        </el-menu-item>
                    </el-menu-item-group>

                    <el-menu-item-group title="分组2">
                        <el-menu-item index="/main/upload">
                            <i class="el-icon-upload"></i>
                            <span>Upload</span>
                        </el-menu-item>
                    </el-menu-item-group>

                </el-submenu> -->

            </el-menu>
        </el-aside>

        <el-container>
            <el-header>
                <h2>{{ title }}</h2>
                <div class="user">
                    <el-dropdown style="display: flex; align-items: center;">
                        <el-avatar shape="square" size="medium" :src="user.avatar"></el-avatar>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="dropdown">
                                <input type="file" id="file" @change="select">
                                <label class="upload" for="file">上传头像</label>
                            </el-dropdown-item>
                            <el-dropdown-item @click.native="logoutFn">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <span>{{ user.userName }}</span>
                </div>
            </el-header>

            <el-main style="margin:0;padding: 0;min-height: 90vh;">
                <router-view @transfer="change" @setStorage="setStorage" />
            </el-main>
        </el-container>
    </el-container>
</template>
  
<script>

export default {
    name: 'MainPage',

    components: {

    },

    data() {
        return {
            user: {},
            title: '',
            active: '/main'
        }
    },
    // 页面中调用的方法，或者程序实现逻辑中调用的方法
    methods: {

        change(msg) {
            this.title = msg;
        },
        setStorage(msg) {//将修改之后的用户数据在本地存储中更新
            console.log(msg);
            sessionStorage.setItem('user', msg);
            this.user = JSON.parse(sessionStorage.getItem('user'));
        },
        dropdown() {
            console.log('dropdown');
        },
        logoutFn() {
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token');
            this.$router.push('/login');
        },
        async select(e) {
            let fileList = e.target.files;
            let formData = new FormData();
            formData.append('img', fileList[0]);
            let result = await this.$axios.post('/uploadavatar', formData);
            console.log(result);
            if (result.ok) {
                (async () => {
                    let res = await this.$axios.post('/changeinfo', { userInfo: { ...this.user, avatar: `http://localhost:3000/getavatar/${result.files.img.originalFilename}` } });
                    console.log(res);
                    if (res.ok) {
                        this.user = { ...this.user, avatar: `http://localhost:3000/getavatar/${result.files.img.originalFilename}` }
                        sessionStorage.setItem('user', JSON.stringify(this.user))
                        this.$message.success('头像上传成功!')
                    }
                })()
            } else {
                this.$message.error('头像上传失败!')
            }
        }
    },
    // 生命周期函数--钩子函数一般在初始化页面完成后，再对DOM节点进行相关操作
    mounted() {
        this.user = JSON.parse(sessionStorage.getItem('user'));
        this.active = this.$route.path;
        // console.log(this.$route);
    }
}
</script>
  
<style scoped>
li {
    list-style: none;
}

a {
    text-decoration: none;
    color: #333;
}

#file {
    display: none;
}

/* 布局容器样式 */
.el-header {
    background-color: #B3AFFB;
    color: #333;
    line-height: 60px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 30px;
    align-items: center;
    font-size: 12px;
}


.user {
    width: 100px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.el-aside {
    color: #333;
}
</style>
  