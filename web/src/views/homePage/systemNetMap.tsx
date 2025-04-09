/*
 * @Author: qiuzx
 * @Date: 2025-01-20 14:54:23
 * @LastEditors: qiuzx
 * @Description: description
 */
import React, { useEffect } from "react";
import ReactFlow, { Controls, Background, ReactFlowProvider, useReactFlow } from "react-flow-renderer";
import DynamicEdge from "./components/dynamicEdge";
import DatabaseNode from "./components/databaseNode";
import CustomNode from "./components/customNode";
import LegendFlow from "./components/LegendFlow";


const edgeTypes = {
  dynamic: DynamicEdge, // 自定义 Edge 类型
};


const nodeTypes = {
  database: DatabaseNode, // 注册自定义数据库节点
  customNode: CustomNode, // 注册自定义节点类型，用于渲染自定义节点
};

// const ZoomControl = () => { //控制缩放
//   const { setViewport } = useReactFlow();
//   useEffect(() => {
//     // 设置视图缩放到 1.0，并定位到 (0, 0)
//     setViewport({ x: 0, y: 0, zoom: 1.0 });
//   }, [setViewport]);
//   return null;
// };

const initialNodes = [
  // 第一层：行情源、柜台系统
  { id: "1", data: { label: "行情源", handles: ["output-2", "output-4"] }, position: { x: 100, y: 100 }, style: { width: 240, backgroundColor: "#647587", color: "white", border: "1px solid rgb(189, 191, 190)" }, type: "customNode" },
  { id: "2", data: { label: "柜台系统", handles: ["output-2", "output-4"] }, position: { x: 380, y: 100 }, style: { width: 240, backgroundColor: "#647587", color: "white", border: "1px solid rgb(189, 191, 190)" }, type: "customNode" },
  // 第二层：行情接入、柜台接入
  { id: "3", data: { label: "行情接入", handles: ["input-2", "input-4", "output-2", "output-4", "output-6"] }, position: { x: 100, y: 200 }, style: { width: 240, backgroundColor: "#e3a6a6", color: "black", border: "1px solid rgb(192, 37, 133)" }, type: "customNode" },
  { id: "4", data: { label: "柜台接入", handles: ["input-2", "input-4", "output-2", "output-4"] }, position: { x: 380, y: 200 }, style: { width: 240, backgroundColor: "#42b983", color: "black", border: "1px solid rgb(42, 134, 93)" }, type: "customNode" },
  { id: "5", data: { label: "数据库", handles: [] }, position: { x: 660, y: 180 }, style: { width: 100, color: "black" }, type: 'database' },
  // 第三层：数据库、服务端、交易风控
  { id: "6", data: { label: "因子引擎", handles: ["input-3", "input-5", "input-12", "output-7"] }, position: { x: 100, y: 300 }, style: { width: 100, backgroundColor: "#42b983", color: "black", border: "1px solid rgb(42, 134, 93)" }, type: "customNode" },
  { id: "7", data: { label: "策略引擎", handles: ["input-3", "input-6", "input-13", "input-9", "output-3", "output-8"] }, position: { x: 240, y: 300 }, style: { width: 100, backgroundColor: "#42b983", color: "black", border: "1px solid rgb(42, 134, 93)" }, type: "customNode" },
  { id: "8", data: { label: "交易风控", handles: ["input-2", "input-4", "input-8", "input-9", "input-14", "output-2","output-4", "output-9"] }, position: { x: 380, y: 300 }, style: { width: 240, backgroundColor: "#42b983", color: "black", border: "1px solid rgb(42, 134, 93)" }, type: "customNode" },
  { id: "9", data: { label: "数据上下场", handles: ["output-1", "output-2", "output-3", "output-4"] }, position: { x: 660, y: 300 }, style: { width: 100, backgroundColor: "#42b983", color: "black", border: "1px solid rgb(42, 134, 93)" }, type: "customNode" },
  // 第四层：交易端中台、管理端中台
  { id: "10", data: { label: "交易端中台", handles: ["input-2","input-3", "input-4", "input-5", "input-6", "output-3"] }, position: { x: 100, y: 420 }, style: { width: 520, backgroundColor: "#42b983", color: "black", border: "1px solid rgb(42, 134, 93)" }, type: "customNode" },
  { id: "11", data: { label: "管理端中台", handles: ["output-3"] }, position: { x: 660, y: 420 }, style: { width: 100, backgroundColor: "#42b983", color: "black", border: "1px solid rgb(42, 134, 93)" }, type: "customNode" },
  // 第五层：交易端、管理端、前端
  { id: "12", data: { label: "交易端", handles: ["input-3"] }, position: { x: 100, y: 520 }, style: { width: 520, backgroundColor: "white", color: "black" }, type: "customNode" },
  { id: "13", data: { label: "管理端", handles: ["input-3"] }, position: { x: 660, y: 520 }, style: { width: 100, backgroundColor: "white", color: "black" }, type: "customNode" },
];

