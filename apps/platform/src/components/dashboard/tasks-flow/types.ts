export interface CursorPresenceData {
  x: number;
  y: number;
  name: string;
  color: string;
  emoji: string;
}

export interface ContextMenuState {
  x: number;
  y: number;
  nodeId?: string;
  edgeId?: string;
}
