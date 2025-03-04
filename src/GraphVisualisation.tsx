import {  useEffect, useCallback, useLayoutEffect } from "react";
import { ReactFlow, Background, useNodesState, useEdgesState, Panel, ReactFlowProvider } from '@xyflow/react';
import ELK from 'elkjs/lib/elk.bundled.js';
import '@xyflow/react/dist/style.css';
import { fetchGraphData, fetchSubtopics } from "./services/graphService";

const elk = new ELK();
const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.layered.spacing.nodeNodeBetweenLayers': '100',
  'elk.spacing.nodeNode': '80'
};

const GraphVisualization = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onLayout = useCallback(
    ({ direction }: { direction: any}) => {
      const opts = { 'elk.direction': direction, ...elkOptions };
      getLayoutedElements(nodes, edges, opts).then((result) => {
        if (result) {
          const { nodes: layoutedNodes, edges: layoutedEdges } = result;
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);
         }
      });
    },
    [nodes, edges],
  );
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchGraphData();
        const { nodes, edges } = transformGraphData(data);
        setNodes(nodes);
        setEdges(edges);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };

    fetchData();
  }, []);

  const position = { x: 0, y: 0 };


  const transformGraphData = (data: any) => {
    const transformedNodes = data.nodes
    .filter((node: any) => node.type === "topic")
    .map((node: any) => ({
      id: node.title,
      data: { label: node.title, type: node.type },
      position: position

    }));

    const transformedEdges = data.edges
    .filter((edge: any) => edge.similarity !== null)
    .map((edge: any) => ({
      id: `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      type: "smoothstep",
      animated: true,
    }));

    return { nodes: transformedNodes, edges: transformedEdges };
  };


  const getLayoutedElements = (nodes: any, edges: any, options: any = {}) => {
    const isHorizontal = options?.['elk.direction'] === 'RIGHT';
    const graph = {
      id: 'root',
      layoutOptions: options,
      children: nodes.map((node: any) => ({
        ...node,

        targetPosition: isHorizontal ? 'left' : 'top',
        sourcePosition: isHorizontal ? 'right' : 'bottom',
   
        width: 170,
        height: 50,
      })),
      edges: edges,
    };
    return elk
    .layout(graph)
    .then((layoutedGraph: any) => ({
      nodes: layoutedGraph.children.map((node: any) => ({
        ...node,
        position: { x: node.x, y: node.y },
      })),
 
      edges: layoutedGraph.edges,
    }))
    .catch(console.error);
};

useLayoutEffect(() => {
  onLayout({ direction: 'DOWN'});
}, []);

const onNodeClick = useCallback(async (_: any, node: any) => {
  const topic = node.data.label;
  console.log("Clicked topic:", topic);

  const subtopics = await fetchSubtopics(topic);

  if (subtopics.length === 0) return;

  // Generate new nodes for subtopics
  const newNodes = subtopics.map((sub: any, _:any) => ({
    id: sub,
    data: { label: sub },
    position: position
  }));

  // Generate edges from parent node to subtopics
  const newEdges = subtopics.map((sub: any, _:any) => ({
    id: `${node.id}-${sub}`,
    source: node.id,
    target: sub
  }));

  setNodes((prevNodes: any) => [...prevNodes, ...newNodes]);
  setEdges((prevEdges: any) => [...prevEdges, ...newEdges]);
}, []);

  return (
    <div style={{ height: "100vh", width: `100%` }}>
<ReactFlowProvider>
      <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      fitView
      style={{ backgroundColor: "#F7F9FB" }}
    >
      <Panel position="top-right">
        <button onClick={() => onLayout({ direction: 'DOWN' })}>
          vertical layout
        </button>
 
        <button onClick={() => onLayout({ direction: 'RIGHT' })}>
          horizontal layout
        </button>
      </Panel>
      <Background />
    </ReactFlow>
    </ReactFlowProvider>
    </div>
  );
};

export default GraphVisualization;
