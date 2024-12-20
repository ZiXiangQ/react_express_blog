/*
 * @Description:
 * @Author: qiuzx
 * @Date: 2023-04-12 16:13:47
 * @LastEditTime: 2023-04-12 16:58:05
 * @LastEditors: qiuzx
 * Copyright 2018 CFFEX.  All rights reserved.
 */
import HttpClient, { RspModel } from "@/services/httpClient";
import { PostBodyModel } from "@/services/httpClient";
import { multiTopicData, MultiTopicProps } from "@/types/multiTopic";

class multiTopicService {
    get_multi_topic_infos(){
        const api = "/multi_topic/get_multi_topic_infos";
        return HttpClient.post<multiTopicData,PostBodyModel>(api,{})
    }

    add_multi_topic_info(param:MultiTopicProps){
        const api = "/multi_topic/add_multi_topic_info";
        return HttpClient.post<RspModel,MultiTopicProps>(api,param)
    }

    modify_multi_topic_info(param:MultiTopicProps){
        const api = '/multi_topic/modify_multi_topic_info';
        return HttpClient.post<RspModel,MultiTopicProps>(api,param)
    }

    delete_multi_topic_info(param:MultiTopicProps){
        const api = '/multi_topic/delete_multi_topic_info';
        return HttpClient.post<RspModel,MultiTopicProps>(api,param)
    }
}

const MultiTopicService = new multiTopicService()
export default MultiTopicService