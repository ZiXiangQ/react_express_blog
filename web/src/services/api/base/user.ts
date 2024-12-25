import HttpClient, { RspModel } from "@/services/httpClient";
import { PostBodyModel } from "@/services/httpClient";
import { resetParam, userData, UserId, UserProps } from "@/types/user";

class userService {
    get_user_infos(){
        const api = "/user/get_user_infos";
        return HttpClient.post<userData,PostBodyModel>(api,{})
    }

    modify_user_info(param:UserProps){
        const api = "/user/modify_user_info";
        return HttpClient.post<RspModel,UserProps>(api,param)
    }

    add_user_info(param:UserProps){
        const api = '/user/add_user_info';
        return HttpClient.post<RspModel,UserProps>(api,param)
    }

    reset_user_password(param:resetParam){
        const api = '/user/reset_user_password';
        return HttpClient.post<RspModel,resetParam>(api,param)
    }

    lock_user_status(param:UserId){
        const api = '/user/lock_user_status';
        return HttpClient.post<RspModel,UserId>(api,param)
    }

    unlock_user_status(param:UserId){
        const api = '/user/unlock_user_status';
        return HttpClient.post<RspModel,UserId>(api,param)
    }
}

const UserService = new userService()
export default UserService
