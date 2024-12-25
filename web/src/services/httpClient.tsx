/*
 * @Author: qiuzx
 * @Date: 2024-12-19 16:35:24
 * @LastEditors: qiuzx
 * @Description: description
 */
import axios from ".";
import { message } from "antd";

export interface RspModel {
    code: number | string;
    message: string;
}

export interface PostBodyModel {}

class HttpClient {
    constructor() {}

    private async handleResponse<T>(promise: Promise<any>): Promise<T> {
        try {
            const rsp = await promise;
            if (rsp.data && rsp.data.code !== 'ok') {
                message.error(rsp.data.message);
                throw new Error(rsp.data.message); // 抛出错误以便外部捕获
            }
            return rsp.data;
        } catch (error) {
            // 可以在此统一处理请求错误，例如记录日志
            console.error("HTTP Request Error:", error);
            throw error; // 继续抛出错误
        }
    }

    async get<T extends RspModel>(api: string): Promise<T> {
        return this.handleResponse(axios.get<T>(api));
    }

    async post<T extends RspModel, V extends PostBodyModel>(api: string, body: V): Promise<T> {
        return this.handleResponse(axios.post<T>(api, body));
    }

    async upload<T extends RspModel, V extends PostBodyModel>(api: string, body: V, params?: any): Promise<T> {
        return this.handleResponse(axios.post<T>(api, body, { ...params }));
    }
}

const httpClient = new HttpClient();
export default httpClient;
