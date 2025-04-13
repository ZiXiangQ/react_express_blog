/*
 * @Author: qiuzx
 * @Date: 2025-01-07 17:30:55
 * @LastEditors: qiuzx
 * @Description: description
 */
import HttpClient from "@/services/httpClient";
import { childProjectItem, fileContent, projectList, projectItem, sysPath } from "@/types/project";
import { RspModel, PostBodyModel } from "@/services/httpClient";
class projectService {

  get_all_projects() {  //获取所有项目
    const api = '/file_handle/project/get_all_projects';
    return HttpClient.post<projectList,PostBodyModel>(api,{})
  }

  add_project(param: projectItem) {  //添加项目
    const api = '/file_handle/project/add_project';
    return HttpClient.post<projectList, projectItem>(api, param)
  }

  update_project(param: projectItem) {  //更新项目
    const api = '/file_handle/project/update_project';
    return HttpClient.post<projectList, projectItem>(api, param)
  }

  delete_project(id: number) {  //删除项目
    const api = '/file_handle/project/delete_project';
    return HttpClient.post<projectList, {id: number}>(api, {id})
  }

  get_system_path(){ //获取项目路径
    const api = '/file_handle/project/get_system_path';
    return HttpClient.post<sysPath,PostBodyModel>(api,{})
  }

  modify_system_path(param: {id:number,system_config_path:string}){  //修改项目路径
    const api = '/file_handle/project/modify_system_path';
    return HttpClient.post<RspModel, {id:number,system_config_path:string}>(api,param)
  }

  get_children_tree(param: {project_key:string}) {  //获取子项目树
    const api = `/file_handle/project/get_children_tree`;
    return HttpClient.post<childProjectItem,{project_key:string}>(api,param)
  }

  // get_file_content(param: {file_path:string}) { //获取文件内容
  //   const api = `/file_handle/file/read/`;
  //   return HttpClient.post<fileContent,{file_path:string}>(api,param)
  // }  
  get_file_content(param: {file_path: string}) {
    const api = `/file_handle/file/read/`;
    const lowerCasePath = param.file_path.toLowerCase();
    // 判断是否为PDF文件（不区分大小写）
    if (lowerCasePath.endsWith('.pdf')) {
      return HttpClient.fetchPdf('/file_handle/file/read/', param);
    }
    // 判断是否为Word文件（不区分大小写）
    if (lowerCasePath.endsWith('.doc') || lowerCasePath.endsWith('.docx')) {
      return HttpClient.fetchPdf('/file_handle/file/read/', param);
    }
    if (lowerCasePath.endsWith('.md')) {
      return HttpClient.post('/file_handle/file/read/', param);
    }
    // 其他文件类型调用普通API
    return HttpClient.post<fileContent, { file_path: string }>(api, param);
  } 


  get_pdf_content(param: { file_path: string }) {
    const api = '/file_handle/file/read/';
    return HttpClient.fetchPdf(api, param);  // 使用 fetchPdf 获取 PDF
  }

}
const ProjectService = new projectService();
export default ProjectService;
