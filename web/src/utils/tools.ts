/**
 * @Description: 通用工具函数
 * @Description: （通用工具函数：即放到任何项目里都能用的）
 * @Description: （业务相关函数请放在同目录下的appTools
 * @Description: （函数请添加详细注释）
 */
import { tools } from "ut-utils"; 

const deft = {
    numToString:function(value:string) {
        if(value === "0"){
            return "否"
        }else if(value === "1")
        {
            return "是"
        }else{
            return "-"
        }
    },
    percentChange:function(value:string | number){
        if(value === ""|| value === undefined)
        {
            return ""
        }
        if(value === 1){
            return value*100+".00"
        }else if(value === 0 || value === "0"){
            return ""
        }else{
            return (Number(value)*100).toFixed(2)}
    },
    ZeroToNull:function(value:string) {
        return value !== "0"?value:""
    },
    toThousandDeciaml(value:number,num:number) {
        if(!value)
            return ""
        const res_num = tools.toDecimal(value,num)
        return tools.toThousands(Number(res_num))
    },
    stringToPercent:function(value:string){
        if(value === ""|| value === undefined)
        {
            return ""
        }
        return (Number(value)*100).toFixed(2)
    },
    PercentToString:function(value:string){
        if(value === ""|| value === undefined)
        {
            return ""
        }
        return (Number(value)/100).toFixed(2)
    }
};
 
export default {
    ...deft,
    ...tools,
};
 