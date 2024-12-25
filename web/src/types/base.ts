/*
 * @Author: qiuzx
 * @Date: 2024-12-19 16:40:09
 * @LastEditors: qiuzx
 * @Description: description
 */

import { PostBodyModel, RspModel } from "@/services/httpClient";

export interface LoginProp {
    sid:string
}

export interface LoginData extends RspModel {
    data: LoginProp;
}

export interface LoginValues {
    username: string; // 用户名
    password: string; // 密码
}


export interface LogoutParam extends PostBodyModel {
    sid: string | null
}

//字典值
export interface dict {
    key:string;
    value:string;
}

export interface transferDict {
    title:string;
    key:string
}

export interface dictProp {
    [key:string]: string[][]
}

export interface dictData extends RspModel {
    data: dictProp
}

//table 分页
export interface pageProp {
    page_id: number;
    page_size: number;
}

// 登录请求返回

