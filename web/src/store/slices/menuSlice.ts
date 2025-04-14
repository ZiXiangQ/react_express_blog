/*
 * @Author: qiuzx
 * @Date: 2025-04-14 16:57:42
 * @LastEditors: qiuzx
 * @Description: description
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MenuState {
  selectedKeys: string[];
  openKeys: string[];
  currentPath: string;
}

const initialState: MenuState = {
  selectedKeys: [],
  openKeys: [],
  currentPath: ''
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setSelectedKeys: (state, action: PayloadAction<MenuState>) => {
      state.selectedKeys = action.payload.selectedKeys;
      state.openKeys = action.payload.openKeys;
      state.currentPath = action.payload.currentPath;
    },
    resetMenu: (state) => {
      state.selectedKeys = [];
      state.openKeys = [];
      state.currentPath = '';
    }
  }
});

export const { setSelectedKeys, resetMenu } = menuSlice.actions;

export default menuSlice.reducer; 
