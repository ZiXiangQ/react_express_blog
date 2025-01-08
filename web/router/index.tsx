// src/router/index.tsx
import Index from '@/views/login/index';
import Page403 from '@/views/errorPage/page403';
import Page404 from '@/views/errorPage/page404';
import PageLayout from '@/views/PageLayout';
import UserHandle from '@/views/userHandle';
import ClientMain from '@/views/clientMain';
import FileList from '@/views/fileList';
import FileContent from '@/views/fileContent';
import { RoutesTypeNew } from '@/types/routes';

/**
 * @description: 全局路由配置
 * meta字段说明：↓↓↓
 * @param {string} title // 路由页面标题，以及侧边栏菜单中的标题
 * @param {element} icon // 侧边栏该路由菜单显示的图标
 * @param {string} accessId // 路由页面权限id
 * @param {boolean} noLogin // 路由页面是否需要登录访问
 * @param {boolean} hideMenu // 是否在侧边栏中隐藏该路由菜单
 */
const routes: RoutesTypeNew = [
    {
        path: "/",
        redirect: "/login",
    },
    {
        path: "/",
        element: <PageLayout />,
        children: [
            {
                path: "clientMain",
                element: <ClientMain />,
                meta: {
                    title: "首页",
                    // icon: <LineChartOutlined />,
                    accessId: "dashboard",
                },
            },
            {
                path: "userHandle",
                element: <UserHandle />,
                meta: {
                    title: "用户管理",
                    // icon: <LineChartOutlined />,
                    accessId: "userHandle",
                },
            },
            {
                path: "fileList",
                element: <FileList />,
                meta: {
                    title: "文件列表",
                    // icon: <LineChartOutlined />,
                    accessId: "fileList",
                },
            },
            {
                path: "file/:filePath",
                element: <FileContent />,
                meta: {
                    title: "文件内容",
                    hideMenu: true,
                },
            },
            {
                path:"project/febao",
                element: <FileList />,
            }
        ],
    },
    {
        path: "/login",
        element: <Index />,
        meta: {
            title: "登录",
            noLogin: true,
            hideMenu: true,
        },
    },
    {
        path: "/403",
        element: <Page403 />,
        meta: {
            title: "403",
            noLogin: true,
            hideMenu: true,
        },
    },
    {
        path: "*",
        element: <Page404 />,
        meta: {
            title: "404",
            noLogin: true,
            hideMenu: true,
        },
    },
];

export { routes };
