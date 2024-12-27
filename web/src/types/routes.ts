/*
 * @Author: qiuzx
 * @Date: 2024-12-25 13:50:11
 * @LastEditors: qiuzx
 * @Description: description
 */
/**
 * @Description: 路由相关类型定义
 */
import { RoutesItemType } from "react-router-waiter"

export interface RoutesItemTypeNew extends RoutesItemType {
  url?: string;
  path?: string;
  element?: unknown;
}

export type RoutesTypeNew = RoutesItemTypeNew[];
