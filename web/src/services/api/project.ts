/*
 * @Author: qiuzx
 * @Date: 2025-01-07 17:30:55
 * @LastEditors: qiuzx
 * @Description: description
 */
import HttpClient from "@/services/httpClient";
import { childProjectItem, fileContent, projectList, projectItem, sysPath, mdDataType, excelDataType } from "@/types/project";
import { RspModel, PostBodyModel } from "@/services/httpClient";

// 定义文件响应类型的联合类型
type FileResponseType<T> = T extends string
  ? string
  : T extends mdDataType
  ? mdDataType
  : T extends excelDataType
  ? excelDataType
  : fileContent;

class projectService {

  get_all_projects() {  //获取所有项目
    const api = '/file_handle/project/get_all_projects';
    return HttpClient.post<projectList, PostBodyModel>(api, {})
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
    return HttpClient.post<projectList, { id: number }>(api, { id })
  }

  get_system_path() { //获取项目路径
    const api = '/file_handle/project/get_system_path';
    return HttpClient.post<sysPath, PostBodyModel>(api, {})
  }

  modify_system_path(param: { id: number, system_config_path: string }) {  //修改项目路径
    const api = '/file_handle/project/modify_system_path';
    return HttpClient.post<RspModel, { id: number, system_config_path: string }>(api, param)
  }

  get_children_tree(param: { project_key: string }) {  //获取子项目树
    const api = `/file_handle/project/get_children_tree`;
    return HttpClient.post<childProjectItem, { project_key: string }>(api, param)
  }

  get_file_content<T = string | mdDataType | excelDataType | fileContent>(param: { file_path: string }): Promise<FileResponseType<T>> {
    const api = `/file_handle/file/read/`;
    const lowerCasePath = param.file_path.toLowerCase();
    const fileType = ['pdf', 'doc', 'docx', 'ppt', 'pptx'] //转成pdf返回
    const isPdf = fileType.some(type => lowerCasePath.endsWith(type));
    if (isPdf) {
      return HttpClient.fetchPdf('/file_handle/file/read/', param) as Promise<FileResponseType<T>>;
    }
    if (lowerCasePath.endsWith('.md')) {
      return HttpClient.post<mdDataType, { file_path: string }>(api, param) as Promise<FileResponseType<T>>;
    }
    if (lowerCasePath.endsWith('.xlsx') || lowerCasePath.endsWith('.xls')) {
      return HttpClient.post<excelDataType, { file_path: string }>(api, param) as Promise<FileResponseType<T>>;
    }
    if (lowerCasePath.endsWith('.png')) {
      return HttpClient.fetchBinaryFile('/file_handle/file/read/', param) as Promise<FileResponseType<T>>;
    }
    return HttpClient.post<fileContent, { file_path: string }>(api, param) as Promise<FileResponseType<T>>;
  }

  get_pdf_content(param: { file_path: string }) {
    const api = '/file_handle/file/read/';
    return HttpClient.fetchPdf(api, param);  // 使用 fetchPdf 获取 PDF
  }

}
const ProjectService = new projectService();
export default ProjectService;
