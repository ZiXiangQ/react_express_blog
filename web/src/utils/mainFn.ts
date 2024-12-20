/*
 * @Description:
 * @Author: qiuzx
 * @Date: 2023-04-04 10:55:42
 * @LastEditTime: 2023-04-04 10:55:42
 * @LastEditors: qiuzx
 * Copyright 2018 CFFEX.  All rights reserved.
 */
/**
 * @Description: 存放公共函数
 */

export default function setCookie(name: string, value: string) {
    const date = new Date();
    date.setDate(date.getDate());
    document.cookie =
    name + "=" + value + ";expires=" + date + ";path = /datafeed_service/";
}
