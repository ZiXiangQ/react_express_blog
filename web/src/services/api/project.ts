import HttpClient from "@/services/httpClient";
import { childProjectItem, fileContent, projectList } from "@/types/project";

class projectService {

  get_all_projects() {  //获取所有项目
    const api = '/file_handle/project';
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

}
const ProjectService = new projectService();
export default ProjectService;
