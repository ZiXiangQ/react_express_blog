/*
 * @Author: qiuzx
 * @Date: 2025-02-10 08:54:30
 * @LastEditors: qiuzx
 * @Description: description
 */
import React from "react";
import { ReactFlowProvider } from "react-flow-renderer";

const LegendNode = ({ color, label }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      marginRight: "20px",
    }}
  >
    <div
      style={{
        width: "20px",
        height: "20px",
        backgroundColor: color,
        marginRight: "10px",
        borderRadius: "4px",
      }}
    ></div>
    <span>{label}</span>
  </div>
);

const LegendLine = ({ style, label }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      marginRight: "20px",
    }}
  >
    <div
      style={{
        width: "50px",
        height: "2px",
        backgroundColor: style.color || "black",
        marginRight: "10px",
        ...style,
      }}
    ></div>
    <span>{label}</span>
  </div>
);

const Legend = () => {
  const colors = [
    { color: "#42b983", label: "飞豹运行正常" },
    { color: "#e3a6a6", label: "飞豹运行异常" },
    { color: "#647587", label: "外部系统" },
    { color: "white", label: "飞豹前端" },
  ];

  const lines = [
    { style: { color: "black" }, label: "Default Line" },
    { style: { color: "dashed", border: "1px dashed black" }, label: "Dashed Line" },
    { style: { color: "red" }, label: "Red Line" },
    { style: { color: "green" }, label: "Green Line" },
  ];

  return (
    <div style={{ padding: "20px",marginLeft: "70px" }}>
      {/* 第一行 - 模块 */}
      <div style={{ display: "flex", marginBottom: "20px" }}>
        {colors.map((item, index) => (
          <LegendNode width={"30px"} key={index} color={item.color} label={item.label} />
        ))}
      </div>

      {/* 第二行 - 线条 */}
      <div style={{ display: "flex" }}>
        {lines.map((item, index) => (
          <LegendLine key={index} style={item.style} label={item.label} />
        ))}
      </div>
    </div>
  );
};

const LegendFlow = () => {
  return (
    <ReactFlowProvider>
      <Legend />
    </ReactFlowProvider>
  );
};

export default LegendFlow;
