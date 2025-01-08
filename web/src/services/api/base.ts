/*
 * @Author: qiuzx
 * @Date: 2024-12-19 16:35:24
 * @LastEditors: qiuzx
 * @Description: description
 */

import HttpClient from "@/services/httpClient";
import { RspModel ,PostBodyModel} from "@/services/httpClient"
import { LoginData, LoginValues } from "@/types/base"

class basicService {
    login(param: LoginValues) {
        const api = "/user_handle/login"
        return HttpClient.post<LoginData, LoginValues>(api, param)
    }
    logout() {
        const api = "/user_handle/logout"
        return HttpClient.post<RspModel, PostBodyModel>(api,{})
    }
}

const BasicService = new basicService()
export default BasicService
