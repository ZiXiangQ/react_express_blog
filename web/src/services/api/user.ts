import HttpClient, { RspModel } from "@/services/httpClient";
import { PostBodyModel } from "@/services/httpClient";
import {  userData, userParam } from "@/types/user";

class userService {
    create(param:userParam){ 
        const api = "/user_handle/create";
        return HttpClient.post<RspModel,userParam>(api,param)
    }

    modify_user(param:userParam){
        const api = `/user_handle/${param.id}/update`;
        return HttpClient.post<RspModel,userParam>(api,param)
    }

    delete_user(param:userParam){
        const api = `/user_handle/${param.id}/delete`;
        return HttpClient.post<RspModel,PostBodyModel>(api,{})
    }

    get_user_list(){
        const api = '/user_handle/get_all_user';
        return HttpClient.post<userData,PostBodyModel>(api,{})
    }

    modify_password(param:userParam){
        const api = `/user_handle/${param.id}/modify_password`;
        return HttpClient.post<RspModel,userParam>(api,param)
    }
}

const UserService = new userService()
export default UserService
