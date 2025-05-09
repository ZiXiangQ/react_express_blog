/*
 * @Author: qiuzx
 * @Date: 2025-05-08 15:02:19
 * @LastEditors: qiuzx
 * @Description: useProject
 */
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { projectItem } from '@/types/project';
import { setProjects } from '@/store/slices/projectSlice';

export const useProjects = () => {
  const projects = useSelector((state: RootState) => state.projects.projects);
  const dispatch: AppDispatch = useDispatch();

  const updateProjects = useCallback((items: projectItem[]) => {
    dispatch(setProjects(items));
  }, [dispatch]);

  const addProject = useCallback((project: projectItem) => {
    const newProjects = [...projects, project];
    dispatch(setProjects(newProjects));
  }, [projects, dispatch]);

  const removeProject = useCallback((projectId: number) => {
    const newProjects = projects.filter(project => project.id !== projectId);
    dispatch(setProjects(newProjects));
  }, [projects, dispatch]);

  const updateProject = useCallback((updatedProject: projectItem) => {
    const newProjects = projects.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    );
    dispatch(setProjects(newProjects));
  }, [projects, dispatch]);

  const getProjectById = useCallback((projectId: number) => {
    return projects.find(project => project.id === projectId);
  }, [projects]);

  const cancelEdit = useCallback((id: number, originalProjects: projectItem[]) => {
    console.log(originalProjects);
    const originalProject = originalProjects.find(p => p.id === id);
    if (originalProject) {
      const updated = projects.map((project) =>
        project.id === id ? { ...originalProject, isEditing: false } : project
      );
      dispatch(setProjects(updated));
    }
  }, [projects, dispatch]);

  return {
    projects,
    updateProjects,
    addProject,
    removeProject,
    updateProject,
    getProjectById,
    cancelEdit,
  };
};
