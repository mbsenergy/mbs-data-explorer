import { useState, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  Panel,
  MarkerType,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Plus, Type, Box, Group, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Define the type for node data that extends Record<string, unknown>
interface NodeData extends Record<string, unknown> {
  label: string;
}

const initialNodes: Node<NodeData>[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start Here' },
    position: { x: 250, y: 25 },
  },
];

const initialEdges: Edge[] = [];

interface FlowEditorProps {
  onClose: () => void;
}

export const FlowEditor = ({ onClose }: FlowEditorProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<NodeData>>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
  const [editLabel, setEditLabel] = useState('');

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ 
      ...params, 
      markerEnd: { type: MarkerType.ArrowClosed },
      animated: true 
    }, eds)),
    [setEdges],
  );

  const addNode = useCallback((type: string) => {
    const newNode: Node<NodeData> = {
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
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '1px dashed hsl(var(--border))',
      } : undefined,
    };

    setNodes((nds) => [...nds, newNode]);
  }, [nodes.length, setNodes]);

  const addAnnotation = useCallback(() => {
    const newNode: Node<NodeData> = {
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

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node<NodeData>) => {
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
      >
        <Panel position="top-right" className="flex gap-2 bg-background/50 p-2 rounded-lg">
          <Button 
            onClick={() => addNode('Default')}
            variant="outline"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Node
          </Button>
          <Button 
            onClick={() => addNode('Group')}
            variant="outline"
            className="gap-2"
          >
            <Group className="h-4 w-4" />
            Add Group
          </Button>
          <Button 
            onClick={addAnnotation}
            variant="outline"
            className="gap-2"
          >
            <Type className="h-4 w-4" />
            Add Note
          </Button>
        </Panel>
        {selectedNode && (
          <Panel position="top-left" className="flex gap-2 bg-background/50 p-2 rounded-lg">
            <Input
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              placeholder="Node label"
              className="w-48"
            />
            <Button 
              onClick={updateNodeLabel}
              variant="outline"
              className="gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Update
            </Button>
          </Panel>
        )}
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};