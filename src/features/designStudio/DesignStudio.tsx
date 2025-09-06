import React, { useState, useRef, useCallback } from 'react';
import FigmaSidebar from './components/FigmaSidebar';
import ZoomablePanCanvas from './components/ZoomablePanCanvas';

const DesignStudio: React.FC = () => {
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [selectedTool, setSelectedTool] = useState('select');
  const [canvasElements, setCanvasElements] = useState([]);

  const handleSidebarResize = useCallback((newWidth: number) => {
    setSidebarWidth(Math.max(200, Math.min(400, newWidth)));
  }, []);

  const handleToolSelect = useCallback((tool: string) => {
    setSelectedTool(tool);
  }, []);

  const handleAddElement = useCallback((element: any) => {
    setCanvasElements(prev => [...prev, { ...element, id: Date.now() }]);
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      backgroundColor: '#1e1e1e',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Figma-like Sidebar */}
      <FigmaSidebar
        width={sidebarWidth}
        onResize={handleSidebarResize}
        selectedTool={selectedTool}
        onToolSelect={handleToolSelect}
        onAddElement={handleAddElement}
      />
      
      {/* Main Canvas Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#2c2c2c',
        position: 'relative'
      }}>
        {/* Top Toolbar */}
        <div style={{
          height: '48px',
          backgroundColor: '#1e1e1e',
          borderBottom: '1px solid #404040',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '12px'
        }}>
          <button style={{
            background: 'none',
            border: 'none',
            color: '#ffffff',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '4px',
            backgroundColor: selectedTool === 'select' ? '#0d7377' : 'transparent'
          }} onClick={() => handleToolSelect('select')}>
            Select
          </button>
          <button style={{
            background: 'none',
            border: 'none',
            color: '#ffffff',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '4px',
            backgroundColor: selectedTool === 'rectangle' ? '#0d7377' : 'transparent'
          }} onClick={() => handleToolSelect('rectangle')}>
            Rectangle
          </button>
          <button style={{
            background: 'none',
            border: 'none',
            color: '#ffffff',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '4px',
            backgroundColor: selectedTool === 'circle' ? '#0d7377' : 'transparent'
          }} onClick={() => handleToolSelect('circle')}>
            Circle
          </button>
          <button style={{
            background: 'none',
            border: 'none',
            color: '#ffffff',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '4px',
            backgroundColor: selectedTool === 'text' ? '#0d7377' : 'transparent'
          }} onClick={() => handleToolSelect('text')}>
            Text
          </button>
        </div>

        {/* Zoomable Pan Canvas */}
        <ZoomablePanCanvas
          selectedTool={selectedTool}
          elements={canvasElements}
          onElementsChange={setCanvasElements}
        />
      </div>
    </div>
  );
};

export default DesignStudio;