const initialEdges = [
  // 行情源 
  { id: "e1-3-1", source: "1", target: "3", sourceHandle: "output-2", targetHandle: "input-2", type: 'dynamic', data: { } },//深蓝色
  { id: "e1-3-2", source: "1", target: "3", sourceHandle: "output-4", targetHandle: "input-4", type: 'dynamic', data: { color: "#ad4e00" } },//咖啡色
  // 柜台系统 
  { id: "e2-4-1", source: "2", target: "4", sourceHandle: "output-2", targetHandle: "input-2", type: 'dynamic', data: { color: "#1677ff", arrowDirection: "start" } },//蓝色箭头
  { id: "e2-4-2", source: "2", target: "4", sourceHandle: "output-4", targetHandle: "input-4", type: 'dynamic', data: { color: "#b37feb" } },//紫色
  // 行情接入
  { id: "e3-6-1", source: "3", target: "6", sourceHandle: "output-2", targetHandle: "input-3", type: 'dynamic', data: { color: "#001d66" } },
  { id: "e3-6-2", source: "3", target: "6", sourceHandle: "output-4", targetHandle: "input-5", type: 'dynamic', data: { color: "#ad4e00" } },
  { id: "e3-7-1", source: "3", target: "7", sourceHandle: "output-4", targetHandle: "input-3", type: 'dynamic', data: { color: "#ad4e00" } },
  { id: "e3-10-1",source: "3", target: "10",sourceHandle: "output-6", targetHandle: "input-6", type: 'dynamic', data: { color: "#001d66", customPath: true }},
  //柜台接入
  { id: "e4-8-1", source: "4", target: "8", sourceHandle: "output-2", targetHandle: "input-2", type: 'dynamic', data: { color: "#1677ff", arrowDirection: "start" }},//蓝色箭头
  { id: "e4-8-2", source: "4", target: "8", sourceHandle: "output-4", targetHandle: "input-4", type: 'dynamic', data: { color: "#b37feb" } },
  // 因子引擎 
  { id: "e6-6-1", source: "6", target: "7", sourceHandle: "output-7", targetHandle: "input-6", type: 'dynamic', data: { color: "#ad4e00" } },//咖啡色箭头
  //策略引擎
  { id: "e7-7-1", source: "7", target: "10", sourceHandle: "output-3", targetHandle: "input-2", type: 'dynamic', data: { color: "#ad4e00" } },
  { id: "e7-8-1", source: "7", target: "8", sourceHandle: "output-8", targetHandle: "input-8", type: 'dynamic', data: { color: "#1677ff" } },
  //交易风控
  { id: "e8-7-1",  source: "8", target: "7", sourceHandle: "output-9", targetHandle: "input-9", type: 'dynamic', data: { color: "#b37feb" } },
  { id: "e8-8-10", source: "8", target: "10", sourceHandle: "output-4", targetHandle: "input-5", type: 'dynamic', data: { color: "#b37feb" } },
  //数据上下场
  { id: "e9-6-1", source: "9", target: "6", sourceHandle: "output-3", targetHandle: "input-12", type: 'dynamic', data: { color: "#36cfc9" , customPath: true, offsetY:35}},
  { id: "e9-7-1", source: "9", target: "7", sourceHandle: "output-2", targetHandle: "input-13", type: 'dynamic', data: { color: "#36cfc9" , customPath: true, offsetY:25,arrowDirection: "both"}},
  { id: "e9-8-1", source: "9", target: "8", sourceHandle: "output-1", targetHandle: "input-14", type: 'dynamic', data: { color: "#36cfc9" , customPath: true, offsetY:15,arrowDirection: "both"}},
  { id: "e9-10-1", source: "9", target: "10", sourceHandle: "output-4", targetHandle: "input-3", type: 'dynamic', data: { color: "#36cfc9" ,customPath: true, offsetY:45,arrowDirection: "both" } },
  //交易端中台
  { id: "e10-12-1", source: "10", target: "12", sourceHandle: "output-3", targetHandle: "input-3", type: 'dynamic', data: { color: "#000", arrowDirection: "both" } },
  { id: "e10-8-1", source: "8", target: "10", sourceHandle: "output-2", targetHandle: "input-4", type: 'dynamic', data: { color: "#1677ff", arrowDirection: "both" } },
  //管理端中台
  { id: "e11-11-1", source: "11", target: "13", sourceHandle: "output-3", targetHandle: "input-3", type: 'dynamic', data: { color: "#000", arrowDirection: "both" } },
];

