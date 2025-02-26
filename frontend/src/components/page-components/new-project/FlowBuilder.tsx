import React, { useState } from 'react';
import { Card } from '../../shadcn/card';
import { Button } from '../../shadcn/button';
import { Input } from '../../shadcn/input';
import { Textarea } from '../../shadcn/textarea';
import { X, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { ScreenFlow, ScreenNode } from 'shared';

interface Screen {
  id: string;
  name: string;
  url: string;
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
    connections: Array<{
      id: string;
      from: string;
      to: string;
      label?: string;
    }>;
  };
  screens: Screen[];
  onUpdate: (flowId: string, updatedFlow: any) => void;
  onDelete: (flowId: string) => void;
}

export const FlowBuilder: React.FC<FlowBuilderProps> = ({
  flow,
  screens,
  onUpdate,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleNameChange = (name: string) => {
    onUpdate(flow.id, { ...flow, name });
  };

  const handleDescriptionChange = (description: string) => {
    onUpdate(flow.id, { ...flow, description });
  };

  const removeScreen = (screenId: string) => {
    onUpdate(flow.id, {
      ...flow,
      screens: flow.screens.filter(s => s.id !== screenId),
    });
  };

  return (
    <Card className="border border-gray-200 dark:border-neutral-800">
      <div className="p-4">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          
          <div className="flex-1 space-y-2">
            <Input
              value={flow.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="font-medium"
            />
            {isExpanded && (
              <Textarea
                value={flow.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="Flow description..."
                className="text-sm"
              />
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(flow.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {isExpanded && flow.screens.length > 0 && (
          <div className="mt-4 space-y-2">
            {flow.screens.map((screenNode, index) => {
              const screen = screens.find(s => s.id === screenNode.screenId);
              if (!screen) return null;

              return (
                <div
                  key={screenNode.id}
                  className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-neutral-900 rounded-lg"
                >
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                  <div className="h-8 w-8 bg-gray-100 dark:bg-neutral-800 rounded overflow-hidden">
                    <img
                      src={screen.url}
                      alt={screen.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="flex-1 text-sm">{screen.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeScreen(screenNode.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}; 