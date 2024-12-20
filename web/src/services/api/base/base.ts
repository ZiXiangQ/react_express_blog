/*
 * @Author: qiuzx
 * @Date: 2024-12-19 16:35:24
 * @LastEditors: qiuzx
 * @Description: description
 */

import HttpClient from "@/services/httpClient";
import { RspModel ,PostBodyModel} from "@/services/httpClient"
import { LoginData, LoginParam } from "@/types/base"

class basicService {
    login(param: LoginParam) {
        const api = "/account/login"
        return HttpClient.post<LoginData, LoginParam>(api, param)
    }
    logout() {
        const api = "/account/logout"
        return HttpClient.post<RspModel, PostBodyModel>(api,{})
    }
}

const BasicService = new basicService()
export default BasicService
