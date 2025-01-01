import { Node as FlowNode } from '@xyflow/react';

export interface NodeData extends Record<string, unknown> {
  label: string;
}

export type CustomNode = FlowNode<NodeData>;