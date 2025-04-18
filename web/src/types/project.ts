/*
 * @Author: qiuzx
 * @Date: 2025-01-07 18:34:07
 * @LastEditors: qiuzx
 * @Description: description
 */
import { RspModel } from "@/services/httpClient";

export interface projectItem { //项目
    id: number;
    project_name?: string;
    project_key?: string;
    visible_users?: string;
    type?: string;
    isEditing?: boolean;
}

export interface projectList extends RspModel {
    map(arg0: (item: projectItem) => { isEditing: boolean; id?: number; project_name?: string; project_key?: string; visible_users?: string; type?: string; }): unknown;
    data: projectItem[];
}

export interface sysPath extends RspModel {  //系统路径
    data: string;
}

export interface fileKey { //文件路径
    name: string;
    path: string;
    type: string;
    children?: fileKey[];
}

// 更新 folderKey 以支持两种格式
export interface folderKey {
    [folderName: string]: fileKey[];
}

// 新增 FileTree 类型，用于表示树形结构
export type FileTree = fileKey[];

export interface childProjectItem extends RspModel { //子项目
    data: folderKey | FileTree;
}

export interface fileContent extends RspModel { //文件内容
    blob: fileContent;
    data:
    {
        content: string,
        type?: string
    }
}

export interface LeftMenuProps {//左侧菜单
    data: fileKey[];
    projectKey: string;
}

export interface FlattenedItem {//扁平化树
    key: string;
    label: string;
    level: number;
    isFolder: boolean;
    type: string;
    parentKey?: string;
}

///////////文件类型定义
export interface mdDataType extends RspModel { //md文件内容
    data: mdContent;
}

export interface mdContent {
    content: string;
    meta: Record<string, string>;
    type?: string;
}

export interface excelDataType extends RspModel { //excel文件内容
    data: excelContent;
}

export interface excelContent {
    type?: string;
    content: SheetData[];
    meta: {
        sheets_count: number;
        filename: string;
    };
}

export interface SheetData {
    name: string;
    headers: Array<{
        value: string;
        width: number;
    }>;
    rows: string[][];
}
