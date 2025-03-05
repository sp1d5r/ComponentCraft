import React, { useState, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card } from '../../shadcn/card';
import { Button } from '../../shadcn/button';
import { Input } from '../../shadcn/input';
import { Textarea } from '../../shadcn/textarea';
import { Eye, Plus, Trash2, Save, Flag } from 'lucide-react';
import { ScreenNode } from './ScreenNode';
import { PreviewModal } from './PreviewModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../shadcn/select';
import { Popover, PopoverContent, PopoverTrigger } from '../../shadcn/popover';
import { HelpCircle } from 'lucide-react';
import { SelectArea } from './SelectArea';
import { PlusCircle } from 'lucide-react';

interface Screen {
  id: string;
  name: string;
  url: string;
}

interface FlowConnection {
  id: string;
  from: string;
  to: string;
  label?: string;
  interactionArea?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface FlowBuilderProps {
  flow: {
    id: string;
    name: string;
    description?: string;
    screens: Array<{
      id: string;
      screenId: string;
      position?: { x: number; y: number };
    }>;
    connections: FlowConnection[];
    startScreenId?: string;
  };
  screens: Screen[];
  onUpdate: (flowId: string, updatedFlow: any) => void;
  onDelete?: (flowId: string) => void;
  availableScreens?: Screen[];
}

export const FlowBuilder: React.FC<FlowBuilderProps> = ({
  flow,
  screens,
  onUpdate,
  onDelete,
  availableScreens = screens,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState<string>(screens[0]?.id || '');
  const [startScreenNode, setStartScreenNode] = useState<string | null>(null);
  const [selectingArea, setSelectingArea] = useState<string | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState<string | null>(null);
  
  // Convert flow screens to ReactFlow nodes
  const initialNodes: Node[] = flow.screens.map((screen) => ({
    id: screen.id,
    type: 'screenNode',
    position: screen.position || { x: 0, y: 0 },
    data: {
      screen: screens.find((s) => s.id === screen.screenId),
    },
  }));

  // Convert flow connections to ReactFlow edges
  const initialEdges: Edge[] = flow.connections.map((conn) => ({
    id: conn.id,
    source: conn.from,
    target: conn.to,
    label: conn.label,
    markerEnd: { type: MarkerType.Arrow },
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleDeleteNode = useCallback((nodeId: string) => {
    // Remove the node
    const updatedScreens = flow.screens.filter(screen => screen.id !== nodeId);
    
    // Remove any connections involving this node
    const updatedConnections = flow.connections.filter(
      conn => conn.from !== nodeId && conn.to !== nodeId
    );
    
    onUpdate(flow.id, {
      ...flow,
      screens: updatedScreens,
      connections: updatedConnections
    });
  }, [flow, onUpdate]);

  const setAsStartScreen = useCallback((nodeId: string) => {
    setStartScreenNode(nodeId);
    onUpdate(flow.id, {
      ...flow,
      startScreenId: nodeId
    });
  }, [flow, onUpdate]);

  useEffect(() => {
    const updatedNodes = flow.screens.map((screen) => {
      const screenData = screens.find((s) => s.id === screen.screenId);
      return {
        id: screen.id,
        type: 'screenNode',
        position: screen.position || { x: Math.random() * 500, y: Math.random() * 300 },
        data: {
          screen: screenData,
          label: screenData?.name || 'Untitled Screen',
          url: screenData?.url || '',
          onDelete: () => handleDeleteNode(screen.id),
          isStartScreen: startScreenNode === screen.id || flow.startScreenId === screen.id,
          setAsStartScreen: () => setAsStartScreen(screen.id)
        },
      };
    });

    const updatedEdges = flow.connections.map((conn) => ({
      id: conn.id,
      source: conn.from,
      target: conn.to,
      label: conn.label,
      markerEnd: { type: MarkerType.Arrow },
    }));

    setNodes(updatedNodes);
    setEdges(updatedEdges);
  }, [flow, screens, setNodes, setEdges, handleDeleteNode, startScreenNode, setAsStartScreen]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdgeId = `edge-${Math.random().toString(36).substr(2, 9)}`;
      const newEdge = {
        ...params,
        id: newEdgeId,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#999' },
        markerEnd: {
          type: MarkerType.Arrow,
          width: 20,
          height: 20
        }
      };

      setEdges((eds) => addEdge(newEdge, eds));
      
      const newConnection = {
        id: newEdgeId,
        from: params.source || '',
        to: params.target || '',
        label: 'Navigate'
      };

      onUpdate(flow.id, {
        ...flow,
        connections: [...flow.connections, newConnection],
      });

      if (window.confirm('Would you like to select an interaction area for this connection?')) {
        setSelectingArea(newEdgeId);
      }
    },
    [flow, onUpdate, setEdges]
  );

  const handleAreaSelected = useCallback((edgeId: string, area: { x: number, y: number, width: number, height: number }) => {
    const updatedConnections = flow.connections.map(conn => {
      if (conn.id === edgeId) {
        return {
          ...conn,
          interactionArea: area
        };
      }
      return conn;
    });

    onUpdate(flow.id, {
      ...flow,
      connections: updatedConnections
    });
    
    setSelectingArea(null);
  }, [flow, onUpdate]);

  const handleQuickAddScreen = useCallback((sourceNodeId: string) => {
    const newScreenId = `screen-${Math.random().toString(36).substr(2, 9)}`;
    const sourceNode = nodes.find(n => n.id === sourceNodeId);
    
    if (!sourceNode) return;

    const newPosition = {
      x: (sourceNode.position?.x || 0) + 250,
      y: (sourceNode.position?.y || 0)
    };

    const newScreen = {
      id: newScreenId,
      screenId: selectedScreen,
      position: newPosition
    };

    onUpdate(flow.id, {
      ...flow,
      screens: [...flow.screens, newScreen],
      connections: [...flow.connections, {
        id: `edge-${Math.random().toString(36).substr(2, 9)}`,
        from: sourceNodeId,
        to: newScreenId,
        label: 'Navigate'
      }]
    });
  }, [flow, nodes, selectedScreen, onUpdate]);

  const handleNameChange = (name: string) => {
    onUpdate(flow.id, { ...flow, name });
  };

  const handleDescriptionChange = (description: string) => {
    onUpdate(flow.id, { ...flow, description });
  };

  const onNodeDragStop = useCallback(
    (event: any, node: Node) => {
      const updatedScreens = flow.screens.map((screen) => {
        if (screen.id === node.id) {
          return {
            ...screen,
            position: node.position,
          };
        }
        return screen;
      });

      onUpdate(flow.id, {
        ...flow,
        screens: updatedScreens,
      });
    },
    [flow, onUpdate]
  );

  const handleAddScreen = (screenId = selectedScreen) => {
    if (!screenId || screens.length === 0) return;
    
    // Check if this screen is already in the flow
    if (flow.screens.some(s => s.screenId === screenId)) return;
    
    const newScreen = {
      id: `screen-${Math.random().toString(36).substr(2, 9)}`,
      screenId: screenId,
      position: { 
        x: Math.random() * 300 + 50, 
        y: Math.random() * 300 + 50 
      }
    };

    onUpdate(flow.id, {
      ...flow,
      screens: [...flow.screens, newScreen]
    });
  };

  const handleEdgeDelete = useCallback((edgeId: string) => {
    const updatedConnections = flow.connections.filter(conn => conn.id !== edgeId);
    
    onUpdate(flow.id, {
      ...flow,
      connections: updatedConnections
    });
  }, [flow, onUpdate]);

  // Listen for edge removal
  useEffect(() => {
    const onEdgeDelete = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selectedEdges = edges.filter(edge => edge.selected);
        if (selectedEdges.length > 0) {
          selectedEdges.forEach(edge => {
            handleEdgeDelete(edge.id);
          });
        }
      }
    };

    document.addEventListener('keydown', onEdgeDelete);
    return () => {
      document.removeEventListener('keydown', onEdgeDelete);
    };
  }, [edges, handleEdgeDelete]);

  // Move nodeTypes inside component to access handleQuickAddScreen
  const nodeTypes = useMemo(() => ({
    screenNode: (props: any) => (
      <div className="relative">
        <ScreenNode {...props} />
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-8 top-1/2 transform -translate-y-1/2"
          onClick={() => handleQuickAddScreen(props.id)}
        >
          <PlusCircle size={20} />
        </Button>
      </div>
    ),
  }), [handleQuickAddScreen]);

  return (
    <Card className="border border-gray-200 dark:border-neutral-800">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <Input
              value={flow.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="font-medium"
              placeholder="Flow name..."
            />
            <Textarea
              value={flow.description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Flow description..."
              className="text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => setShowPreview(true)}
            >
              <Eye size={16} className="mr-2" />
              Preview
            </Button>
            {onDelete && (
              <Button
                variant="outline"
                onClick={() => onDelete(flow.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 size={16} className="mr-2" />
                Delete Flow
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Available Screens Panel */}
          <div className="lg:col-span-1 border rounded-lg p-3 bg-gray-50 dark:bg-gray-900">
            <h3 className="text-sm font-medium mb-3">Available Screens</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {availableScreens.map(screen => (
                <div 
                  key={screen.id}
                  className="border rounded-md p-2 bg-white dark:bg-gray-800 cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => {
                    // Check if screen is already in the flow
                    if (!flow.screens.some(s => s.screenId === screen.id)) {
                      handleAddScreen(screen.id);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                      {screen.url && (
                        <img 
                          src={screen.url} 
                          alt={screen.name} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="truncate text-sm">{screen.name}</span>
                  </div>
                </div>
              ))}
              {availableScreens.length === 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400 text-center p-4">
                  No screens available
                </div>
              )}
            </div>
          </div>

          {/* Flow Builder */}
          <div className="lg:col-span-3 h-[500px] border rounded-lg">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeDragStop={onNodeDragStop}
              nodeTypes={nodeTypes}
              fitView
              deleteKeyCode={['Delete', 'Backspace']}
            >
              <Background />
              <Controls />
              <Panel position="top-right" className="bg-white dark:bg-gray-800 p-2 rounded shadow-md">
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">Flow Builder Help</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <HelpCircle size={14} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-3">
                        <div className="space-y-2">
                          <h4 className="font-medium">Icon Legend</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <Flag size={14} className="text-green-500" />
                              <span>Start screen</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Flag size={14} className="text-gray-500" />
                              <span>Set as start screen</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Trash2 size={14} className="text-gray-500" />
                              <span>Delete screen</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Plus size={14} className="text-gray-500" />
                              <span>Add screen</span>
                            </div>
                          </div>
                          <h4 className="font-medium mt-2">Keyboard Shortcuts</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Delete</kbd>
                              <span>Remove selected connection</span>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <p>• Click screens from the left to add them</p>
                  <p>• Drag to connect screens</p>
                  <p>• <Flag size={14} className="inline text-green-500" /> indicates start screen</p>
                  <p>• Delete key removes connections</p>
                  <p>• Drag screens to reposition</p>
                </div>
              </Panel>
            </ReactFlow>
          </div>
        </div>
      </div>

      {showPreview && (
        <PreviewModal
          flow={{
            ...flow,
            startScreenId: startScreenNode || flow.startScreenId
          }}
          screens={screens}
          onClose={() => setShowPreview(false)}
        />
      )}

      {selectingArea && (
        <SelectArea
          edgeId={selectingArea}
          onAreaSelected={handleAreaSelected}
          onCancel={() => setSelectingArea(null)}
        />
      )}
    </Card>
  );
}; 