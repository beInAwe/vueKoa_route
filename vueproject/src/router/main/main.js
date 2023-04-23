
import HelloWorld from "@/components/HelloWorld";
import CountNum from "@/components/CountNum";
import News from "@/components/News";
import Upload from "@/components/UploadFile";
import ImgList from "@/components/ImgList";
import Users from "@/components/Users";
import lineManagement from "@/components/lineManagement";

export default {
    path: '/main',
    // 在vue中@表示src目录
    component: () => import('@/views/Main'),

    // 二级路由
    children: [
        {
            path: '/',
            name: 'HelloWorld',
            component: HelloWorld
        },
        {
            path: 'news',
            name: 'News',
            component: News
        },
        {
            path: 'count',
            name: 'CountNum',
            component: CountNum
        },
        {
            path: 'upload',
            name: 'Upload',
            component: Upload
        },
        {
            path: 'imglist',
            name: 'ImgList',
            component: ImgList
        },
        {
            path: 'users',
            name: 'Users',
            component: Users
        },
        {
            path: 'lineM',
            name: 'lineM',
            component: lineManagement
        },
    ]
}