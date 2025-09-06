import React, { useState } from 'react';

interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  children?: MenuItem[];
  action?: () => void;
}

interface FigmaSidebarProps {
  width: number;
  onResize: (width: number) => void;
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  onAddElement: (element: any) => void;
}

const FigmaSidebar: React.FC<FigmaSidebarProps> = ({
  width,
  onResize,
  selectedTool,
  onToolSelect,
  onAddElement
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['layers', 'components']));
  const [isResizing, setIsResizing] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: 'layers',
      label: 'Layers',
      children: [
        { id: 'page1', label: 'Page 1' },
        { id: 'frame1', label: 'Frame 1' },
        { id: 'rectangle1', label: 'Rectangle' },
        { id: 'text1', label: 'Text Layer' }
      ]
    },
    {
      id: 'components',
      label: 'Components',
      children: [
        { id: 'buttons', label: 'Buttons', children: [
          { id: 'primary-btn', label: 'Primary Button' },
          { id: 'secondary-btn', label: 'Secondary Button' }
        ]},
        { id: 'cards', label: 'Cards' },
        { id: 'icons', label: 'Icons' }
      ]
    },
    {
      id: 'assets',
      label: 'Assets',
      children: [
        { id: 'colors', label: 'Colors' },
        { id: 'typography', label: 'Typography' },
        { id: 'effects', label: 'Effects' }
      ]
    }
  ];

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing) {
      onResize(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '6px 12px',
            paddingLeft: `${12 + level * 16}px`,
            cursor: 'pointer',
            color: '#ffffff',
            fontSize: '13px',
            backgroundColor: selectedTool === item.id ? '#0d7377' : 'transparent',
            borderRadius: '4px',
            margin: '1px 4px'
          }}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else {
              onToolSelect(item.id);
              if (item.action) item.action();
            }
          }}
        >
          {hasChildren && (
            <span style={{ 
              marginRight: '6px', 
              fontSize: '10px',
              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }}>
              ▶
            </span>
          )}
          <span>{item.label}</span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      width: `${width}px`,
      height: '100vh',
      backgroundColor: '#1e1e1e',
      borderRight: '1px solid #404040',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Sidebar Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #404040',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '600'
      }}>
        Design Studio
      </div>

      {/* Tools Section */}
      <div style={{
        padding: '12px',
        borderBottom: '1px solid #404040'
      }}>
        <div style={{
          color: '#888888',
          fontSize: '11px',
          fontWeight: '600',
          marginBottom: '8px',
          textTransform: 'uppercase'
        }}>
          Tools
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {['select', 'rectangle', 'circle', 'text', 'pen'].map(tool => (
            <button
              key={tool}
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: selectedTool === tool ? '#0d7377' : '#2c2c2c',
                border: '1px solid #404040',
                borderRadius: '4px',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => onToolSelect(tool)}
            >
              {tool[0].toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '8px 0'
      }}>
        {menuItems.map(item => renderMenuItem(item))}
      </div>

      {/* Properties Panel */}
      <div style={{
        borderTop: '1px solid #404040',
        padding: '12px',
        backgroundColor: '#1a1a1a'
      }}>
        <div style={{
          color: '#888888',
          fontSize: '11px',
          fontWeight: '600',
          marginBottom: '8px',
          textTransform: 'uppercase'
        }}>
          Properties
        </div>
        <div style={{ color: '#ffffff', fontSize: '12px' }}>
          <div style={{ marginBottom: '4px' }}>X: 0</div>
          <div style={{ marginBottom: '4px' }}>Y: 0</div>
          <div style={{ marginBottom: '4px' }}>W: 100</div>
          <div>H: 100</div>
        </div>
      </div>

      {/* Resize Handle */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '4px',
          height: '100%',
          cursor: 'col-resize',
          backgroundColor: isResizing ? '#0d7377' : 'transparent'
        }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default FigmaSidebar;
