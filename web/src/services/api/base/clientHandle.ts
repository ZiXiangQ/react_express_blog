/*
 * @Description:
 * @Author: qiuzx
 * @Date: 2023-04-07 08:49:44
 * @LastEditTime: 2023-04-07 09:17:26
 * @LastEditors: qiuzx
 * Copyright 2018 CFFEX.  All rights reserved.
 */
import HttpClient, { RspModel } from "@/services/httpClient";
import { PostBodyModel } from "@/services/httpClient"
import { LoginData } from "@/types/base"
import { clientBase, clientData, clientProps } from "@/types/client";

class clientService {

    get_client_infos(param:clientProps) {
        const api = "/client/get_client_infos"
        return HttpClient.post<clientData, PostBodyModel>(api, param)
    }

    add_client_info(param:clientBase){
        const api = '/client/add_client_info'
        return HttpClient.post<RspModel,clientBase>(api,param)
    }

    modify_client_info(param:clientBase){
        const api = '/client/modify_client_info'
        return HttpClient.post<RspModel,clientBase>(api,param)
    }

    delete_client_info(param:clientData){
        const api = '/client/delete_client_info'
        return HttpClient.post<RspModel,clientData>(api,param)
    }
}

const ClientService = new clientService()
export default ClientService
