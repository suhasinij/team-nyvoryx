'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  BookOpen,
  ArrowRight,
  PlusCircle,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  CornerDownRight,
  ShieldAlert,
} from 'lucide-react';
import { IngestedDocument, ChatMessage, ActionTask, SuggestedAction } from '../types';
import { SUGGESTED_QUERIES, queryCopilotEngine } from '../lib/copilotRagMock';

interface CopilotChatFeedProps {
  documents: IngestedDocument[];
  messages: ChatMessage[];
  onSendMessage: (msg: ChatMessage) => void;
  onAddTask: (task: ActionTask) => void;
  externalQuery?: string;
  onClearExternalQuery?: () => void;
}

export const CopilotChatFeed: React.FC<CopilotChatFeedProps> = ({
  documents,
  messages,
  onSendMessage,
  onAddTask,
  externalQuery,
  onClearExternalQuery,
}) => {
  const [inputText, setInputText] = useState('');
  const [isInferring, setIsInferring] = useState(false);
  const [expandedCitationId, setExpandedCitationId] = useState<string | null>(null);
  const [addedActionIds, setAddedActionIds] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isInferring]);

  // Handle external query passed from IngestionDropzone or DocPreviewModal
  useEffect(() => {
    if (externalQuery) {
      handleSend(externalQuery);
      if (onClearExternalQuery) onClearExternalQuery();
    }
  }, [externalQuery]);

  const handleSend = async (queryText?: string) => {
    const text = (queryText || inputText).trim();
    if (!text || isInferring) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: text,
    };

    onSendMessage(userMsg);
    setInputText('');
    setIsInferring(true);

    try {
      const response = await queryCopilotEngine(text, documents);

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: response.answer,
        citations: response.citations,
        suggestedActions: response.suggestedActions,
      };

      onSendMessage(assistantMsg);
    } finally {
      setIsInferring(false);
    }
  };

  const handleAddSuggestedAction = (act: SuggestedAction, sourceDoc?: string, page?: number) => {
    const newTask: ActionTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: act.title,
      description: act.description,
      priority: act.priority,
      department: act.department,
      dueDate: act.dueDate,
      status: 'todo',
      sourceDocTitle: sourceDoc || 'Copilot Memory Inference',
      sourcePage: page || 1,
      createdAt: new Date().toISOString(),
    };

    onAddTask(newTask);
    setAddedActionIds((prev) => ({ ...prev, [act.id]: true }));
  };

  return (
    <div className="flex flex-col h-[750px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Feed Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 animate-pulse-subtle" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Vertex AI / Gemini Knowledge Feed</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Grounding Active
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Retrieval-Augmented Generation across {documents.length} verified organizational sources
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono hidden sm:block">
          Model: gemini-3.8-flash-enterprise
        </div>
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="p-3 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800/80 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            Quick Prompts:
          </span>
          {SUGGESTED_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q.query)}
              disabled={isInferring}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all shadow-2xs disabled:opacity-50"
            >
              <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400">
                [{q.badge}]
              </span>
              <span>{q.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[78%] space-y-3 ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/10 rounded-br-none'
                    : 'bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/70 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                <div
                  className={`text-[10px] mt-2 font-mono ${
                    msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {/* Citations & Source Cards (Only for Assistant) */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Citations & Verified Grounding Sources ({msg.citations.length})</span>
                  </div>

                  <div className="space-y-2">
                    {msg.citations.map((cite, cIdx) => {
                      const citeKey = `${msg.id}-cite-${cIdx}`;
                      const isExpanded = expandedCitationId === citeKey;

                      return (
                        <div
                          key={cIdx}
                          className="rounded-xl border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 overflow-hidden text-xs transition-all"
                        >
                          <button
                            onClick={() =>
                              setExpandedCitationId(isExpanded ? null : citeKey)
                            }
                            className="w-full flex items-center justify-between p-2.5 text-left hover:bg-indigo-100/50 dark:hover:bg-indigo-900/40 transition-colors"
                          >
                            <div className="flex items-center gap-2 truncate pr-2">
                              <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                              <span className="font-semibold text-indigo-950 dark:text-indigo-200 truncate">
                                {cite.documentTitle}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                                Page {cite.pageNumber}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                {cite.confidence}% Match
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                              )}
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="p-3 border-t border-indigo-200/60 dark:border-indigo-900/60 bg-white/80 dark:bg-slate-900/80 space-y-1.5 animate-in fade-in duration-100">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Extracted Source Excerpt:
                              </span>
                              <p className="font-serif italic text-slate-700 dark:text-slate-300 text-xs leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                &ldquo;{cite.snippet}&rdquo;
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actionable Follow-Up Suggestions */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/70 dark:border-purple-900/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                      <CornerDownRight className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      Extracted Action Items ({msg.suggestedActions.length})
                    </span>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                      One-click save to task board
                    </span>
                  </div>

                  <div className="space-y-2">
                    {msg.suggestedActions.map((act) => {
                      const isAdded = addedActionIds[act.id];

                      return (
                        <div
                          key={act.id}
                          className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-purple-200/60 dark:border-purple-900/50 shadow-2xs"
                        >
                          <div className="overflow-hidden pr-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded uppercase bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                                {act.priority}
                              </span>
                              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                                {act.department} · Due {act.dueDate}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-1 truncate">
                              {act.title}
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              handleAddSuggestedAction(
                                act,
                                msg.citations?.[0]?.documentTitle,
                                msg.citations?.[0]?.pageNumber
                              )
                            }
                            disabled={isAdded}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold flex-shrink-0 transition-all ${
                              isAdded
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <PlusCircle className="w-3.5 h-3.5" />
                                <span>Save Task</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Streaming/Inferring Indicator */}
        {isInferring && (
          <div className="flex gap-3.5 items-start">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs flex items-center gap-2">
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                Synthesizing multi-source enterprise context & citations...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Ask anything across indexed enterprise reports, audits, and roadmaps..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isInferring}
              className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isInferring}
            className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 transition-all shadow-md shadow-indigo-600/20 disabled:shadow-none flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
          <span>Grounding: 3 Indexed Documents</span>
          <span>Press Enter to send · Sources cited with confidence ratings</span>
        </div>
      </div>
    </div>
  );
};
