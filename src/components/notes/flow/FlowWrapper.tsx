import { ReactFlowProvider } from '@xyflow/react';
import { FlowEditor } from './FlowEditor';

interface FlowWrapperProps {
  onClose: () => void;
}

export const FlowWrapper = ({ onClose }: FlowWrapperProps) => {
  return (
    <ReactFlowProvider>
      <FlowEditor onClose={onClose} />
    </ReactFlowProvider>
  );
};