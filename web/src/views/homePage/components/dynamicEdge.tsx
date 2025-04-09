import React from "react";
import { getBezierPath, EdgeProps } from "reactflow";
import "./DynamicEdge.less";

interface DynamicEdgeProps extends EdgeProps {
  color?: string; // 动态设置颜色
  arrowDirection?: "start" | "end" | "both"; // 箭头出现在起点、终点或两端
}

const DynamicEdge: React.FC<DynamicEdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
  data,
}) => {
  const color = data?.color || "red"; // 默认红色
  const arrowDirection = data?.arrowDirection || "end"; // 箭头方向：默认终点
  const hasCustomColor = !!data?.color; // 是否有自定义颜色
  const offsetY = data?.offsetY; // 垂直偏移量
  const defaultEdgePath = getBezierPath({ sourceX, sourceY, targetX, targetY });

  // 自定义路径
  const customEdgePath =
    id === "e9-7-1" || id === "e9-6-1" || id === "e9-8-1" || id === "e9-10-1"
      ? `
      M ${sourceX} ${sourceY} 
      L ${sourceX} ${sourceY + offsetY} 
      L ${targetX} ${sourceY + offsetY} 
      L ${targetX} ${targetY}
    `
      : `
      M ${sourceX} ${sourceY} 
      H ${sourceX - 15} 
      V ${targetY} 
      H ${targetX}
    `;

  // 根据 data 配置决定使用哪种路径
  const edgePath = data?.customPath ? customEdgePath : defaultEdgePath;

  return (
    <g>
      {/* 定义箭头 */}
      <defs>
        <marker
          id={`arrow-end-${id}`} // 箭头指向终点
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill={color} />
        </marker>
        <marker
          id={`arrow-start-${id}`} // 箭头指向起点
          markerWidth="6"
          markerHeight="6"
          refX="1"
          refY="3"
          orient="auto"
        >
          <path d="M6,0 L0,3 L6,6 Z" fill={color} />
        </marker>
      </defs>

      {/* 绘制线条 */}
      <path
        id={id}
        className={hasCustomColor ? "dynamic-edge" : "default-edge"} // 动态边线样式
        d={edgePath}
        style={{
          ...style,
          stroke: color,
          strokeWidth: 2,
          fill: "none",
        }}
        markerStart={
          hasCustomColor && (arrowDirection === "start" || arrowDirection === "both")
            ? `url(#arrow-start-${id})`
            : undefined
        } // 起点箭头
        markerEnd={
          hasCustomColor && (arrowDirection === "end" || arrowDirection === "both")
            ? `url(#arrow-end-${id})`
            : undefined
        } // 终点箭头
      />

      {/* 绘制红色 "×" */}
      {!hasCustomColor && (
        <foreignObject
          width={20}
          height={20}
          x={(sourceX + targetX) / 2 - 10} // 将 "×" 放在连线中间
          y={(sourceY + targetY) / 2 - 10}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "red",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            ×
          </div>
        </foreignObject>
      )}
    </g>
  );
};

export default DynamicEdge;
