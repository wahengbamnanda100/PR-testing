import React, { useRef, useState, useCallback, useEffect } from 'react';

interface CanvasElement {
  id: number;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  text?: string;
}

interface ZoomablePanCanvasProps {
  selectedTool: string;
  elements: CanvasElement[];
  onElementsChange: (elements: CanvasElement[]) => void;
}

const ZoomablePanCanvas: React.FC<ZoomablePanCanvasProps> = ({
  selectedTool,
  elements,
  onElementsChange
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentElement, setCurrentElement] = useState<CanvasElement | null>(null);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.1, Math.min(5, prev * delta)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      // Pan mode
      setIsPanning(true);
      setStartPos({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else if (selectedTool !== 'select') {
      // Drawing mode
      setIsDrawing(true);
      setStartPos({ x, y });
      
      const newElement: CanvasElement = {
        id: Date.now(),
        type: selectedTool,
        x,
        y,
        width: 0,
        height: 0,
        color: '#0d7377'
      };
      
      if (selectedTool === 'text') {
        newElement.text = 'Text';
        newElement.width = 50;
        newElement.height = 20;
      }
      
      setCurrentElement(newElement);
    }
  }, [selectedTool, zoom, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y
      });
    } else if (isDrawing && currentElement) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;

      if (selectedTool !== 'text') {
        setCurrentElement({
          ...currentElement,
          width: Math.abs(x - startPos.x),
          height: Math.abs(y - startPos.y),
          x: Math.min(startPos.x, x),
          y: Math.min(startPos.y, y)
        });
      }
    }
  }, [isPanning, isDrawing, currentElement, selectedTool, zoom, pan, startPos]);

  const handleMouseUp = useCallback(() => {
    if (isDrawing && currentElement) {
      if (currentElement.width > 5 || currentElement.height > 5 || selectedTool === 'text') {
        onElementsChange([...elements, currentElement]);
      }
      setCurrentElement(null);
    }
    setIsPanning(false);
    setIsDrawing(false);
  }, [isDrawing, currentElement, elements, onElementsChange, selectedTool]);

  const renderElement = (element: CanvasElement) => {
    const style: React.CSSProperties = {
      position: 'absolute',
      left: `${element.x}px`,
      top: `${element.y}px`,
      width: `${element.width}px`,
      height: `${element.height}px`,
      backgroundColor: element.color,
      border: '1px solid #666',
      pointerEvents: selectedTool === 'select' ? 'auto' : 'none'
    };

    switch (element.type) {
      case 'rectangle':
        return <div key={element.id} style={style} />;
      case 'circle':
        return <div key={element.id} style={{...style, borderRadius: '50%'}} />;
      case 'text':
        return (
          <div
            key={element.id}
            style={{
              ...style,
              backgroundColor: 'transparent',
              color: element.color,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: selectedTool === 'select' ? '1px dashed #666' : 'none'
            }}
          >
            {element.text}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#2c2c2c'
    }}>
      {/* Zoom Controls */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 100,
        display: 'flex',
        gap: '8px',
        backgroundColor: '#1e1e1e',
        padding: '8px',
        borderRadius: '6px',
        border: '1px solid #404040'
      }}>
        <button
          style={{
            background: 'none',
            border: '1px solid #404040',
            color: '#ffffff',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
          onClick={() => setZoom(prev => Math.max(0.1, prev * 0.8))}
        >
          -
        </button>
        <span style={{ color: '#ffffff', fontSize: '12px', minWidth: '40px', textAlign: 'center' }}>
          {Math.round(zoom * 100)}%
        </span>
        <button
          style={{
            background: 'none',
            border: '1px solid #404040',
            color: '#ffffff',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
          onClick={() => setZoom(prev => Math.min(5, prev * 1.25))}
        >
          +
        </button>
        <button
          style={{
            background: 'none',
            border: '1px solid #404040',
            color: '#ffffff',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
        >
          Reset
        </button>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: isPanning ? 'grabbing' : selectedTool === 'select' ? 'default' : 'crosshair',
          position: 'relative'
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Grid */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
            opacity: zoom > 0.5 ? 1 : 0
          }}
        />

        {/* Canvas Content */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          {/* Existing Elements */}
          {elements.map(renderElement)}
          
          {/* Current Drawing Element */}
          {currentElement && renderElement(currentElement)}
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        backgroundColor: '#1e1e1e',
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid #404040',
        color: '#888888',
        fontSize: '11px'
      }}>
        Scroll to zoom • Alt+drag to pan • Middle click to pan
      </div>
    </div>
  );
};

export default ZoomablePanCanvas;
