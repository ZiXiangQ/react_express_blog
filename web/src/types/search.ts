/*
 * @Author: qiuzx
 * @Date: 2025-04-14 16:34:38
 * @LastEditors: qiuzx
 * @Description: description
 */
import { RspModel, PostBodyModel } from "@/services/httpClient";

export interface searchResult extends RspModel {
    data:searchResultItem[];
}

export interface searchResultItem {
    filename:string;
    project:string;
    route:string;
    full_path:string;
    type:string;
    update_time:string;
}

export interface searchParams extends PostBodyModel {
    keyword:string;
}
