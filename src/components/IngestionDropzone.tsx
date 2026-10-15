'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Trash2,
  Eye,
  Loader2,
  Sparkles,
  Zap,
  ArrowRight,
  Search,
} from 'lucide-react';
import { IngestedDocument } from '../types';
import { DEMO_TEMPLATES, simulateDocumentParsing } from '../lib/documentAiMock';

interface IngestionDropzoneProps {
  documents: IngestedDocument[];
  onAddDocument: (doc: IngestedDocument) => void;
  onDeleteDocument: (docId: string) => void;
  onPreviewDocument: (doc: IngestedDocument) => void;
  onQueryDocument: (docTitle: string) => void;
}

export const IngestionDropzone: React.FC<IngestionDropzoneProps> = ({
  documents,
  onAddDocument,
  onDeleteDocument,
  onPreviewDocument,
  onQueryDocument,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [activeFileName, setActiveFileName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: { name: string; size?: number }) => {
    setIsProcessing(true);
    setActiveFileName(file.name);
    setProcessingProgress(10);
    setProcessingStatus('Starting Document AI Pipeline...');

    try {
      const parsedDoc = await simulateDocumentParsing(file, (stage, percent) => {
        setProcessingStatus(stage);
        setProcessingProgress(percent);
      });
      onAddDocument(parsedDoc);
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
      setActiveFileName('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleProcessFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      handleProcessFile(selectedFile);
      e.target.value = '';
    }
  };

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.entities.some((ent) => ent.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Feature Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-indigo-200/50 dark:border-indigo-800/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
              <UploadCloud className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Smart Knowledge Ingestion Dropzone
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Powered by Mock Document AI · Instant multi-modal OCR, entity extraction & vector indexing
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-indigo-700 dark:text-indigo-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>{documents.length} Indexed Repositories</span>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-200 p-8 text-center cursor-pointer ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-900/50'
        }`}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,.csv"
          className="hidden"
          onChange={handleFileChange}
          disabled={isProcessing}
        />

        {isProcessing ? (
          <div className="space-y-4 max-w-md mx-auto py-3">
            <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm font-bold">Document AI Parsing in Progress</span>
            </div>

            <div className="text-xs text-slate-700 dark:text-slate-300 font-mono">
              Processing: <span className="font-semibold">{activeFileName}</span>
            </div>

            {/* Stepper Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${processingProgress}%` }}
              />
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              {processingStatus} ({processingProgress}%)
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shadow-inner">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Drag and drop your enterprise files here, or{' '}
                <span className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  browse files
                </span>
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Supports PDF, DOCX, CSV, TXT (up to 50MB) · Auto OCR & Vector Indexing
              </p>
            </div>
          </div>
        )}
      </div>

      {/* One-Click Hackathon Demo Loaders */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Instant Hackathon Demo Documents
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Click to simulate instant ingestion
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {DEMO_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              disabled={isProcessing}
              onClick={() => handleProcessFile({ name: tmpl.filename, size: 3800000 })}
              className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-sm text-left transition-all duration-150 disabled:opacity-50"
            >
              <div className="overflow-hidden pr-2">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {tmpl.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {tmpl.category} · {tmpl.pageCount}p · {tmpl.fileSize}
                </div>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Ingested Documents List */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Active Knowledge Base</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
              {filteredDocuments.length}
            </span>
          </h3>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by title or entity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-56"
            />
          </div>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="text-center py-8 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            No documents matching &ldquo;{searchTerm}&rdquo;
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="group p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600/60 shadow-sm transition-all duration-150 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                      <FileText className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono uppercase font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          {doc.fileType}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {doc.title}
                        </h4>
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          {doc.confidenceScore}% Confidence
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {doc.executiveSummary}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 flex-shrink-0">
                    <button
                      onClick={() => onPreviewDocument(doc)}
                      title="Inspect extracted entities and chunks"
                      className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onQueryDocument(doc.title)}
                      title="Ask Copilot about this document"
                      className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteDocument(doc.id)}
                      title="Delete from knowledge base"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Footer Entity Tags & Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex flex-wrap gap-1.5">
                    {doc.entities.slice(0, 3).map((ent, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        {ent.name}
                      </span>
                    ))}
                    {doc.entities.length > 3 && (
                      <span className="px-1.5 py-0.5 text-slate-400">
                        +{doc.entities.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span>{doc.pageCount} Pages</span>
                    <span>{doc.fileSize}</span>
                    <span>{doc.chunks.length} Chunks</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
