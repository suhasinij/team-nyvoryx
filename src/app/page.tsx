'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { IngestionDropzone } from '../components/IngestionDropzone';
import { CopilotChatFeed } from '../components/CopilotChatFeed';
import { TaskInsightsDashboard } from '../components/TaskInsightsDashboard';
import { DocPreviewModal } from '../components/DocPreviewModal';
import {
  INITIAL_DOCUMENTS,
  INITIAL_TASKS,
  INITIAL_CHAT_MESSAGES,
} from '../data/mockDocuments';
import { IngestedDocument, ActionTask, ChatMessage } from '../types';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'ingestion' | 'copilot' | 'tasks'>('all');

  const [documents, setDocuments] = useState<IngestedDocument[]>(INITIAL_DOCUMENTS);
  const [tasks, setTasks] = useState<ActionTask[]>(INITIAL_TASKS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);

  const [previewDoc, setPreviewDoc] = useState<IngestedDocument | null>(null);
  const [externalQuery, setExternalQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize client-side state and dark mode
  useEffect(() => {
    setIsClient(true);

    const savedTheme = localStorage.getItem('nyvoryx_theme');
    if (savedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
    } else {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#090d16';
    }

    try {
      const savedDocs = localStorage.getItem('nyvoryx_docs');
      if (savedDocs) setDocuments(JSON.parse(savedDocs));

      const savedTasks = localStorage.getItem('nyvoryx_tasks');
      if (savedTasks) setTasks(JSON.parse(savedTasks));

      const savedMsgs = localStorage.getItem('nyvoryx_msgs');
      if (savedMsgs) setMessages(JSON.parse(savedMsgs));
    } catch {
      // Fallback to default mock data if error
    }
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem('nyvoryx_docs', JSON.stringify(documents));
    } catch (e) {
      console.warn('Failed to save docs to localStorage', e);
    }
  }, [documents, isClient]);

  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem('nyvoryx_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.warn('Failed to save tasks to localStorage', e);
    }
  }, [tasks, isClient]);

  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem('nyvoryx_msgs', JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save messages to localStorage', e);
    }
  }, [messages, isClient]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#090d16';
      localStorage.setItem('nyvoryx_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
      localStorage.setItem('nyvoryx_theme', 'light');
    }
  };

  const handleAddDocument = (newDoc: IngestedDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
    showToast(`Document "${newDoc.title}" parsed & indexed!`);
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    showToast('Document removed from active index');
  };

  const handleSendMessage = (newMsg: ChatMessage) => {
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleAddTask = (newTask: ActionTask) => {
    setTasks((prev) => [newTask, ...prev]);
    showToast(`Action task "${newTask.title}" added!`);
  };

  const handleUpdateTaskStatus = (
    taskId: string,
    status: 'todo' | 'in_progress' | 'completed'
  ) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast('Task removed from registry');
  };

  const handleAutoExtractFromDocs = () => {
    const extractedTask1: ActionTask = {
      id: `task-${Date.now()}-ext1`,
      title: 'Conduct Automated Red Team Pen-Test Review',
      description:
        'Verify zero-trust ingress gateway firewall rules against latest CVE-2026-9041 vulnerability definition.',
      priority: 'high',
      department: 'SecOps',
      dueDate: '2026-11-04',
      status: 'todo',
      sourceDocTitle: documents[0]?.title || 'Security Audit & Pen-Test',
      sourcePage: 9,
      createdAt: new Date().toISOString(),
    };

    const extractedTask2: ActionTask = {
      id: `task-${Date.now()}-ext2`,
      title: 'Audit Multi-Region BigQuery Flat-Rate Slot Quotas',
      description:
        'Coordinate with Google Cloud engineering to configure autoscaling slot reservations for Q4 peak analytics.',
      priority: 'medium',
      department: 'FinOps',
      dueDate: '2026-11-18',
      status: 'todo',
      sourceDocTitle: documents[1]?.title || 'Cloud Modernization Strategy',
      sourcePage: 24,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [extractedTask1, extractedTask2, ...prev]);
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#6366f1', '#06b6d4'],
    });
    showToast('Auto-extracted 2 high-priority action items from documents!');
  };

  const handleResetDemo = () => {
    setDocuments(INITIAL_DOCUMENTS);
    setTasks(INITIAL_TASKS);
    setMessages(INITIAL_CHAT_MESSAGES);
    try {
      localStorage.removeItem('nyvoryx_docs');
      localStorage.removeItem('nyvoryx_tasks');
      localStorage.removeItem('nyvoryx_msgs');
    } catch {
      // ignore
    }
    showToast('Reset knowledge base and tasks to default demo dataset');
  };

  const handleQueryDocument = (docTitle: string) => {
    setActiveTab('copilot');
    setExternalQuery(`Summarize the primary takeaways, risks, and next steps in ${docTitle}`);
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      {/* Enterprise Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        docCount={documents.length}
        taskCount={tasks.length}
        onResetDemo={handleResetDemo}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl border border-slate-700 dark:border-slate-300 text-xs font-semibold animate-in slide-in-from-bottom-2 duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* View 1: All-in-One Enterprise Dashboard (Split 3-Column / Grid) */}
        {activeTab === 'all' && (
          <div className="space-y-6">
            {/* Top Welcome / Architecture Bar */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/60 border border-indigo-500/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Team NYVORYX · Enterprise Cognitive Substrate
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Self-contained mock Document AI, Vertex/Gemini conversational RAG with citations, and auto-generated action registry.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Sub-250ms Decision Latency</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>SOC-2 Type II Grounded</span>
                </div>
              </div>
            </div>

            {/* Split 2-Column Responsive Cockpit */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Ingestion Dropzone & Knowledge Base (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <IngestionDropzone
                  documents={documents}
                  onAddDocument={handleAddDocument}
                  onDeleteDocument={handleDeleteDocument}
                  onPreviewDocument={setPreviewDoc}
                  onQueryDocument={handleQueryDocument}
                />
              </div>

              {/* Right Column: Copilot Chat Feed (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <CopilotChatFeed
                  documents={documents}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onAddTask={handleAddTask}
                  externalQuery={externalQuery}
                  onClearExternalQuery={() => setExternalQuery('')}
                />
              </div>
            </div>

            {/* Full-Width Actionable Insights & Task Generator */}
            <div className="pt-2">
              <TaskInsightsDashboard
                tasks={tasks}
                documents={documents}
                onAddTask={handleAddTask}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onDeleteTask={handleDeleteTask}
                onAutoExtractFromDocs={handleAutoExtractFromDocs}
              />
            </div>
          </div>
        )}

        {/* View 2: Dedicated Ingestion Dropzone */}
        {activeTab === 'ingestion' && (
          <div className="max-w-4xl mx-auto py-2">
            <IngestionDropzone
              documents={documents}
              onAddDocument={handleAddDocument}
              onDeleteDocument={handleDeleteDocument}
              onPreviewDocument={setPreviewDoc}
              onQueryDocument={handleQueryDocument}
            />
          </div>
        )}

        {/* View 3: Dedicated Copilot Q&A Feed */}
        {activeTab === 'copilot' && (
          <div className="max-w-4xl mx-auto py-2">
            <CopilotChatFeed
              documents={documents}
              messages={messages}
              onSendMessage={handleSendMessage}
              onAddTask={handleAddTask}
              externalQuery={externalQuery}
              onClearExternalQuery={() => setExternalQuery('')}
            />
          </div>
        )}

        {/* View 4: Dedicated Actionable Insights & Tasks */}
        {activeTab === 'tasks' && (
          <div className="max-w-5xl mx-auto py-2">
            <TaskInsightsDashboard
              tasks={tasks}
              documents={documents}
              onAddTask={handleAddTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onDeleteTask={handleDeleteTask}
              onAutoExtractFromDocs={handleAutoExtractFromDocs}
            />
          </div>
        )}
      </main>

      {/* Document Inspection & Chunks Modal */}
      <DocPreviewModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
        onQueryAboutDoc={handleQueryDocument}
      />
    </div>
  );
}
