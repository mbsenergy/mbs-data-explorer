import { Node as FlowNode } from '@xyflow/react';

export interface NodeData extends Record<string, unknown> {
  label: string;
  details?: string;
  color?: string;
}

export type CustomNode = FlowNode<NodeData>;