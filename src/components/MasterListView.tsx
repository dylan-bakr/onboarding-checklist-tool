import { useState, useMemo } from 'react'
import { useAppStore } from '../store/appStore'
import { TIMING_OPTIONS } from '../data/masterList'
import { exportFeedbackCSV } from '../utils/pdfExport'
import WhoHowLink from './WhoHowLink'

type SortField = 'taskNum' | 'task' | 'defaultTiming'
type SortDir = 'asc' | 'desc'

function SortIcon({
  field,
  sortField,
  sortDir,
}: {
  field: SortField
  sortField: SortField
  sortDir: SortDir
}) {
  return (
    <span className="ml-1 text-xs opacity-60">
      {sortField === field ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
    </span>
  )
}

const timingColor = (timing: string) => {
  switch (timing) {
    case 'Day 1':
      return 'bg-[#0078d4] text-white'
    case 'Week 1':
      return 'bg-[#50bdff] text-[#222b36]'
    case '30 Days':
      return 'bg-[#74bf60] text-white'
    case '60 Days':
      return 'bg-[#ffa100] text-white'
    case 'Exclude':
      return 'bg-gray-200 text-gray-500'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

export default function MasterListView() {
  const { tasks, feedbackDb } = useAppStore()
  const [sortField, setSortField] = useState<SortField>('taskNum')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [filterText, setFilterText] = useState('')
  const [filterTiming, setFilterTiming] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)

  const masterTasks = useMemo(() => tasks.filter((t) => !t.ephemeral), [tasks])

  const rows = useMemo(() => {
    return masterTasks
      .filter((t) => {
        const textMatch =
          !filterText ||
          t.task.toLowerCase().includes(filterText.toLowerCase()) ||
          t.whoHow.text.toLowerCase().includes(filterText.toLowerCase())
        const timingMatch = !filterTiming || t.defaultTiming === filterTiming
        return textMatch && timingMatch
      })
      .sort((a, b) => {
        let cmp = 0
        if (sortField === 'taskNum') cmp = a.taskNum - b.taskNum
        else if (sortField === 'task') cmp = a.task.localeCompare(b.task)
        else if (sortField === 'defaultTiming')
          cmp = TIMING_OPTIONS.indexOf(a.defaultTiming) - TIMING_OPTIONS.indexOf(b.defaultTiming)
        return sortDir === 'asc' ? cmp : -cmp
      })
  }, [masterTasks, filterText, filterTiming, sortField, sortDir])

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-[#222b36]">Master Task List</h2>
          <p className="text-sm text-gray-500">{masterTasks.length} total tasks</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowFeedback(!showFeedback)}
            className="px-4 py-2 text-sm bg-white border border-gray-200 hover:border-[#0078d4] text-[#0078d4] font-medium rounded-lg transition-colors"
          >
            {showFeedback ? 'Hide' : 'View'} Feedback DB ({feedbackDb.length})
          </button>
          {feedbackDb.length > 0 && (
            <button
              onClick={() => exportFeedbackCSV(feedbackDb)}
              className="px-4 py-2 text-sm bg-white border border-gray-200 hover:border-[#00a562] text-[#00a562] font-medium rounded-lg transition-colors"
            >
              Export Feedback CSV
            </button>
          )}
        </div>
      </div>

      {/* Feedback DB */}
      {showFeedback && (
        <div className="mb-4 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
          <div className="px-4 py-3 bg-[#f4f4f4] border-b border-gray-100">
            <h3 className="text-sm font-semibold text-[#222b36]">Feedback Database</h3>
          </div>
          {feedbackDb.length === 0 ? (
            <p className="p-4 text-sm text-gray-400">No feedback entries yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#222b36] text-white">
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-left">Task #</th>
                    <th className="px-3 py-2 text-left">Timing</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbackDb
                    .slice(-50)
                    .reverse()
                    .map((entry, i) => (
                      <tr
                        key={i}
                        className={`border-t border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-[#f4f4f4]'}`}
                      >
                        <td className="px-3 py-1.5 text-gray-600">{entry.date}</td>
                        <td className="px-3 py-1.5 text-gray-500">{entry.taskNum}</td>
                        <td className="px-3 py-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${timingColor(entry.timing)}`}
                          >
                            {entry.timing}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search tasks…"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] bg-white w-56"
        />
        <select
          value={filterTiming}
          onChange={(e) => setFilterTiming(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] bg-white"
        >
          <option value="">All timings</option>
          {TIMING_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-400 self-center">
          {rows.length} of {masterTasks.length}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#222b36] text-white">
              <th
                className="px-3 py-3 text-left font-medium cursor-pointer select-none w-10"
                onClick={() => handleSort('taskNum')}
              >
                # <SortIcon field="taskNum" sortField={sortField} sortDir={sortDir} />
              </th>
              <th
                className="px-3 py-3 text-left font-medium cursor-pointer select-none"
                onClick={() => handleSort('task')}
              >
                Onboarding Task <SortIcon field="task" sortField={sortField} sortDir={sortDir} />
              </th>
              <th className="px-3 py-3 text-left font-medium">Why / Goal</th>
              <th className="px-3 py-3 text-left font-medium">Who / How</th>
              <th
                className="px-3 py-3 text-left font-medium cursor-pointer select-none whitespace-nowrap"
                onClick={() => handleSort('defaultTiming')}
              >
                Default Timing{' '}
                <SortIcon field="defaultTiming" sortField={sortField} sortDir={sortDir} />
              </th>
              <th className="px-3 py-3 text-left font-medium whitespace-nowrap">
                Software Developer
              </th>
              <th className="px-3 py-3 text-left font-medium whitespace-nowrap">Act. Analyst</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((task, idx) => (
              <tr
                key={task.taskNum}
                className={`border-t border-gray-50 transition-colors ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-[#f4f4f4]'
                } hover:bg-blue-50`}
              >
                <td className="px-3 py-2 text-gray-400 font-mono text-xs">{task.taskNum}</td>
                <td className="px-3 py-2 font-medium text-[#222b36] max-w-xs">{task.task}</td>
                <td className="px-3 py-2 text-gray-500 text-xs max-w-xs">{task.whyGoal}</td>
                <td className="px-3 py-2 text-gray-500 text-xs whitespace-nowrap">
                  {task.whoHow.link ? (
                    <WhoHowLink link={task.whoHow.link} text={task.whoHow.text} />
                  ) : (
                    task.whoHow.text
                  )}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${timingColor(task.defaultTiming)}`}
                  >
                    {task.defaultTiming}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${timingColor(task.softwareDeveloper)}`}
                  >
                    {task.softwareDeveloper}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${timingColor(task.actuarialAnalyst)}`}
                  >
                    {task.actuarialAnalyst}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            No tasks match your filters.
          </div>
        )}
      </div>
    </div>
  )
}
