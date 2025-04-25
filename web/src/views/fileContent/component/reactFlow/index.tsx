import { useXMindToFlow } from '@/component/useXmindtoFlow';
import React from 'react';
import ReactFlow from 'reactflow';

type Topic = {
  title: string;
  topics?: Topic[];
};

type ReactFlowComponentProps = {
  contentData: Topic | null; // 接受一个 contentData prop
};

const ReactFlowComponent: React.FC<ReactFlowComponentProps> = ({ contentData }) => {
  const rootTopic = contentData?.topics?.[0] ?? null;
  const { nodes, edges } = useXMindToFlow(rootTopic); // 使用 Hook 获取 React Flow 数据
  console.log(nodes, edges);
  return (
    <div style={{ height: 500 }}>
      <ReactFlow nodes={nodes} edges={edges} />
    </div>
  );
};

export default ReactFlowComponent;
