import React from 'react';
import { 
  Monitor, 
  Globe, 
  FileText, 
  Settings, 
  Trash2, 
  X, 
  Minus, 
  Square, 
  Search, 
  ArrowLeft, 
  ArrowRight, 
  RotateCw,
  Cat,
  Cpu,
  Wifi
} from 'lucide-react';

export const Icons = {
  Computer: () => <Monitor className="w-full h-full text-blue-200 drop-shadow-md" />,
  Browser: () => <Cat className="w-full h-full text-orange-400 drop-shadow-md" />,
  Notepad: () => <FileText className="w-full h-full text-white drop-shadow-md" />,
  Settings: () => <Settings className="w-full h-full text-gray-300 drop-shadow-md" />,
  Trash: () => <Trash2 className="w-full h-full text-gray-400 drop-shadow-md" />,
  Close: () => <X size={16} />,
  Minimize: () => <Minus size={16} />,
  Maximize: () => <Square size={14} />,
  Search: () => <Search size={16} />,
  Back: () => <ArrowLeft size={16} />,
  Forward: () => <ArrowRight size={16} />,
  Refresh: () => <RotateCw size={16} />,
  Start: () => <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center border-2 border-white/50 shadow-lg group-hover:brightness-110">
     <div className="text-white font-bold italic select-none">S</div>
  </div>,
  Wifi: () => <Wifi size={16} />,
  Cpu: () => <Cpu size={16} />,
};