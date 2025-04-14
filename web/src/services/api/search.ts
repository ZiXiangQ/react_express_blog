/*
 * @Author: qiuzx
 * @Date: 2025-04-14 16:32:00
 * @LastEditors: qiuzx
 * @Description: 文件搜索服务
 */

import HttpClient from "@/services/httpClient";
import { searchResult, searchParams } from "@/types/search";
class searchService {

  search_files(keyword: string) {  //获取所有项目
    const api = '/search_engine/search_files';
    return HttpClient.post<searchResult,searchParams>(api,{keyword})
  }
}

const Searchservice  = new searchService();
export default Searchservice;
