/*
 * @Author: qiuzx
 * @Date: 2024-12-19 16:35:24
 * @LastEditors: qiuzx
 * @Description: Enhanced HTTP client with binary response support.
 */
import { AxiosResponse } from "axios";
import axios from ".";
import { message } from "antd";

export interface RspModel {
    code: number | string;
    message: string;
    data?: unknown;
}

export type PostBodyModel = object;

class HttpClient {
    constructor() { }

    /**
     * 处理普通 JSON 响应
     */
    private async handleJsonResponse<T extends RspModel>(promise: Promise<AxiosResponse<T>>): Promise<T> {
        try {
            const rsp = await promise;
            if (rsp.data && rsp.data.code !== 0) {
                message.error(rsp.data.message);
                throw new Error(rsp.data.message); // 抛出错误以便外部捕获
            }
            return rsp.data;
        } catch (error) {
            console.error("HTTP Request Error:", error);
            throw error; // 继续抛出错误
        }
    }

    /**
     * 处理二进制响应（如 PDF 文件）
     */
    async fetchBinaryFile(api: string, body?: PostBodyModel): Promise<string> {
        const config = {
            responseType: "arraybuffer" as const,
        };
        try {
            const response = body
                ? await axios.post(api, body, config)
                : await axios.get(api, config);

            const contentType = response.headers["content-type"] || "application/octet-stream";
            const blob = new Blob([response.data], { type: contentType });
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error("Binary File Fetch Error:", error);
            throw error;
        }
    }


    /**
     * 发送 GET 请求
     */
    async get<T extends RspModel>(api: string): Promise<T> {
        return this.handleJsonResponse(axios.get<T>(api));
    }

    /**
     * 发送 POST 请求
     */
    async post<T extends RspModel, V extends PostBodyModel>(api: string, body: V): Promise<T> {
        return this.handleJsonResponse(axios.post<T>(api, body));
    }

    /**
     * Fetch a PDF file and return its Blob URL
     * @param api API endpoint
     * @param body Request body (optional)
     * @returns Blob URL for the PDF file
     */
    async fetchPdf(api: string, body?: PostBodyModel): Promise<string> {
        const config = {
            responseType: "arraybuffer" as const, // Set response type to binary
        };
        try {
            const response = body
                ? await axios.post(api, body, config)
                : await axios.get(api, config);
            const blob = new Blob([response.data], { type: "application/pdf" });
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error("PDF Fetch Error:", error);
            throw error;
        }
    }

}

const httpClient = new HttpClient();
export default httpClient;
