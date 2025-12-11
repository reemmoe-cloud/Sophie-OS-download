import React, { useState, useRef, useEffect } from 'react';
import { WindowState } from '../../types';
import { Icons } from '../ui/Icons';

interface WindowFrameProps {
  window: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  children: React.ReactNode;
  icon: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  window,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  children,
  icon
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const titleBarRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (window.isMaximized) return;
    // We can directly check if the target is within the title bar, 
    // though putting the handler ON the title bar is safest.
    if (titleBarRef.current && titleBarRef.current.contains(e.target as Node)) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - window.position.x,
        y: e.clientY - window.position.y
      });
      onFocus(window.id);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        // Prevent selecting text while dragging
        e.preventDefault();
        onMove(window.id, e.clientX - dragOffset.x, e.clientY - dragOffset.y);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onMove, window.id]);

  if (!window.isOpen || window.isMinimized) return null;

  const style: React.CSSProperties = {
    zIndex: window.zIndex,
    width: window.isMaximized ? '100vw' : window.size.width,
    height: window.isMaximized ? 'calc(100vh - 48px)' : window.size.height,
    left: window.isMaximized ? 0 : window.position.x,
    top: window.isMaximized ? 0 : window.position.y,
    position: 'absolute',
    transition: isDragging ? 'none' : 'width 0.2s, height 0.2s, left 0.2s, top 0.2s',
  };

  return (
    <div
      style={style}
      className={`flex flex-col rounded-t-lg rounded-b-md shadow-2xl overflow-hidden glass-frame ${
        window.zIndex >= 50 ? 'shadow-win-active' : ''
      }`}
      onMouseDown={() => onFocus(window.id)}
    >
      {/* Title Bar */}
      <div
        ref={titleBarRef}
        className="h-8 flex items-center justify-between px-2 select-none cursor-default active:cursor-move bg-white/10"
        onMouseDown={handleMouseDown}
        onDoubleClick={() => onMaximize(window.id)}
      >
        <div className="flex items-center gap-2 text-shadow text-slate-800 font-semibold text-sm pointer-events-none">
          <div className="w-4 h-4 text-slate-700 drop-shadow-sm">{icon}</div>
          <span className="drop-shadow-sm glow">{window.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(window.id); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-6 h-5 flex items-center justify-center hover:bg-white/40 hover:shadow-inner rounded-sm transition-colors text-slate-800"
          >
            <Icons.Minimize />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMaximize(window.id); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-6 h-5 flex items-center justify-center hover:bg-white/40 hover:shadow-inner rounded-sm transition-colors text-slate-800"
          >
            <Icons.Maximize />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(window.id); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-10 h-5 flex items-center justify-center hover:bg-red-500 hover:text-white rounded-sm transition-colors shadow-inner bg-red-400/20 text-slate-800 border border-transparent hover:border-red-600/50"
          >
            <Icons.Close />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-gray-50 relative overflow-hidden flex flex-col border-t border-white/40">
        {children}
      </div>
    </div>
  );
};