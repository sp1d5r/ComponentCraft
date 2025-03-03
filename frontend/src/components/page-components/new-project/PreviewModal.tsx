import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../shadcn/dialog';
import { Button } from '../../shadcn/button';
import { ArrowRight, X } from 'lucide-react';

interface Screen {
  id: string;
  name: string;
  url: string;
}

interface PreviewModalProps {
  flow: {
    id: string;
    name: string;
    screens: Array<{
      id: string;
      screenId: string;
    }>;
    connections: Array<{
      id: string;
      from: string;
      to: string;
      label?: string;
    }>;
    startScreenId?: string;
  };
  screens: Screen[];
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ flow, screens, onClose }) => {
  // Find the first screen as the starting point
  const [currentScreenId, setCurrentScreenId] = useState<string | null>(null);
  const [currentScreenNode, setCurrentScreenNode] = useState<string | null>(null);
  const [availableConnections, setAvailableConnections] = useState<Array<{
    nodeId: string;
    screenId: string;
    label?: string;
  }>>([]);

  // Initialize with the first screen on mount
  useEffect(() => {
    if (flow.screens.length > 0) {
      // Use the designated start screen if available
      if (flow.startScreenId) {
        const startNode = flow.screens.find(s => s.id === flow.startScreenId);
        if (startNode) {
          setCurrentScreenNode(startNode.id);
          setCurrentScreenId(startNode.screenId);
          return;
        }
      }
      
      // Fall back to the first screen
      const startNode = flow.screens[0];
      setCurrentScreenNode(startNode.id);
      setCurrentScreenId(startNode.screenId);
    }
  }, [flow.screens, flow.startScreenId]);

  // Update available connections when current screen changes
  useEffect(() => {
    if (currentScreenNode) {
      const connections = flow.connections
        .filter(conn => conn.from === currentScreenNode)
        .map(conn => {
          const targetNode = flow.screens.find(s => s.id === conn.to);
          return {
            nodeId: conn.to,
            screenId: targetNode?.screenId || '',
            label: conn.label
          };
        })
        .filter(conn => conn.screenId); // Filter out any invalid connections
      
      setAvailableConnections(connections);
    }
  }, [currentScreenNode, flow.connections, flow.screens]);

  const handleNavigate = (nodeId: string, screenId: string) => {
    setCurrentScreenNode(nodeId);
    setCurrentScreenId(screenId);
  };

  const currentScreen = screens.find(s => s.id === currentScreenId);

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
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
                    {availableConnections.map(conn => {
                      const targetScreen = screens.find(s => s.id === conn.screenId);
                      return (
                        <Button 
                          key={conn.nodeId}
                          variant="outline" 
                          size="sm"
                          onClick={() => handleNavigate(conn.nodeId, conn.screenId)}
                          className="flex items-center"
                        >
                          {conn.label || 'Navigate to'} {targetScreen?.name}
                          <ArrowRight size={14} className="ml-1" />
                        </Button>
                      );
                    })}
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