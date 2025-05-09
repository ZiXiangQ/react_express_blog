/*
 * @Author: qiuzx
 * @Date: 2025-04-14 19:59:38
 * @LastEditors: qiuzx
 * @Description: description
 */
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// 使用这些预类型化的hooks而不是普通的useDispatch和useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 
