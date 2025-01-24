/*
 * @Author: qiuzx
 * @Date: 2025-01-07 18:34:07
 * @LastEditors: qiuzx
 * @Description: description
 */
import { RspModel } from "@/services/httpClient";

export interface projectItem {
    id?:number;
    project_name?:string;
    project_key?:string;
    visible_users?:string;
    type?:string;
}

export interface projectList extends RspModel {
    data:projectItem[];
}

export interface fileKey {
    name:string;
    path:string;
}
export interface folderKey {
    [folderName:string]:fileKey[];
}

export interface childProjectItem extends RspModel {
    data:folderKey;
}

export interface fileContent extends RspModel {
    blob: fileContent;
    data:
    {
        content:string,
        type?:string
    }
}
