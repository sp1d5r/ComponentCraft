import React, { useState } from 'react';
import { Card } from '../../shadcn/card';
import { Button } from '../../shadcn/button';
import { Badge } from '../../shadcn/badge';
import { Check, X } from 'lucide-react';
import { DetectedComponent } from 'shared';

interface ComponentDetectionPreviewProps {
  screen: {
    id: string;
    name: string;
    url: string;
  };
  detectedComponents: DetectedComponent[];
  onComponentSelect: (component: DetectedComponent, approved: boolean) => void;
}

export const ComponentDetectionPreview: React.FC<ComponentDetectionPreviewProps> = ({
  screen,
  detectedComponents,
  onComponentSelect,
}) => {
  const [selectedComponent, setSelectedComponent] = useState<DetectedComponent | null>(null);

  const renderBoundingBox = (component: DetectedComponent) => {
    const isSelected = selectedComponent?.id === component.id;
    
    return (
      <div
        key={component.id}
        className={`absolute border-2 transition-colors cursor-pointer ${
          isSelected 
            ? 'border-black dark:border-white' 
            : 'border-transparent hover:border-gray-400 dark:hover:border-gray-600'
        }`}
        style={{
          left: `${component.boundingBox.x}%`,
          top: `${component.boundingBox.y}%`,
          width: `${component.boundingBox.width}%`,
          height: `${component.boundingBox.height}%`,
        }}
        onClick={() => setSelectedComponent(component)}
      />
    );
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img
          src={screen.url}
          alt={screen.name}
          className="w-full"
        />
        {detectedComponents.map(renderBoundingBox)}
      </div>

      {selectedComponent && (
        <div className="p-4 border-t border-gray-200 dark:border-neutral-800">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-black dark:text-white">
                {selectedComponent.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">
                  {selectedComponent.type}
                </Badge>
                <Badge variant="outline">
                  {Math.round(selectedComponent.confidence * 100)}% confidence
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onComponentSelect(selectedComponent, false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onComponentSelect(selectedComponent, true)}
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {selectedComponent.similarComponents && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Similar Components
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {selectedComponent.similarComponents.map((similar: DetectedComponent) => (
                  <div
                    key={similar.id}
                    className="aspect-square bg-gray-100 dark:bg-neutral-900 rounded-md overflow-hidden"
                  >
                    <img
                      src={similar.preview}
                      alt={similar.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}; 