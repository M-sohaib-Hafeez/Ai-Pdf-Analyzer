import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  AlertCircle,
  Clock,
  UserCheck,
  Filter,
  CheckCircle2,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { ActionItem } from '../types';

interface ActionItemsTabProps {
  actionItems: ActionItem[];
  onToggleComplete: (id: string) => void;
  onJumpToPage: (page: number) => void;
}

export const ActionItemsTab: React.FC<ActionItemsTabProps> = ({
  actionItems,
  onToggleComplete,
  onJumpToPage
}) => {
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  const filteredItems = actionItems.filter(
    item => priorityFilter === 'All' || item.priority === priorityFilter
  );

  const completedCount = actionItems.filter(a => a.completed).length;
  const totalCount = actionItems.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getPriorityBadge = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white border border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            <AlertCircle className="w-3 h-3 stroke-[2.5]" /> High Priority
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-900 border border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            <Clock className="w-3 h-3 stroke-[2.5]" /> Medium Priority
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            Low Priority
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Progress & Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-900 dark:border-slate-700 p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] dark:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-black uppercase text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
              Action Items & Policy Tasks
            </h3>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
              Explicit tasks, deadlines, and policy mandates extracted directly from document text.
            </p>
          </div>

          {/* Priority Filters */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border-2 border-slate-900 dark:border-slate-700 text-xs font-black uppercase">
            {(['All', 'High', 'Medium', 'Low'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  priorityFilter === p
                    ? 'bg-indigo-600 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] border border-slate-900'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Completion Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-black uppercase mb-1.5">
            <span className="text-slate-900 dark:text-slate-100">Execution Progress</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-mono">
              {completedCount} / {totalCount} completed ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full border-2 border-slate-900 overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-xs font-black uppercase text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            No action items match the active priority filter ({priorityFilter}).
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border-2 border-slate-900 dark:border-slate-700 transition-all ${
                item.completed
                  ? 'bg-slate-100 dark:bg-slate-900/50 opacity-75 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                  : 'bg-white dark:bg-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => onToggleComplete(item.id)}
                  className="mt-0.5 text-slate-900 dark:text-slate-100 hover:text-indigo-600 transition-colors"
                >
                  {item.completed ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
                  ) : (
                    <Square className="w-5 h-5 stroke-[2.5]" />
                  )}
                </button>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className={`text-xs sm:text-sm font-black uppercase ${item.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {item.task}
                    </p>
                    {getPriorityBadge(item.priority)}
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-slate-600 dark:text-slate-400 flex-wrap pt-2 border-t-2 border-slate-100 dark:border-slate-800">
                    {item.ownerRole && (
                      <span className="inline-flex items-center gap-1 font-bold text-slate-900 dark:text-slate-200">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-600 stroke-[2.5]" />
                        Owner: {item.ownerRole}
                      </span>
                    )}

                    {item.deadline && (
                      <span className="inline-flex items-center gap-1 font-bold text-slate-900 dark:text-slate-200">
                        <Calendar className="w-3.5 h-3.5 text-amber-600 stroke-[2.5]" />
                        Deadline: {item.deadline}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => onJumpToPage(item.pageNumber)}
                      className="inline-flex items-center gap-1 text-slate-900 dark:text-slate-100 bg-amber-300 dark:bg-amber-500 px-2.5 py-0.5 rounded border border-slate-900 font-mono font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[1px] hover:translate-y-[1px] ml-auto"
                    >
                      <ExternalLink className="w-3 h-3 stroke-[2.5]" />
                      {item.pageCitation}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
