import React from "react";
import ReactECharts from "echarts-for-react";

const LineChart = () => {
    // 配置项
    const options = {
        title: {
            text: "折线图示例",
        },
        tooltip: {
            trigger: "axis", // 提示框，按轴触发
        },
        xAxis: {
            type: "category", // X轴类型，类目轴
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"], // X轴数据
        },
        yAxis: {
            type: "value", // Y轴类型，数值轴
        },
        series: [
            {
                name: "销量", // 图例名称
                type: "line", // 折线图
                data: [150, 230, 224, 218, 135, 147, 260], // 数据
                smooth: true, // 平滑曲线
            },
        ],
        legend: {
            data: ["销量"], // 图例显示
        },
    };

    return (
        <div>
            <h2>React 折线图</h2>
            <ReactECharts option={options} style={{ height: "400px", width: "100%" }} />
        </div>
    );
};

export default LineChart;
