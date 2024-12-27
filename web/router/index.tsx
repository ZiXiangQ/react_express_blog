/*
 * @Author: qiuzx
 * @Date: 2024-12-19 15:02:42
 * @LastEditors: qiuzx
 * @Description: description
 */
 
// import {
//     LineChartOutlined,
// } from "@ant-design/icons" // meta.icon设置菜单图标，仅设置一级菜单即可
import { RoutesTypeNew } from "@/types/routes"
import Index from "@/views/login/index"
import Page403 from "@/views/errorPage/page403"
import Page404 from "@/views/errorPage/page404"
import PageLayout from "@/views/PageLayout"
import UserHandle from "@/views/userHandle"
import ClientMain from "@/views/clientMain"

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
        element:<PageLayout />,
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
                    title: "首页",
                    // icon: <LineChartOutlined />,
                    accessId: "dashboard",
                },
            },
        ]
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
]

/**
 * @description: 全局路由拦截
 * @param {string} pathname 当前路由路径
 * @param {object} meta 当前路由自定义meta字段
 * @return {string} 需要跳转到其他页时就return一个该页的path路径
 */
// const onRouteBefore: OnRouteBeforeType = ({ pathname, meta }) => {
//     const value = useAppSelector((store) =>store.user)
//     // const { commonStore } = useSelector((store) => store.user)
//     if (!meta.noLogin) {
//         if (value.sid) {
//             // 用户是否已登录
//             const { accessId } = meta
//             const message = `${pathname},${meta.title || ""}`
//             const path403 = `/403?message=${encodeURIComponent(message)}`
//             if (!getIsCanAccess(accessId)) {
//                 return path403
//             }
//         } else {
//             return "/login"
//         }
//     }else{
//         return "/login"
//     }
// }

// export { routes, onRouteBefore };
export { routes };
