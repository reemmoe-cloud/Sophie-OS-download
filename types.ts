export enum AppID {
  EXPLORER = 'explorer',
  MEOW_BROWSER = 'meow_browser',
  NOTEPAD = 'notepad',
  SETTINGS = 'settings',
  TRASH = 'trash'
}

export interface WindowState {
  id: string;
  appId: AppID;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface AppConfig {
  id: AppID;
  name: string;
  icon: any; // Using React Node (Lucide icon)
  defaultTitle: string;
  defaultWidth: number;
  defaultHeight: number;
}