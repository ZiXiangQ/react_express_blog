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

