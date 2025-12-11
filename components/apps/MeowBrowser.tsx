import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../ui/Icons';
import { generateWebPage } from '../../services/geminiService';

export const MeowBrowser: React.FC = () => {
  const [url, setUrl] = useState('https://welcome.sophie-os');
  const [inputValue, setInputValue] = useState('https://welcome.sophie-os');
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(['https://welcome.sophie-os']);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    loadPage(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPage = async (pageUrl: string) => {
    setIsLoading(true);
    let pageContent = '';

    if (pageUrl === 'https://welcome.sophie-os') {
      pageContent = `
        <div class="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-gradient-to-b from-blue-50 to-white">
          <h1 class="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 mb-4 drop-shadow-sm">Meow Browser</h1>
          <p class="text-xl text-gray-600 mb-8 max-w-md">The purr-fect way to surf the AI generated web.</p>
          <div class="p-6 bg-white rounded-xl shadow-lg border border-gray-100 max-w-lg w-full">
            <h3 class="font-semibold text-gray-800 mb-2">Try searching for:</h3>
            <ul class="text-left space-y-2">
              <li><a href="search://History of Ancient Rome" class="text-blue-600 hover:underline cursor-pointer">"History of Ancient Rome"</a></li>
              <li><a href="search://Recipe for chocolate chip cookies" class="text-blue-600 hover:underline cursor-pointer">"Recipe for chocolate chip cookies"</a></li>
              <li><a href="https://apple.com" class="text-blue-600 hover:underline cursor-pointer">"apple.com"</a></li>
              <li><a href="search://How to build a react app" class="text-blue-600 hover:underline cursor-pointer">"How to build a react app"</a></li>
            </ul>
          </div>
          <footer class="mt-12 text-gray-400 text-sm">Powered by Sophie OS & Gemini</footer>
        </div>
      `;
      setContent(pageContent);
      setIsLoading(false);
      return;
    }

    // Call Gemini
    pageContent = await generateWebPage(pageUrl);
    setContent(pageContent);
    setIsLoading(false);
  };

  const navigateTo = (target: string) => {
    setUrl(target);
    setInputValue(target);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(target);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    loadPage(target);
  };

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = inputValue;
    if (!target.startsWith('http') && !target.startsWith('search://')) {
      // Treat as search if no protocol, unless it looks like a domain
      if (!target.includes('.') || target.includes(' ')) {
        target = `search://${target}`;
      } else {
        target = `https://${target}`;
      }
    }
    
    navigateTo(target);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const prevUrl = history[newIndex];
      setUrl(prevUrl);
      setInputValue(prevUrl);
      loadPage(prevUrl);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextUrl = history[newIndex];
      setUrl(nextUrl);
      setInputValue(nextUrl);
      loadPage(nextUrl);
    }
  };

  const handleRefresh = () => {
    loadPage(url);
  };

  // Intercept clicks in the rendered content
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    
    if (anchor) {
      e.preventDefault();
      const href = anchor.getAttribute('href');
      if (href) {
         if (href.startsWith('#')) return; // ignore anchors
         navigateTo(href);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Navigation Bar */}
      <div className="h-10 bg-gray-100 border-b border-gray-300 flex items-center px-2 gap-2 shadow-sm z-10">
        <div className="flex gap-1">
          <button 
            onClick={goBack} 
            disabled={historyIndex === 0}
            className={`p-1 rounded-full ${historyIndex === 0 ? 'text-gray-400' : 'hover:bg-gray-200 text-gray-700'}`}
          >
            <Icons.Back />
          </button>
          <button 
            onClick={goForward}
            disabled={historyIndex === history.length - 1}
            className={`p-1 rounded-full ${historyIndex === history.length - 1 ? 'text-gray-400' : 'hover:bg-gray-200 text-gray-700'}`}
          >
            <Icons.Forward />
          </button>
          <button onClick={handleRefresh} className="p-1 rounded-full hover:bg-gray-200 text-gray-700">
            <Icons.Refresh />
          </button>
        </div>

        <form onSubmit={handleNavigate} className="flex-1 flex">
          <div className="flex-1 bg-white border border-gray-300 rounded-md flex items-center px-2 py-0.5 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-200 shadow-inner">
            <span className="text-gray-400 mr-2">
              <Icons.Search />
            </span>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 outline-none text-sm text-gray-700"
              placeholder="Search or enter web address"
            />
          </div>
        </form>
      </div>

      {/* Content Area */}
      <div 
        className="flex-1 overflow-auto relative bg-white" 
        onClick={handleContentClick}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
            <div className="animate-spin text-blue-500">
              <Icons.Refresh />
            </div>
            <span className="ml-2 text-gray-600 font-medium">Loading...</span>
          </div>
        ) : null}
        
        <div 
          className="min-h-full"
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      </div>
    </div>
  );
};