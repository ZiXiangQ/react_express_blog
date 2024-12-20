/*
 * @Description:
 * @Author: qiuzx
 * @Date: 2023-04-04 18:09:22
 * @LastEditTime: 2023-04-06 16:01:25
 * @LastEditors: qiuzx
 * Copyright 2018 CFFEX.  All rights reserved.
 */

import HttpClient, { RspModel } from "@/services/httpClient";
import { PostBodyModel } from "@/services/httpClient";
import { productData, ProductProps } from "@/types/product";

class productService {
    get_product_infos(){
        const api = "/product/get_product_infos";
        return HttpClient.post<productData,PostBodyModel>(api,{})
    }

    add_product_info(param:ProductProps){
        const api = "/product/add_product_info";
        return HttpClient.post<RspModel,ProductProps>(api,param)
    }

    modify_product_info(param:ProductProps){
        const api = '/product/modify_product_info';
        return HttpClient.post<RspModel,ProductProps>(api,param)
    }

    delete_product_info(param:ProductProps){
        const api = '/product/delete_product_info';
        return HttpClient.post<RspModel,ProductProps>(api,param)
    }
}

const ProductService = new productService()
export default ProductService