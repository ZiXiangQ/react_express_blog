import axios from ".";
import { message } from "antd";
export interface RspModel {
  code: number;
  message: string;
  data: any;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PostBodyModel {}

class httpClient {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    async get<T extends RspModel>(api: string): Promise<T> {
        return await axios.get<T>(`${api}`).then((rsp) => {
            if(rsp.data && rsp.data.code !== 0){
                message.error(rsp.data.message)
            }
            return rsp.data
        });
    }

    async post<T extends RspModel, V extends PostBodyModel>(
        api: string,
        body: V
    ): Promise<T> {
        return await axios.post<T>(api, body).then((rsp) => {
            if(rsp.data && rsp.data.code !== 0){
                message.error(rsp.data.message)
            }
            return rsp.data
        });
    }

    async upload<T extends RspModel, V extends PostBodyModel>(
        api: string,
        body: V,
        params:any
    ): Promise<T> {
        return await axios.post<T>(api, body,params).then((rsp) => {
            return rsp.data;
        });
    }
}

const HttpClient = new httpClient();
export default HttpClient;
