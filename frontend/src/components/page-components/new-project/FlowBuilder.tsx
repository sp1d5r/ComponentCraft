import React, { useState, useEffect } from 'react';
import { Card } from '../../shadcn/card';
import { Button } from '../../shadcn/button';
import { Input } from '../../shadcn/input';
import { Textarea } from '../../shadcn/textarea';
import { Eye, Trash2, Save, ArrowRight, Plus, Upload, ChevronRight, ChevronDown, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../shadcn/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../shadcn/tabs';

interface Screen {
  id: string;
  name: string;
  url: string;
}

interface FlowScreen {
  id: string;
  screenId: string;
  position?: { x: number; y: number };
}

interface FlowConnection {
  id: string;
  from: string;
  to: string;
  label?: string;
}

interface Flow {
  id: string;
  name: string;
  description?: string;
  screens: FlowScreen[];
  connections: FlowConnection[];
  startScreenId?: string;
}

interface FlowBuilderProps {
  flow: Flow;
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
  const [currentFlow, setCurrentFlow] = useState<Flow>(flow);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("screens");
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['root']));
  const [selectedScreenNode, setSelectedScreenNode] = useState<string | null>(
    flow.startScreenId || (flow.screens.length > 0 ? flow.screens[0].id : null)
  );
  const [draggedScreen, setDraggedScreen] = useState<string | null>(null);
  
  // Save changes to parent component
  const saveChanges = (updatedFlow: Flow) => {
    setCurrentFlow(updatedFlow);
    onUpdate(updatedFlow.id, updatedFlow);
  };

  // Handle name and description changes
  const handleNameChange = (name: string) => {
    const updatedFlow = { ...currentFlow, name };
    saveChanges(updatedFlow);
  };

  const handleDescriptionChange = (description: string) => {
    const updatedFlow = { ...currentFlow, description };
    saveChanges(updatedFlow);
  };

  // Toggle expand/collapse of tree paths
  const togglePathExpansion = (path: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedPaths(newExpanded);
  };

  // Add a screen to the flow
  const handleAddScreen = (screenId: string) => {
    if (!screenId) return;
    
    const newScreenNode = {
      id: `screen-${Math.random().toString(36).substr(2, 9)}`,
      screenId: screenId,
    };

    // If there's a selected screen, create a connection from it to the new screen
    let newConnections = [...currentFlow.connections];
    if (selectedScreenNode) {
      const newConnection = {
        id: `conn-${Math.random().toString(36).substr(2, 9)}`,
        from: selectedScreenNode,
        to: newScreenNode.id,
        label: 'Navigate',
      };
      newConnections = [...newConnections, newConnection];
    }

    // If this is the first screen, set it as the start screen
    const updatedFlow = {
      ...currentFlow,
      screens: [...currentFlow.screens, newScreenNode],
      connections: newConnections,
      startScreenId: currentFlow.startScreenId || (currentFlow.screens.length === 0 ? newScreenNode.id : currentFlow.startScreenId),
    };

    saveChanges(updatedFlow);
    setSelectedScreenNode(newScreenNode.id);
  };

  // Set a screen as the start screen
  const setAsStartScreen = (nodeId: string) => {
    const updatedFlow = {
      ...currentFlow,
      startScreenId: nodeId,
    };
    saveChanges(updatedFlow);
  };

  // Remove a screen from the flow
  const handleRemoveScreen = (nodeId: string) => {
    // Remove the screen
    const updatedScreens = currentFlow.screens.filter(screen => screen.id !== nodeId);
    
    // Remove connections involving this screen
    const updatedConnections = currentFlow.connections.filter(
      conn => conn.from !== nodeId && conn.to !== nodeId
    );
    
    // Update start screen if necessary
    let updatedStartScreenId = currentFlow.startScreenId;
    if (updatedStartScreenId === nodeId) {
      updatedStartScreenId = updatedScreens.length > 0 ? updatedScreens[0].id : undefined;
    }
    
    const updatedFlow = {
      ...currentFlow,
      screens: updatedScreens,
      connections: updatedConnections,
      startScreenId: updatedStartScreenId,
    };
    
    saveChanges(updatedFlow);
    
    // Update selected screen if necessary
    if (selectedScreenNode === nodeId) {
      setSelectedScreenNode(updatedScreens.length > 0 ? updatedScreens[0].id : null);
    }
  };

  // Find all screens that connect TO this screen
  const findParentScreens = (nodeId: string) => {
    return currentFlow.connections
      .filter(conn => conn.to === nodeId)
      .map(conn => {
        const screenNode = currentFlow.screens.find(s => s.id === conn.from);
        const screen = screens.find(s => screenNode && s.id === screenNode.screenId);
        return {
          nodeId: conn.from,
          screen,
          connectionId: conn.id,
        };
      })
      .filter(item => item.screen);
  };

  // Find all screens that connect FROM this screen
  const findChildScreens = (nodeId: string) => {
    return currentFlow.connections
      .filter(conn => conn.from === nodeId)
      .map(conn => {
        const screenNode = currentFlow.screens.find(s => s.id === conn.to);
        const screen = screens.find(s => screenNode && s.id === screenNode.screenId);
        return {
          nodeId: conn.to,
          screen,
          connectionId: conn.id,
        };
      })
      .filter(item => item.screen);
  };

  // Remove a connection between screens
  const handleRemoveConnection = (connectionId: string) => {
    const updatedConnections = currentFlow.connections.filter(
      conn => conn.id !== connectionId
    );
    
    const updatedFlow = {
      ...currentFlow,
      connections: updatedConnections,
    };
    
    saveChanges(updatedFlow);
  };

  // Get screen details for a node
  const getScreenDetails = (nodeId: string) => {
    const screenNode = currentFlow.screens.find(s => s.id === nodeId);
    if (!screenNode) return null;
    
    const screen = screens.find(s => s.id === screenNode.screenId);
    if (!screen) return null;
    
    return {
      nodeId,
      screen,
      isStartScreen: currentFlow.startScreenId === nodeId,
    };
  };

  // Handle drag and drop
  const handleDragStart = (screenId: string) => {
    setDraggedScreen(screenId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetNodeId?: string) => {
    e.preventDefault();
    if (!draggedScreen) return;
    
    if (targetNodeId) {
      // Add the screen and connect it to the target
      const newScreenNode = {
        id: `screen-${Math.random().toString(36).substr(2, 9)}`,
        screenId: draggedScreen,
      };
      
      const newConnection = {
        id: `conn-${Math.random().toString(36).substr(2, 9)}`,
        from: targetNodeId,
        to: newScreenNode.id,
        label: 'Navigate',
      };
      
      const updatedFlow = {
        ...currentFlow,
        screens: [...currentFlow.screens, newScreenNode],
        connections: [...currentFlow.connections, newConnection],
      };
      
      saveChanges(updatedFlow);
      setSelectedScreenNode(newScreenNode.id);
    } else {
      // Just add the screen without connections
      handleAddScreen(draggedScreen);
    }
    
    setDraggedScreen(null);
  };

  // Get node tree for visualization
  const buildFlowTree = () => {
    // Find root nodes (no incoming connections or explicitly marked as start)
    const allTargetNodes = new Set(currentFlow.connections.map(conn => conn.to));
    const rootNodes = currentFlow.screens
      .filter(screen => {
        if (currentFlow.startScreenId === screen.id) return true;
        return !allTargetNodes.has(screen.id);
      })
      .map(screen => screen.id);

    // Make sure we always have at least one root node
    const startNodes = rootNodes.length > 0 ? rootNodes : 
      (currentFlow.screens.length > 0 ? [currentFlow.screens[0].id] : []);

    return (
      <div className="flow-tree space-y-2">
        {startNodes.map(nodeId => (
          <FlowTreeNode 
            key={nodeId} 
            nodeId={nodeId} 
            level={0} 
            flow={currentFlow}
            screens={screens}
            expandedPaths={expandedPaths}
            togglePathExpansion={togglePathExpansion}
            handleRemoveScreen={handleRemoveScreen}
            handleRemoveConnection={handleRemoveConnection}
            setAsStartScreen={setAsStartScreen}
            selectedScreenNode={selectedScreenNode}
            setSelectedScreenNode={setSelectedScreenNode}
            onDrop={handleDrop}
          />
        ))}
      </div>
    );
  };

  // Component to render in the preview panel
  const PreviewPanel = () => {
    const selectedNode = getScreenDetails(selectedScreenNode || '');
    const childScreens = selectedScreenNode ? findChildScreens(selectedScreenNode) : [];
    
    if (!selectedNode) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          No screen selected or no screens in flow
        </div>
      );
    }
    
    return (
      <div className="space-y-4 h-full">
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Current Screen</div>
          <div className="font-medium">{selectedNode.screen.name}</div>
          {selectedNode.isStartScreen && (
            <div className="text-xs text-green-600 mt-1 flex items-center">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-1"></div>
              Start Screen
            </div>
          )}
        </div>
        
        <div className="border rounded-lg overflow-hidden max-h-[50vh]">
          <img 
            src={selectedNode.screen.url} 
            alt={selectedNode.screen.name} 
            className="w-full h-auto"
          />
        </div>
        
        {childScreens.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Connected Screens:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {childScreens.map(({ nodeId, screen, connectionId }) => (
                <div key={nodeId} className="border rounded p-2 flex items-center space-x-2">
                  <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                    {screen && screen.url && (
                      <img 
                        src={screen.url} 
                        alt={screen.name} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium text-sm">{screen ? screen.name : ''}</div>
                  </div>
                  <button 
                    className="text-gray-500 hover:text-red-600 transition-colors" 
                    onClick={() => handleRemoveConnection(connectionId)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex space-x-2 mt-4">
          {!selectedNode.isStartScreen && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setAsStartScreen(selectedNode.nodeId)}
            >
              Set as Start
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-600" 
            onClick={() => handleRemoveScreen(selectedNode.nodeId)}
          >
            Remove Screen
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="border border-gray-200 dark:border-neutral-800">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <Input
              value={currentFlow.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="font-medium"
              placeholder="Flow name..."
            />
            <Textarea
              value={currentFlow.description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Flow description..."
              className="text-sm h-20"
              rows={2}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(true)}
            >
              <Eye size={16} className="mr-2" />
              Preview
            </Button>
            <Button
              variant="default"
            >
              <Save size={16} className="mr-2" />
              Save
            </Button>
            {onDelete && (
              <Button
                variant="outline"
                onClick={() => onDelete(currentFlow.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="screens">Screens</TabsTrigger>
            <TabsTrigger value="flow">Flow Structure</TabsTrigger>
          </TabsList>
          
          <TabsContent value="screens" className="pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[600px]">
              {/* Available Screens Panel */}
              <div className="lg:col-span-1 border rounded-lg bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col">
                <div className="p-3 border-b bg-white dark:bg-gray-800">
                  <h3 className="text-sm font-medium">Available Screens</h3>
                </div>
                <div className="p-3 space-y-2 overflow-y-auto flex-1">
                  {availableScreens.map(screen => (
                    <div 
                      key={screen.id}
                      className="border rounded-md p-2 bg-white dark:bg-gray-800 cursor-pointer hover:border-gray-400 transition-colors"
                      onClick={() => handleAddScreen(screen.id)}
                      draggable
                      onDragStart={() => handleDragStart(screen.id)}
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

              {/* Preview Panel */}
              <div className="lg:col-span-3 border rounded-lg overflow-hidden flex flex-col">
                <div className="p-3 border-b bg-white dark:bg-gray-800">
                  <h3 className="text-sm font-medium">Screen Preview</h3>
                </div>
                <div 
                  className="p-3 overflow-y-auto flex-1"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e)}
                >
                  <PreviewPanel />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="flow" className="pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[600px]">
              {/* Flow Structure Panel */}
              <div className="lg:col-span-1 border rounded-lg bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col">
                <div className="p-3 border-b bg-white dark:bg-gray-800">
                  <h3 className="text-sm font-medium">Flow Structure</h3>
                </div>
                <div className="p-3 overflow-y-auto flex-1">
                  {currentFlow.screens.length > 0 ? buildFlowTree() : (
                    <div className="text-sm text-gray-500 dark:text-gray-400 text-center p-4">
                      No screens in flow yet. Add screens from the Screens tab.
                    </div>
                  )}
                </div>
              </div>

              {/* Preview Panel (same as in Screens tab) */}
              <div className="lg:col-span-3 border rounded-lg overflow-hidden flex flex-col">
                <div className="p-3 border-b bg-white dark:bg-gray-800">
                  <h3 className="text-sm font-medium">Screen Preview</h3>
                </div>
                <div 
                  className="p-3 overflow-y-auto flex-1"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e)}
                >
                  <PreviewPanel />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <FlowPreviewModal
          flow={currentFlow}
          screens={screens}
          onClose={() => setShowPreview(false)}
        />
      )}
    </Card>
  );
};

// Flow Tree Node component for recursive rendering
const FlowTreeNode = ({ 
  nodeId, 
  level, 
  flow, 
  screens,
  expandedPaths,
  togglePathExpansion,
  handleRemoveScreen,
  handleRemoveConnection,
  setAsStartScreen,
  selectedScreenNode,
  setSelectedScreenNode,
  onDrop,
}: {
  nodeId: string;
  level: number;
  flow: Flow;
  screens: Screen[];
  expandedPaths: Set<string>;
  togglePathExpansion: (path: string) => void;
  handleRemoveScreen: (nodeId: string) => void;
  handleRemoveConnection: (connectionId: string) => void;
  setAsStartScreen: (nodeId: string) => void;
  selectedScreenNode: string | null;
  setSelectedScreenNode: (nodeId: string | null) => void;
  onDrop: (e: React.DragEvent, targetNodeId?: string) => void;
}) => {
  const screenNode = flow.screens.find(s => s.id === nodeId);
  if (!screenNode) return null;

  const screen = screens.find(s => s.id === screenNode.screenId);
  if (!screen) return null;

  const isStartScreen = flow.startScreenId === nodeId;
  const isSelected = selectedScreenNode === nodeId;
  const path = `${nodeId}`;
  const isExpanded = expandedPaths.has(path);

  // Find children
  const childConnections = flow.connections.filter(conn => conn.from === nodeId);
  const hasChildren = childConnections.length > 0;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flow-tree-node">
      <div 
        className={`
          flex items-center p-2 rounded-md cursor-pointer
          ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'}
          ${isSelected ? 'border border-blue-200 dark:border-blue-800' : 'border border-transparent'}
        `}
        style={{ paddingLeft: `${Math.max(level * 16, 0)}px` }}
        onClick={() => setSelectedScreenNode(nodeId)}
        onDragOver={handleDragOver}
        onDrop={(e) => onDrop(e, nodeId)}
      >
        {hasChildren && (
          <button
            className="mr-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              togglePathExpansion(path);
            }}
          >
            {isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        )}
        
        {!hasChildren && <div className="w-5"></div>}
        
        <div className="w-8 h-8 rounded overflow-hidden bg-gray-100 flex-shrink-0 mr-2">
          {screen.url && (
            <img 
              src={screen.url} 
              alt={screen.name} 
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <span className="truncate text-sm flex-1">{screen.name}</span>
        
        {isStartScreen && (
          <span className="ml-1 w-2 h-2 bg-green-600 rounded-full"></span>
        )}
      </div>
      
      {isExpanded && hasChildren && (
        <div className="ml-5 pl-3 border-l border-gray-200 dark:border-gray-700">
          {childConnections.map(conn => {
            const childId = conn.to;
            return (
              <div key={childId} className="mt-1 relative">
                <FlowTreeNode
                  nodeId={childId}
                  level={level + 1}
                  flow={flow}
                  screens={screens}
                  expandedPaths={expandedPaths}
                  togglePathExpansion={togglePathExpansion}
                  handleRemoveScreen={handleRemoveScreen}
                  handleRemoveConnection={handleRemoveConnection}
                  setAsStartScreen={setAsStartScreen}
                  selectedScreenNode={selectedScreenNode}
                  setSelectedScreenNode={setSelectedScreenNode}
                  onDrop={onDrop}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Preview Modal component
const FlowPreviewModal: React.FC<{
  flow: Flow;
  screens: Screen[];
  onClose: () => void;
}> = ({ flow, screens, onClose }) => {
  // Find the start screen as the initial screen
  const [currentScreenNode, setCurrentScreenNode] = useState<string | null>(
    flow.startScreenId || (flow.screens.length > 0 ? flow.screens[0].id : null)
  );
  
  const currentScreenDetails = currentScreenNode ? 
    flow.screens.find(s => s.id === currentScreenNode) : null;
  
  const currentScreen = currentScreenDetails ? 
    screens.find(s => s.id === currentScreenDetails.screenId) : null;
  
  // Find available connections from current screen
  const availableConnections = currentScreenNode ? 
    flow.connections
      .filter(conn => conn.from === currentScreenNode)
      .map(conn => {
        const targetNode = flow.screens.find(s => s.id === conn.to);
        const targetScreen = targetNode ? 
          screens.find(s => s.id === targetNode.screenId) : null;
        
        return {
          connectionId: conn.id,
          nodeId: conn.to,
          screen: targetScreen,
          label: conn.label || 'Navigate',
        };
      })
      .filter(item => item.screen) : [];
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Preview: {flow.name}</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={18} />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {currentScreen ? (
            <>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 text-sm">
                <span className="font-medium">Current Screen:</span> {currentScreen.name}
              </div>
              
              <div className="border rounded-lg overflow-hidden max-h-[60vh]">
                <img 
                  src={currentScreen.url} 
                  alt={currentScreen.name}
                  className="w-full h-auto"
                />
              </div>
              
              {availableConnections.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Navigation Options:</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableConnections.map(conn => (
                      <Button 
                        key={conn.connectionId}
                        variant="outline" 
                        size="sm"
                        onClick={() => setCurrentScreenNode(conn.nodeId)}
                        className="flex items-center"
                      >
                        {conn.label} {conn.screen?.name}
                        <ArrowRight size={14} className="ml-1" />
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  This is the end of the flow. No further navigation options available.
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No screens available in this flow.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};