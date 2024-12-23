/*
 * @Author: qiuzx
 * @Date: 2024-12-19 14:36:34
 * @LastEditors: qiuzx
 * @Description: description
 */
import './index.css'
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom"
import RouterWaiter from "react-router-waiter"
import { routes } from "../router"

ReactDOM.render(
    // antd的侧边栏SubMenu菜单展开时控制台会报错，暂时关闭StrictMode
    <HashRouter>
        <RouterWaiter routes={routes} />
    </HashRouter>,
  document.getElementById("root")
);
