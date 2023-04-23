import axios from 'axios';
import { Message } from 'element-ui';

// 设置基本路径
axios.defaults.baseURL = 'http://localhost:3000/';
// 允许axios请求携带cookie传送
axios.defaults.withCredentials = true;

// 添加请求拦截器
axios.interceptors.request.use((config) => {
    // console.log(config);
    /**
     * headers里面的token是一个长字符串,在登录成功之后会通过回调函数的参数返回,
     * headers的作用就是一个钥匙,登录之后的其他所有数据请求操作都要有请求头里面的token字符串才能获得权限;
     * 
     * 进行ajax/axios数据请求时
     * ajax中的token字段在回调函数的参数response中,
     * 而axios的字段在回调函数response里面的data中;
     * 
     * 在登陆成功之后,我们可以将token存储在本地,每次进行其他操作的时候在本地读取,这样就避免了每次都要从网络上重新获取token;
     * 使用ajax时,可以通过jquery里面的ajaxPrefilter函数给访问符合条件的页面时的ajax里面从本地获取然后自动加上headers参数;
     * 
     * Authorization: header + token字段
     */
    // 在发送请求之前做些什么--添加请求头
    let token = sessionStorage.getItem('token');
    config.headers['Authorization'] = `header ${token}`
    return config;
}, (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(
    (response) => {
        // console.log(response)
        if (response.data.code == 500) {
            Message.error(response.data.msg)
        }
        return response.data;
    },
    (error) => {
        console.log(error);
        if (error.response.status == '404') {
            Message.error('请求地址不存在')
        }
        return Promise.reject(error);
    }
);

export default axios;