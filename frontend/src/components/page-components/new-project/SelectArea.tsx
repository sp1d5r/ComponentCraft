import React, { useState, useCallback } from 'react';

interface SelectAreaProps {
  edgeId: string;
  onAreaSelected: (edgeId: string, area: { x: number; y: number; width: number; height: number }) => void;
  onCancel: () => void;
}

export const SelectArea: React.FC<SelectAreaProps> = ({ edgeId, onAreaSelected, onCancel }) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsSelecting(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPos({ x, y });
    setCurrentPos({ x, y });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isSelecting) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentPos({ x, y });
  }, [isSelecting]);

  const handleMouseUp = useCallback(() => {
    if (!isSelecting) return;
    
    setIsSelecting(false);
    
    const area = {
      x: Math.min(startPos.x, currentPos.x),
      y: Math.min(startPos.y, currentPos.y),
      width: Math.abs(currentPos.x - startPos.x),
      height: Math.abs(currentPos.y - startPos.y)
    };
    
    onAreaSelected(edgeId, area);
  }, [edgeId, isSelecting, startPos, currentPos, onAreaSelected]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded">
        Click and drag to select interaction area
        <button className="ml-4 text-red-500" onClick={onCancel}>Cancel</button>
      </div>
      {isSelecting && (
        <div
          className="absolute border-2 border-blue-500 bg-blue-200 bg-opacity-20"
          style={{
            left: Math.min(startPos.x, currentPos.x),
            top: Math.min(startPos.y, currentPos.y),
            width: Math.abs(currentPos.x - startPos.x),
            height: Math.abs(currentPos.y - startPos.y)
          }}
        />
      )}
    </div>
  );
}; 