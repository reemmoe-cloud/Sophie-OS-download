import React, { useState, useEffect } from 'react';
import { WindowState, AppID, AppConfig } from './types';
import { WindowFrame } from './components/os/WindowFrame';
import { MeowBrowser } from './components/apps/MeowBrowser';
import { Icons } from './components/ui/Icons';

// --- Default Background ---
// Using a calm, blue abstract background reminiscent of Win7
const WALLPAPER_URL = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop";

// --- App Registry ---
const APPS: Record<AppID, AppConfig> = {
  [AppID.EXPLORER]: {
    id: AppID.EXPLORER,
    name: "Computer",
    icon: <Icons.Computer />,
    defaultTitle: "Computer",
    defaultWidth: 800,
    defaultHeight: 600
  },
  [AppID.MEOW_BROWSER]: {
    id: AppID.MEOW_BROWSER,
    name: "Meow Browser",
    icon: <Icons.Browser />,
    defaultTitle: "Meow Browser",
    defaultWidth: 1024,
    defaultHeight: 768
  },
  [AppID.NOTEPAD]: {
    id: AppID.NOTEPAD,
    name: "Notepad",
    icon: <Icons.Notepad />,
    defaultTitle: "Notepad - Untitled",
    defaultWidth: 600,
    defaultHeight: 400
  },
  [AppID.SETTINGS]: {
    id: AppID.SETTINGS,
    name: "Control Panel",
    icon: <Icons.Settings />,
    defaultTitle: "Control Panel",
    defaultWidth: 800,
    defaultHeight: 600
  },
  [AppID.TRASH]: {
    id: AppID.TRASH,
    name: "Recycle Bin",
    icon: <Icons.Trash />,
    defaultTitle: "Recycle Bin",
    defaultWidth: 600,
    defaultHeight: 400
  }
};

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openApp = (appId: AppID) => {
    setStartMenuOpen(false);
    const config = APPS[appId];
    
    // Check if already open (single instance mode for simplicity, though multi-instance is fine usually)
    // For this demo, let's allow multiple instances
    const id = `${appId}-${Date.now()}`;
    const newWindow: WindowState = {
      id,
      appId,
      title: config.defaultTitle,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZIndex,
      position: { x: 50 + (windows.length * 20), y: 50 + (windows.length * 20) },
      size: { width: config.defaultWidth, height: config.defaultHeight }
    };

    setWindows([...windows, newWindow]);
    setActiveWindowId(id);
    setNextZIndex(nextZIndex + 1);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const focusWindow = (id: string) => {
    if (activeWindowId === id) return;
    const updatedWindows = windows.map(w => 
      w.id === id ? { ...w, zIndex: nextZIndex } : w
    );
    setWindows(updatedWindows);
    setActiveWindowId(id);
    setNextZIndex(nextZIndex + 1);
  };

  const toggleMinimize = (id: string) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
    ));
  };

  const toggleMaximize = (id: string) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
    focusWindow(id);
  };

  const moveWindow = (id: string, x: number, y: number) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, position: { x, y } } : w
    ));
  };

  const renderAppContent = (appId: AppID) => {
    switch (appId) {
      case AppID.MEOW_BROWSER:
        return <MeowBrowser />;
      case AppID.NOTEPAD:
        return <textarea className="w-full h-full resize-none p-2 outline-none font-mono text-sm" placeholder="Type here..." />;
      case AppID.EXPLORER:
        return (
          <div className="p-4 bg-white h-full">
            <div className="border-b pb-2 mb-2 flex gap-2 text-sm text-gray-600">
               <span>Computer</span> <span>▸</span> <span>Local Disk (C:)</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col items-center gap-1 group cursor-pointer">
                <div className="w-12 h-12 text-yellow-500"><Icons.Settings /></div>
                <span className="text-xs group-hover:bg-blue-100 px-1 rounded">Windows</span>
              </div>
              <div className="flex flex-col items-center gap-1 group cursor-pointer">
                <div className="w-12 h-12 text-yellow-500"><Icons.Settings /></div>
                <span className="text-xs group-hover:bg-blue-100 px-1 rounded">Program Files</span>
              </div>
              <div className="flex flex-col items-center gap-1 group cursor-pointer">
                <div className="w-12 h-12 text-yellow-500"><Icons.Settings /></div>
                <span className="text-xs group-hover:bg-blue-100 px-1 rounded">Users</span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-400">
            Application not implemented yet.
          </div>
        );
    }
  };

  return (
    <div 
      className="w-screen h-screen overflow-hidden relative select-none"
      style={{
        backgroundImage: `url(${WALLPAPER_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      onClick={() => setStartMenuOpen(false)}
    >
      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-6 z-0">
        {[AppID.EXPLORER, AppID.MEOW_BROWSER, AppID.NOTEPAD, AppID.TRASH].map(appId => (
          <div 
            key={appId}
            className="flex flex-col items-center gap-1 w-20 group cursor-pointer"
            onDoubleClick={() => openApp(appId)}
          >
            <div className="w-12 h-12 drop-shadow-lg filter transition-transform group-hover:scale-105">
              {APPS[appId].icon}
            </div>
            <span className="text-white text-xs font-medium text-shadow text-center bg-black/0 px-1 rounded group-hover:bg-blue-500/30 border border-transparent group-hover:border-blue-400/30">
              {APPS[appId].name}
            </span>
          </div>
        ))}
      </div>

      {/* Windows */}
      {windows.map(window => (
        <WindowFrame
          key={window.id}
          window={window}
          icon={APPS[window.appId].icon}
          onClose={closeWindow}
          onMinimize={toggleMinimize}
          onMaximize={toggleMaximize}
          onFocus={focusWindow}
          onMove={moveWindow}
        >
          {renderAppContent(window.appId)}
        </WindowFrame>
      ))}

      {/* Taskbar */}
      <div 
        className="absolute bottom-0 w-full h-10 bg-win7-bg/80 backdrop-blur-md border-t border-white/30 flex items-center justify-between px-2 z-[9999] shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 h-full">
          {/* Start Button */}
          <button 
            className={`relative w-10 h-10 -ml-2 -mt-1 rounded-full overflow-hidden transition-all hover:brightness-110 ${startMenuOpen ? 'brightness-90' : ''}`}
            onClick={() => setStartMenuOpen(!startMenuOpen)}
          >
             <Icons.Start />
          </button>

          {/* Taskbar Items */}
          <div className="flex items-center gap-1 ml-2 h-full py-1">
            {windows.map(window => (
              <button
                key={window.id}
                onClick={() => {
                  if (window.isMinimized) toggleMinimize(window.id);
                  else if (activeWindowId === window.id) toggleMinimize(window.id);
                  else focusWindow(window.id);
                }}
                className={`
                  h-full px-3 max-w-[160px] min-w-[120px] rounded flex items-center gap-2 border border-transparent transition-all
                  ${window.id === activeWindowId && !window.isMinimized 
                    ? 'bg-white/20 border-white/30 shadow-inner' 
                    : 'hover:bg-white/10 hover:border-white/20'}
                `}
              >
                <div className="w-4 h-4">{APPS[window.appId].icon}</div>
                <span className="text-white text-xs truncate drop-shadow-md">{window.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* System Tray */}
        <div className="h-full flex items-center gap-3 px-3 bg-black/10 rounded-lg my-1 border border-white/10 shadow-inner">
          <div className="text-white hover:text-blue-200 cursor-pointer"><Icons.Wifi /></div>
          <div className="text-white hover:text-blue-200 cursor-pointer"><Icons.Cpu /></div>
          <div className="flex flex-col items-center justify-center text-white text-xs leading-tight min-w-[50px]">
            <span>{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            <span className="text-[10px] opacity-80">{currentTime.toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Start Menu */}
      {startMenuOpen && (
        <div 
          className="absolute bottom-10 left-0 w-96 h-[500px] bg-slate-100/95 backdrop-blur-xl rounded-tr-lg border border-white/40 shadow-2xl flex flex-col z-[10000]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-1 flex">
            {/* Left Panel (Apps) */}
            <div className="flex-1 p-2 bg-white m-1 rounded border border-gray-200 shadow-inner overflow-y-auto">
              {Object.values(APPS).map(app => (
                <div 
                  key={app.id}
                  className="flex items-center gap-3 p-2 hover:bg-blue-100 hover:shadow-sm rounded cursor-pointer transition-colors"
                  onClick={() => openApp(app.id)}
                >
                  <div className="w-8 h-8">{app.icon}</div>
                  <div className="flex flex-col">
                    <span className="text-slate-800 text-sm font-semibold">{app.name}</span>
                    <span className="text-slate-500 text-xs">Application</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Right Panel (System) */}
            <div className="w-32 bg-slate-200/50 p-2 flex flex-col gap-2 text-xs text-slate-700">
               <div className="p-2 hover:bg-slate-300/50 rounded cursor-pointer">Admin User</div>
               <div className="h-px bg-slate-300 my-1"></div>
               <div className="p-2 hover:bg-slate-300/50 rounded cursor-pointer">Documents</div>
               <div className="p-2 hover:bg-slate-300/50 rounded cursor-pointer">Pictures</div>
               <div className="p-2 hover:bg-slate-300/50 rounded cursor-pointer">Music</div>
               <div className="h-px bg-slate-300 my-1"></div>
               <div className="p-2 hover:bg-slate-300/50 rounded cursor-pointer" onClick={() => openApp(AppID.EXPLORER)}>Computer</div>
               <div className="p-2 hover:bg-slate-300/50 rounded cursor-pointer" onClick={() => openApp(AppID.SETTINGS)}>Control Panel</div>
               <div className="mt-auto flex justify-end">
                 <button className="px-3 py-1 bg-red-400/20 border border-red-400/40 text-red-900 rounded hover:bg-red-400/30 shadow-sm">
                   Shut down
                 </button>
               </div>
            </div>
          </div>
          
          {/* Bottom Search */}
          <div className="h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-bl-lg p-2 flex items-center">
             <div className="bg-white rounded-full w-full h-8 border border-slate-400 shadow-inner flex items-center px-3 gap-2">
                <Icons.Search />
                <input 
                  type="text" 
                  placeholder="Search programs and files" 
                  className="w-full bg-transparent outline-none text-sm text-slate-600 italic"
                />
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;