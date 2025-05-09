/*
 * @Author: qiuzx
 * @Date: 2025-05-08 10:14:27
 * @LastEditors: qiuzx
 * @Description: description 
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { projectItem } from '@/types/project';

interface projectsState {
  projects: projectItem[];
}

const initialState: projectsState = {
  projects: [],
}

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<projectItem[]>) => {
      state.projects = action.payload;
    }
  }
})

export const { setProjects } = projectSlice.actions;

export default projectSlice.reducer;
