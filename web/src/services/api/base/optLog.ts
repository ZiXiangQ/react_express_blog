/*
 * @Description:
 * @Author: qiuzx
 * @Date: 2023-04-14 10:48:59
 * @LastEditTime: 2023-04-14 11:42:49
 * @LastEditors: qiuzx
 * Copyright 2018 CFFEX.  All rights reserved.
 */
import HttpClient from "@/services/httpClient";
import { operationLogData, optParam } from "@/types/optlog";

class optLogService {
    query_log_operation(param:optParam){
        const api = "/log_operation/query_log_operation";
        return HttpClient.post<operationLogData,optParam>(api,param)
    }
}

const OptLogService = new optLogService();
export default OptLogService;