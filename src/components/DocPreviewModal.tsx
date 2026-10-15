'use client';

import React from 'react';
import { X, FileText, CheckCircle2, Tag, BookOpen, Hash, ArrowUpRight } from 'lucide-react';
import { IngestedDocument } from '../types';

interface DocPreviewModalProps {
  document: IngestedDocument | null;
  onClose: () => void;
  onQueryAboutDoc?: (docTitle: string) => void;
}

export const DocPreviewModal: React.FC<DocPreviewModalProps> = ({
  document,
  onClose,
  onQueryAboutDoc,
}) => {
  if (!document) return null;

  const getEntityBadgeColor = (type: string) => {
    switch (type) {
      case 'regulation':
        return 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'budget':
        return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'risk':
        return 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'technology':
        return 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-3xl max-h-[88vh] overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded font-mono uppercase font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {document.fileType}
                </span>
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" />
                  {document.confidenceScore}% Document AI Confidence
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {document.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Filename: {document.filename} · {document.fileSize} · {document.pageCount} Pages · Uploaded {document.uploadDate}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Executive Summary */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              Document AI Executive Summary
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {document.executiveSummary}
            </div>
          </div>

          {/* Key Metrics Grid */}
          {document.keyMetrics && document.keyMetrics.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-cyan-500" />
                Synthesized Key Metrics
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {document.keyMetrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800"
                  >
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {metric.label}
                    </div>
                    <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {metric.value}
                    </div>
                    {metric.trend && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        {metric.trend}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extracted Named Entities */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-purple-500" />
              Extracted Entities & Regulations ({document.entities.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {document.entities.map((entity, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${getEntityBadgeColor(
                    entity.type
                  )}`}
                >
                  <span>{entity.name}</span>
                  <span className="text-[10px] opacity-75 font-mono">
                    {entity.confidence}%
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* Extracted Document Chunks / Citations */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              Indexed Semantic Chunks ({document.chunks.length})
            </h3>
            <div className="space-y-3">
              {document.chunks.map((chunk) => (
                <div
                  key={chunk.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {chunk.title}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      Page {chunk.pageNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-white/60 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/50 font-serif">
                    &ldquo;{chunk.snippet}&rdquo;
                  </p>
                  <div className="flex items-center gap-1.5 pt-1">
                    {chunk.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] px-2 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            ID: {document.id}
          </span>
          <div className="flex items-center gap-2">
            {onQueryAboutDoc && (
              <button
                onClick={() => {
                  onQueryAboutDoc(document.title);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <span>Ask Copilot about this Document</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
