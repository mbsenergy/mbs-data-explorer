import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface FlowEditorProps {
  onClose: () => void;
}

export const FlowEditor = ({ onClose }: FlowEditorProps) => {
  return (
    <div style={{ width: '100%', height: '80vh' }}>
      <ReactFlow>
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};