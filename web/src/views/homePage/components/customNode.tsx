/*
 * @Author: qiuzx
 * @Date: 2025-02-06 11:07:10
 * @LastEditors: qiuzx
 * @Description: Optimized custom node rendering based on data.handles
 */
import { Handle, Position } from "react-flow-renderer"; // 引入Handle和Position



// 自定义节点组件
const CustomNode = ({ data }) => {
  // 定义所有可能的 Handle 配置
  const handlePositions = [
    { id: "input-1", position: Position.Top, style: { left: "20%" } },
    { id: "input-2", position: Position.Top, style: { left: "35%" } },
    { id: "input-3", position: Position.Top, style: { left: "50%" } },
    { id: "input-4", position: Position.Top, style: { left: "65%" } },
    { id: "input-5", position: Position.Top, style: { left: "80%" } },

    { id: "input-6", position: Position.Left, style: { top: "50%" } },
    { id: "input-7", position: Position.Right, style: { top: "50%" } },
    { id: "input-8", position: Position.Left, style: { top: "30%" } },
    { id: "input-9", position: Position.Right, style: { top: "70%" } },

    { id: "input-10", position: Position.Bottom, style: { left: "20%" } },
    { id: "input-11", position: Position.Bottom, style: { left: "35%" } },
    { id: "input-12", position: Position.Bottom, style: { left: "50%" } },
    { id: "input-13", position: Position.Bottom, style: { left: "65%" } },
    { id: "input-14", position: Position.Bottom, style: { left: "80%" } },

    { id: "output-1", position: Position.Bottom, style: { left: "20%" } },
    { id: "output-2", position: Position.Bottom, style: { left: "35%" } },
    { id: "output-3", position: Position.Bottom, style: { left: "50%" } },
    { id: "output-4", position: Position.Bottom, style: { left: "65%" } },
    { id: "output-5", position: Position.Bottom, style: { left: "80%" } },

    { id: "output-6", position: Position.Left, style: { top: "50%" } },
    { id: "output-7", position: Position.Right, style: { top: "50%" } },
    { id: "output-8", position: Position.Right, style: { top: "30%" } },
    { id: "output-9", position: Position.Left, style: { top: "70%" } },

    { id: "output-10", position: Position.Top, style: { left: "20%" } },
    { id: "output-11", position: Position.Top, style: { left: "35%" } },
    { id: "output-12", position: Position.Top, style: { left: "50%" } },
    { id: "output-13", position: Position.Top, style: { left: "65%" } },
    { id: "output-14", position: Position.Top, style: { left: "80%" } },
  ];

  return (
    <div style={{ padding: 10, position: "relative" }}>
      {/* 动态渲染 Handles */}
      {handlePositions.map(({ id, position, style }) => {
        if (data?.handles?.includes(id)) {
          const type = id.startsWith("input") ? "target" : "source";
          return <Handle key={id} type={type} position={position} id={id} style={style} />;
        }
        return null;
      })}

      {/* 渲染标签内容 */}
      <div>{data.label}</div>
    </div>
  );
};

export default CustomNode;
