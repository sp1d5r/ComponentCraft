import React from 'react';
import { Handle, Position } from 'reactflow';
import { Card } from '../../shadcn/card';
import { Trash2, Flag, HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../../shadcn/popover';

interface ScreenNodeProps {
  data: {
    screen: {
      id: string;
      name: string;
      url: string;
    };
    onDelete?: () => void;
    isStartScreen?: boolean;
    setAsStartScreen?: () => void;
  };
  isConnectable: boolean;
}

export const ScreenNode: React.FC<ScreenNodeProps> = ({ data, isConnectable }) => {
  const { screen, onDelete, isStartScreen, setAsStartScreen } = data;
  
  return (
    <Card className="p-3 min-w-[200px] max-w-[300px] shadow-md border border-gray-200 dark:border-gray-700">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
      
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium truncate flex items-center">
          {isStartScreen && (
            <Popover>
              <PopoverTrigger asChild>
                <span className="cursor-help">
                  <Flag size={14} className="mr-1 text-green-500" />
                </span>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2 text-xs">
                <p>This is the start screen of the flow</p>
              </PopoverContent>
            </Popover>
          )}
          {screen?.name || 'Untitled Screen'}
        </div>
        <div className="flex gap-1">
          {setAsStartScreen && !isStartScreen && (
            <Popover>
              <PopoverTrigger asChild>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setAsStartScreen();
                  }}
                  className="text-gray-500 hover:text-green-500 transition-colors"
                >
                  <Flag size={14} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2 text-xs">
                <p>Set as start screen</p>
              </PopoverContent>
            </Popover>
          )}
          {onDelete && (
            <Popover>
              <PopoverTrigger asChild>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  title="Delete screen"
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2 text-xs">
                <p>Delete this screen</p>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      
      {screen?.url && (
        <div className="w-full h-32 overflow-hidden rounded-md mb-2">
          <img 
            src={screen.url} 
            alt={screen.name || 'Screen preview'} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
    </Card>
  );
}; 