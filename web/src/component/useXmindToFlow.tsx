import { useMemo } from 'react';
import { Node, Edge } from 'reactflow';

type Topic = {
  title: string;
  topics?: Topic[];
};

export const useXMindToFlow = (contentData: Topic | null) => {
  // 递归处理 XMind 数据，将其转换为 React Flow 节点和边
  const { nodes, edges } = useMemo(() => {
    const nodesList: Node[] = [];
    const edgesList: Edge[] = [];
    let nodeId = 0;

    const processTopic = (topic: Topic, parentId: string | null = null) => {
      const currentNodeId = `node-${nodeId++}`;
      const node: Node = {
        id: currentNodeId,
        data: { label: topic.title },
        position: { x: Math.random() * 500, y: Math.random() * 500 }, // 这里可以调整节点的显示位置
      };
      nodesList.push(node);

      if (parentId) {
        const edge: Edge = {
          id: `edge-${parentId}-${currentNodeId}`,
          source: parentId,
          target: currentNodeId,
        };
        edgesList.push(edge);
      }

      // 如果有子主题，递归处理
      if (topic.topics) {
        topic.topics.forEach(subTopic => processTopic(subTopic, currentNodeId));
      }
    };

    if (contentData) {
      processTopic(contentData);
    }

    return { nodes: nodesList, edges: edgesList };
  }, [contentData]);

  return { nodes, edges };
};

export default useXMindToFlow;
