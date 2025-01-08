/*
 * @Author: qiuzx
 * @Date: 2024-12-30 17:48:49
 * @LastEditors: qiuzx
 * @Description: description
 */
import { RspModel } from "@/services/httpClient";

export interface userParam {
    id?:number;
    username?:string;
    password?:string;
    password1?:string;
    email?:string;
    is_active?:boolean;
}

export interface userData extends RspModel {
    data:userParam[];
}


