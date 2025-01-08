/*
 * @Author: qiuzx
 * @Date: 2024-12-19 16:35:24
 * @LastEditors: qiuzx
 * @Description: description
 */

import Axios, { AxiosResponse } from "axios";
import { message } from "antd";
import setCookie from "@/utils/mainFn";

interface AxiosConfig {
  baseURL: string,
  timeout: number;
  headers: {
    "Content-Type": string;
  };
}

const config: AxiosConfig = {
    baseURL: "/mid_service",
    timeout: 600000,
    headers: {
        "Content-Type": "application/json",
    },
};

const axios = Axios.create(config);

// 请求前拦截
axios.interceptors.request.use(
    (req) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        req;
        return req;
    },
    (err) => {
        return Promise.reject(err);
    }
);

// 返回后拦截
axios.interceptors.response.use(
    (response: AxiosResponse): Promise<AxiosResponse> => {
    // 从第一次登录接口接收sid
        if (response.headers.sid) {
            setCookie("token", response.headers.sid);
        }
        if(response.data.code === -2001){
            window.location.hash="/login"
            window.location.reload()
        }
        return Promise.resolve(response);
    },
    (err) => {
        message.destroy();
        console.log(err);
        message.error("请求失败");
        return Promise.reject(err);
    }
);
export default axios;
