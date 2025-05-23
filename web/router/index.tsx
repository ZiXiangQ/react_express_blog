/*
 * @Author: qiuzx
 * @Date: 2024-12-19 15:02:42
 * @LastEditors: qiuzx
 * @Description: description
 */
import Index from '@/views/login/index';
import Page403 from '@/views/errorPage/page403';
import Page404 from '@/views/errorPage/page404';
import PageLayout from '@/views/pageLayout';
import UserHandle from '@/views/userHandle';
import FileContent from '@/views/fileContent';
import Setting from '@/views/setting';
import HomePage from '@/views/homePage';
import ExternalPage from '@/views/external';
import { RoutesTypeNew } from '@/types/routes';

/**
 * @description: 全局路由配置
 * meta字段说明：↓↓↓
 * @param {string} title // 路由页面标题，以及侧边栏菜单中的标题
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
                path: "userHandle",
                element: <UserHandle />,
                meta: {
                    title: "用户管理",
                    // icon: <LineChartOutlined />,
                    accessId: "userHandle",
                },
            },
            {
                path: "/setting",
                element: <Setting />,
                meta: {
                    title: "设置",
                    noLogin: true,
                    hideMenu: true,
                },
            },
            {
                path: "home",
                element: <HomePage />,
                meta: {
                    title: "首页",
                    noLogin: true,
                    hideMenu: true,
                },
            },
            {
                path: "external",
                element: <ExternalPage />,
                meta: {
                    title: "外部地址",
                },
            },
            {
                path: "/:projectKey/file",
                element: <FileContent />,
                meta: {
                    title: "文件内容",
                    hideMenu: true,
                },
            },
            {
                path: "/:projectKey",
                element: <FileContent />,
                meta: {
                    title: "项目内容",
                    hideMenu: true,
                },
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