const FlowDiagram = () => {
  return (
    <div style={{height: "500px",width: "790px"}}>
      <div style={{width: "100%",position: "relative"}}>
      <div
        style={{
          position: "absolute",
          height: "500px",
          top: 70,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          display: "grid",
          gridTemplateRows: "1fr 1fr 1fr 1fr",
          gridTemplateColumns: "1fr",
        }}
      >
        {/* 模块分区 */}
        <div style={{ height:"100px", backgroundColor: "rgba(255, 218, 185, 0.3)" }}>
          <span style={{ float:"left", padding: 5 }}>外部系统</span>
        </div>
        <div style={{ height:"210px", backgroundColor: "rgba(17, 200, 200, 0.3)" }}>
          <span style={{ float:"left", padding: 5 }}>飞豹服务端</span>
        </div>
        <div style={{ height:"110px", backgroundColor: "rgba(216, 191, 216, 0.3)" }}>
          <span style={{ float:"left",padding: 5 }}>飞豹中台</span>
        </div>
        <div style={{ height:"100px", backgroundColor: "rgba(240, 230, 140, 0.3)" }}>
          <span style={{ float:"left", padding: 5 }}>飞豹前端</span>
        </div>
      </div>
        <ReactFlowProvider>
          <div style={{ height: "63vh" }}>
            <ReactFlow
              nodes={initialNodes}
              nodeTypes={nodeTypes} // 注册自定义节点
              edges={initialEdges}
              edgeTypes={edgeTypes} // 注册自定义边
              nodesDraggable={false} // 禁用节点拖动
              zoomOnScroll={false} // 禁用滚轮缩放
              zoomOnPinch={false} // 禁用手势缩放
              zoomOnDoubleClick={false} // 禁用双击缩放
              panOnDrag={false} // 禁用画布拖动
              panOnScroll={false} // 禁用滚动条拖动
              fitViewOptions={{
                padding: 0.5, // 设置缩放的填充比例
                includeHiddenNodes: false,
              }}
              defaultZoom={1.0} // 设置默认缩放比例
            >
              <Controls />
              <Background style={{display:"none"}} />
            </ReactFlow>
          </div>
        </ReactFlowProvider>
        <LegendFlow/>
      </div>
    </div>
  );
};

export default FlowDiagram;
