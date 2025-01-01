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
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialNodes: CustomNode[] = [
  {
    id: '1',
    type: 'input',
    data: { 
      label: 'Start Here',
      details: 'Begin your flow here',
      color: '#1EAEDB'
    },
    position: { x: 250, y: 25 },
  },
];

const initialEdges: Edge[] = [];

interface FlowEditorProps {
  onClose: () => void;
}

const imageWidth = 1024;
const imageHeight = 768;

export const FlowEditor = ({ onClose }: FlowEditorProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { getNodes } = useReactFlow();
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ 
      ...params, 
      markerEnd: { type: MarkerType.ArrowClosed },
      animated: true 
    }, eds)),
    [setEdges],
  );

  const addNode = useCallback((type: string) => {
    const colors = {
      'Default': '#1EAEDB',
      'Group': '#F97316',
      'Note': '#8B5CF6'
    };
    
    const newNode: CustomNode = {
      id: `${nodes.length + 1}`,
      data: { 
        label: `${type} Node`,
        details: 'Add your details here',
        color: colors[type as keyof typeof colors] || colors.Default
      },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 300,
      },
      type: type === 'Group' ? 'group' : 'default',
      style: {
        backgroundColor: colors[type as keyof typeof colors] || colors.Default,
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        minWidth: '150px',
        border: 'none',
      },
    };

    setNodes((nds) => [...nds, newNode]);
  }, [nodes.length, setNodes]);

  const addNote = useCallback(() => {
    const newNode: CustomNode = {
      id: `note-${nodes.length + 1}`,
      type: 'default',
      data: { 
        label: 'New Note',
        details: 'Add note details here',
        color: '#8B5CF6'
      },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 300,
      },
      style: {
        backgroundColor: '#8B5CF6',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        minWidth: '150px',
        border: 'none',
      },
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

  const saveFlow = useCallback(() => {
    // Here you would typically save to your backend
    // For now, we'll just show a success toast
    toast({
      title: "Flow saved",
      description: "Your flow has been saved successfully",
    });
  }, [toast]);

  const downloadImage = useCallback(() => {
    const element = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!element) return;

    const nodeElements = getNodes();
    const xMin = Math.min(...nodeElements.map(node => node.position.x));
    const xMax = Math.max(...nodeElements.map(node => node.position.x + (node.width || 0)));
    const yMin = Math.min(...nodeElements.map(node => node.position.y));
    const yMax = Math.max(...nodeElements.map(node => node.position.y + (node.height || 0)));

    const padding = 50;
    const contentWidth = xMax - xMin + padding * 2;
    const contentHeight = yMax - yMin + padding * 2;
    const scale = Math.min(imageWidth / contentWidth, imageHeight / contentHeight);

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

  const nodeTypes = {
    default: ({ data }: { data: NodeData }) => (
      <div className="flex flex-col gap-2">
        <div className="font-bold">{data.label}</div>
        {data.details && (
          <div className="text-sm opacity-80">{data.details}</div>
        )}
      </div>
    ),
  };

  return (
    <div className="w-full h-[80vh] bg-background relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode="Delete"
        className={isDarkMode ? 'dark' : ''}
      >
        <FlowControls
          isDarkMode={isDarkMode}
          onThemeToggle={() => setIsDarkMode(!isDarkMode)}
          onDownload={downloadImage}
          onAddNode={addNode}
          onAddNote={addNote}
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
      <div className="absolute bottom-4 right-4">
        <Button 
          onClick={saveFlow}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Save Flow
        </Button>
      </div>
    </div>
  );
};