/*
 * @Author: qiuzx
 * @Date: 2025-01-07 17:30:55
 * @LastEditors: qiuzx
 * @Description: description
 */
import HttpClient from "@/services/httpClient";
import { childProjectItem, fileContent, projectList } from "@/types/project";

class projectService {

  get_all_projects() {  //获取所有项目
    const api = '/file_handle/project/topname';
    return HttpClient.get<projectList>(api)
  }

  get_children_tree(param: {project_key:string}) {  //获取子项目树
    const api = `/file_handle/project/get_children_tree`;
    return HttpClient.post<childProjectItem,{project_key:string}>(api,param)
  }

  get_file_content(param: {file_path:string}) { //获取文件内容
    const api = `/file_handle/file_read`;
    return HttpClient.post<fileContent,{file_path:string}>(api,param)
  }  

  get_pdf_content(param: { file_path: string }) {
    const api = '/file_handle/file_read';
    return HttpClient.fetchPdf(api, param);  // 使用 fetchPdf 获取 PDF
  }

}
const ProjectService = new projectService();
export default ProjectService;
