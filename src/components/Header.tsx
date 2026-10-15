'use client';

import React from 'react';
import { Sparkles, Moon, Sun, Layers, FileText, Bot, CheckSquare, RefreshCw, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeTab: 'all' | 'ingestion' | 'copilot' | 'tasks';
  onSelectTab: (tab: 'all' | 'ingestion' | 'copilot' | 'tasks') => void;
  docCount: number;
  taskCount: number;
  onResetDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  activeTab,
  onSelectTab,
  docCount,
  taskCount,
  onResetDemo,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand & Status */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 animate-pulse-subtle" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 dark:from-indigo-400 dark:via-purple-300 dark:to-cyan-400 bg-clip-text text-transparent">
                  NYVORYX
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Cognitive Memory
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Enterprise AI Knowledge Assistant · Team NYVORYX
              </p>
            </div>

            {/* Live Status Pill */}
            <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Document AI Online</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>Tenant Isolated</span>
              </div>
            </div>
          </div>

          {/* Center: Navigation Tabs */}
          <nav className="hidden md:flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs font-medium">
            <button
              onClick={() => onSelectTab('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Full Dashboard</span>
            </button>

            <button
              onClick={() => onSelectTab('ingestion')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 ${
                activeTab === 'ingestion'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Ingestion Dropzone</span>
              <span className="ml-0.5 px-1.5 py-0.2 bg-slate-200 dark:bg-slate-700 text-[10px] rounded-full">
                {docCount}
              </span>
            </button>

            <button
              onClick={() => onSelectTab('copilot')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 ${
                activeTab === 'copilot'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Copilot Q&A</span>
            </button>

            <button
              onClick={() => onSelectTab('tasks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 ${
                activeTab === 'tasks'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Action Items</span>
              <span className="ml-0.5 px-1.5 py-0.2 bg-slate-200 dark:bg-slate-700 text-[10px] rounded-full">
                {taskCount}
              </span>
            </button>
          </nav>

          {/* Right: Actions & Theme Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={onResetDemo}
              title="Reset knowledge base and tasks to initial demo state"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            <button
              onClick={onToggleDarkMode}
              aria-label="Toggle dark mode"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
