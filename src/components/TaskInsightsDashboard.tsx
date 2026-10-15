'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  Sparkles,
  AlertCircle,
  Plus,
  Clock,
  CheckCircle2,
  Trash2,
  Copy,
  Download,
  Filter,
  Check,
  Building,
  Calendar,
  X,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActionTask, IngestedDocument } from '../types';

interface TaskInsightsDashboardProps {
  tasks: ActionTask[];
  documents: IngestedDocument[];
  onAddTask: (task: ActionTask) => void;
  onUpdateTaskStatus: (taskId: string, status: 'todo' | 'in_progress' | 'completed') => void;
  onDeleteTask: (taskId: string) => void;
  onAutoExtractFromDocs: () => void;
}

export const TaskInsightsDashboard: React.FC<TaskInsightsDashboardProps> = ({
  tasks,
  documents,
  onAddTask,
  onUpdateTaskStatus,
  onDeleteTask,
  onAutoExtractFromDocs,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Form State for custom task
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'critical' | 'high' | 'medium' | 'low'>('high');
  const [department, setDepartment] = useState<'SecOps' | 'FinOps' | 'DevOps' | 'Legal' | 'Executive' | 'Product'>('SecOps');
  const [dueDate, setDueDate] = useState('2026-11-15');

  // Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const criticalPending = tasks.filter((t) => t.status !== 'completed' && t.priority === 'critical').length;
  const highPending = tasks.filter((t) => t.status !== 'completed' && t.priority === 'high').length;
  const readinessIndex = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleToggleStatus = (task: ActionTask) => {
    let nextStatus: 'todo' | 'in_progress' | 'completed' = 'completed';
    if (task.status === 'completed') {
      nextStatus = 'todo';
    } else if (task.status === 'todo') {
      nextStatus = 'in_progress';
    }

    if (nextStatus === 'completed') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#a855f7', '#06b6d4', '#10b981'],
      });
    }

    onUpdateTaskStatus(task.id, nextStatus);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: ActionTask = {
      id: `task-${Date.now()}`,
      title,
      description,
      priority,
      department,
      dueDate,
      status: 'todo',
      sourceDocTitle: 'Manual Executive Entry',
      createdAt: new Date().toISOString(),
    };

    onAddTask(newTask);
    setTitle('');
    setDescription('');
    setIsAddingTask(false);
  };

  const handleExportMarkdown = () => {
    let md = `# NYVORYX Enterprise Action Plan & Task Registry\n`;
    md += `Generated: ${new Date().toLocaleDateString()} | Total: ${totalTasks} | Readiness: ${readinessIndex}%\n\n`;

    tasks.forEach((t, i) => {
      const checkbox = t.status === 'completed' ? '[x]' : '[ ]';
      md += `### ${i + 1}. ${checkbox} [${t.priority.toUpperCase()}] ${t.title}\n`;
      md += `- **Department**: ${t.department}\n`;
      md += `- **Due Date**: ${t.dueDate}\n`;
      md += `- **Status**: ${t.status}\n`;
      if (t.sourceDocTitle) md += `- **Source**: ${t.sourceDocTitle} (Page ${t.sourcePage || 1})\n`;
      md += `- **Action Details**: ${t.description}\n\n`;
    });

    navigator.clipboard.writeText(md);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'pending' && t.status === 'completed') return false;
    if (filterStatus === 'completed' && t.status !== 'completed') return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (filterDept !== 'all' && t.department !== filterDept) return false;
    return true;
  });

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'critical':
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 animate-pulse';
      case 'high':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'medium':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Action Items</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalTasks}</div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
            Synchronized with Memory
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Critical / High Pending</div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {criticalPending + highPending}
          </div>
          <div className="text-[11px] text-rose-500 font-medium mt-0.5">
            {criticalPending} Critical require SLA action
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Completed Actions</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {completedTasks}
          </div>
          <div className="text-[11px] text-emerald-500 font-medium mt-0.5">Verified & Audited</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Readiness Score</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {readinessIndex}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${readinessIndex}%` }}
            />
          </div>
        </div>
      </div>

      {/* Control Bar: Actions & Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-purple-600 text-white">
            <CheckSquare className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Actionable Insights & Task Board
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Auto-extracted from queries & enterprise reports · Team NYVORYX
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onAutoExtractFromDocs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Extract from Docs</span>
          </button>

          <button
            onClick={() => setIsAddingTask(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-500" />
            <span>Add Custom</span>
          </button>

          <button
            onClick={handleExportMarkdown}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Copy as Markdown for Jira or Notion"
          >
            {copiedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Export MD</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 font-medium">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterStatus === 'all'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterStatus === 'pending'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Pending ({tasks.filter((t) => t.status !== 'completed').length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterStatus === 'completed'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Completed ({completedTasks})
          </button>
        </div>

        {/* Priority & Dept Filter Dropdowns */}
        <div className="flex items-center gap-2">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs focus:outline-none"
          >
            <option value="all">All Departments</option>
            <option value="SecOps">SecOps</option>
            <option value="FinOps">FinOps</option>
            <option value="DevOps">DevOps</option>
            <option value="Product">Product</option>
            <option value="Legal">Legal</option>
            <option value="Executive">Executive</option>
          </select>
        </div>
      </div>

      {/* Modal / Form for Custom Task */}
      {isAddingTask && (
        <form
          onSubmit={handleCreateTask}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 shadow-md space-y-3 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Create New Action Task
            </span>
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              placeholder="Task Title (e.g. Enforce 90-day KMS Envelope Rotation)..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <textarea
              placeholder="Actionable description, remediation mandate, or implementation details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as any)}
                className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="SecOps">SecOps</option>
                <option value="FinOps">FinOps</option>
                <option value="DevOps">DevOps</option>
                <option value="Product">Product</option>
                <option value="Legal">Legal</option>
                <option value="Executive">Executive</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase">Target Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
            >
              Add to Board
            </button>
          </div>
        </form>
      )}

      {/* Task Cards List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            No action tasks matching selected filter criteria.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';

            return (
              <div
                key={task.id}
                className={`group p-4 rounded-xl border transition-all duration-150 ${
                  isCompleted
                    ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-70'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600/70 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Status Checkbox & Content */}
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleStatus(task)}
                      className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                          : task.status === 'in_progress'
                          ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-700 dark:text-amber-300'
                          : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                      }`}
                      title={
                        isCompleted
                          ? 'Mark as Todo'
                          : task.status === 'in_progress'
                          ? 'Mark as Completed'
                          : 'Mark as In Progress'
                      }
                    >
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5 stroke-3" />
                      ) : task.status === 'in_progress' ? (
                        <Clock className="w-3 h-3 animate-pulse" />
                      ) : null}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityBadge(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>

                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {task.department}
                        </span>

                        <span
                          className={`text-sm font-bold text-slate-900 dark:text-white ${
                            isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>

                      <p
                        className={`text-xs text-slate-600 dark:text-slate-400 leading-relaxed ${
                          isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                        }`}
                      >
                        {task.description}
                      </p>

                      {/* Source Citation Reference */}
                      {task.sourceDocTitle && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                          <FileText className="w-3 h-3 text-indigo-500" />
                          <span>Source:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {task.sourceDocTitle}
                          </span>
                          {task.sourcePage && (
                            <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800">
                              P.{task.sourcePage}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Due Date */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{task.dueDate}</span>
                    </div>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                      title="Delete action task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
