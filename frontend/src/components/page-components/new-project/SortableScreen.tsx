import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '../../shadcn/card';
import { Button } from '../../shadcn/button';
import { Plus } from 'lucide-react';

interface SortableScreenProps {
  screen: {
    id: string;
    name: string;
    url: string;
  };
  onClick: () => void;
}

export const SortableScreen: React.FC<SortableScreenProps> = ({ screen, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: screen.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="p-2 cursor-move hover:border-gray-400 dark:hover:border-neutral-600 transition-all">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-gray-100 dark:bg-neutral-900 rounded-md overflow-hidden flex-shrink-0">
            <img 
              src={screen.url} 
              alt={screen.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-black dark:text-white truncate">
              {screen.name}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}; 