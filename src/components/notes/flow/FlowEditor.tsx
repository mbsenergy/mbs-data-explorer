import { useState, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  Connection,
  Edge,
  MarkerType,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toPng } from 'html-to-image';
import { FlowControls } from './FlowControls';
import { NodeEditor } from './NodeEditor';
import { CustomNode, NodeData } from './types';

const initialNodes: CustomNode[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start Here' },
    position: { x: 250, y: 25 },
  },
];

const initialEdges: Edge[] = [];

const imageWidth = 1024;
const imageHeight = 768;

interface FlowEditorProps {
  onClose: () => void;
}

export const FlowEditor = ({ onClose }: FlowEditorProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { getNodes } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ 
      ...params, 
      markerEnd: { type: MarkerType.ArrowClosed },
      animated: true 
    }, eds)),
    [setEdges],
  );

  const addNode = useCallback((type: string) => {
    const newNode: CustomNode = {
      id: `${nodes.length + 1}`,
      data: { label: `${type} Node` },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 300,
      },
      type: type === 'Group' ? 'group' : 'default',
      style: type === 'Group' ? {
        width: 200,
        height: 200,
        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        border: '1px dashed hsl(var(--border))',
      } : undefined,
    };

    setNodes((nds) => [...nds, newNode]);
  }, [nodes.length, setNodes, isDarkMode]);

  const addAnnotation = useCallback(() => {
    const newNode: CustomNode = {
      id: `annotation-${nodes.length + 1}`,
      type: 'default',
      data: { label: 'Add your note here' },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 300,
      },
      className: 'annotation-node',
    };

    setNodes((nds) => [...nds, newNode]);
  }, [nodes.length, setNodes]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: CustomNode) => {
    setSelectedNode(node);
    setEditLabel(node.data.label);
  }, []);

  const updateNodeLabel = useCallback(() => {
    if (selectedNode && editLabel.trim()) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id
            ? { ...node, data: { ...node.data, label: editLabel } }
            : node
        )
      );
      setSelectedNode(null);
      setEditLabel('');
    }
  }, [selectedNode, editLabel, setNodes]);

  const downloadImage = useCallback(() => {
    const element = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!element) return;

    // Calculate the bounding box of all nodes
    const nodeElements = getNodes();
    const xMin = Math.min(...nodeElements.map(node => node.position.x));
    const xMax = Math.max(...nodeElements.map(node => node.position.x + (node.width || 0)));
    const yMin = Math.min(...nodeElements.map(node => node.position.y));
    const yMax = Math.max(...nodeElements.map(node => node.position.y + (node.height || 0)));

    // Calculate scale to fit content
    const padding = 50;
    const contentWidth = xMax - xMin + padding * 2;
    const contentHeight = yMax - yMin + padding * 2;
    const scale = Math.min(imageWidth / contentWidth, imageHeight / contentHeight);

    // Calculate translation to center content
    const xOffset = (imageWidth - contentWidth * scale) / 2 - xMin * scale;
    const yOffset = (imageHeight - contentHeight * scale) / 2 - yMin * scale;

    toPng(element, {
      backgroundColor: isDarkMode ? '#020817' : '#ffffff',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth.toString(),
        height: imageHeight.toString(),
        transform: `translate(${xOffset}px, ${yOffset}px) scale(${scale})`,
      },
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'flow.png';
        link.href = dataUrl;
        link.click();
      });
  }, [getNodes, isDarkMode]);

  return (
    <div className="w-full h-[80vh] bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
        deleteKeyCode="Delete"
        className={isDarkMode ? 'dark' : ''}
      >
        <FlowControls
          isDarkMode={isDarkMode}
          onThemeToggle={() => setIsDarkMode(!isDarkMode)}
          onDownload={downloadImage}
          onAddNode={addNode}
          onAddAnnotation={addAnnotation}
        />
        {selectedNode && (
          <NodeEditor
            editLabel={editLabel}
            onEditLabelChange={setEditLabel}
            onUpdateLabel={updateNodeLabel}
          />
        )}
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};