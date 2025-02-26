// Design System Types
export interface DesignTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  components: DesignComponent[];
  styles: DesignTokens;
}

export interface DesignComponent {
  id: string;
  name: string;
  type: ComponentType;
  variants: ComponentVariant[];
  properties: ComponentProperty[];
  preview: string;
}

export interface ComponentVariant {
  id: string;
  name: string;
  properties: Record<string, any>;
  preview: string;
}

export interface ComponentProperty {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'color' | 'size' | 'spacing';
  default: any;
}

export interface DesignTokens {
  colors: ColorToken[];
  typography: TypographyToken[];
  spacing: SpacingToken[];
  borderRadius: string[];
  shadows: string[];
}

export interface ColorToken {
  name: string;
  value: string;
  usage: string[];
}

export interface TypographyToken {
  name: string;
  size: string;
  weight: number;
  lineHeight: string;
  letterSpacing: string;
}

export interface SpacingToken {
  name: string;
  value: string;
}

// Project Flow Types
export interface ScreenFlow {
  id: string;
  name: string;
  description?: string;
  screens: ScreenNode[];
  connections: ScreenConnection[];
}

export interface ScreenNode {
  id: string;
  screenId: string;
  position: { x: number; y: number };
}

export interface ScreenConnection {
  id: string;
  from: string;
  to: string;
  label?: string;
}

// Component Detection Types
export interface DetectedComponent {
  id: string;
  name: string;
  type: ComponentType;
  boundingBox: BoundingBox;
  confidence: number;
  screenId: string;
  preview: string;
  similarComponents?: DetectedComponent[];
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ComponentType = 
  | 'button'
  | 'input'
  | 'card'
  | 'navigation'
  | 'header'
  | 'footer'
  | 'modal'
  | 'form'
  | 'list'
  | 'table'
  | 'menu'
  | 'tab'
  | 'dropdown'
  | 'toggle'
  | 'avatar'
  | 'badge'
  | 'alert'
  | 'tooltip'
  | 'progress'
  | 'custom'; 