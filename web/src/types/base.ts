// 登录请求返回

import { PostBodyModel, RspModel } from "@/services/httpClient";

export interface LoginProp {
    sid:string
}

export interface LoginData extends RspModel {
    data: LoginProp;
}

export interface LoginParam extends PostBodyModel {
    user: string;
    password: string;
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

// 个人中心
export interface personParam extends PostBodyModel {
    new_password: string;
    old_password: string;
  }

export interface selectData {
    label: string;
    value: string | number;
}

//筛选条件
export interface relayIdProp {
    relay_id: string
}
//文件导出
export interface fileProp {
    file_name:string;
}