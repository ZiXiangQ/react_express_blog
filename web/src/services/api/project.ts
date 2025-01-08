import HttpClient from "@/services/httpClient";
import { projectList } from "@/types/project";

class projectService {

  get_all_projects() {  //获取所有项目
    const api = '/file_handle/project';
    return HttpClient.get<projectList>(api)
  }

}
const ProjectService = new projectService();
export default ProjectService;
