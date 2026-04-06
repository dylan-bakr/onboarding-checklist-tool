import { useState, useMemo, useRef } from 'react'
import { useAppStore } from '../store/appStore'
import { TIMING_OPTIONS } from '../data/masterList'
import AddTaskModal from './AddTaskModal'

const TIMING_ORDER = ['Day 1', 'Week 1', '30 Days', '60 Days', 'Exclude']

type SortField = 'taskNum' | 'task' | 'customTiming'
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

export default function CustomOnboardingChecklist() {
  const { tasks, assignments, updateAssignment, toggleTaskIncluded, setActiveTab, employeeInfo } =
    useAppStore()

  const [sortField, setSortField] = useState<SortField>('customTiming')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [filterTiming, setFilterTiming] = useState<string>('')
  const [filterText, setFilterText] = useState<string>('')
  const [showAddModal, setShowAddModal] = useState(false)
  const tableRef = useRef<HTMLTableElement>(null)

  const assignmentMap = useMemo(
    () => new Map(assignments.map((a) => [a.taskNum, a])),
    [assignments],
  )

  const rows = useMemo(() => {
    return tasks
      .map((task) => ({
        task,
        assignment: assignmentMap.get(task.taskNum) ?? {
          taskNum: task.taskNum,
          customTiming: task.defaultTiming,
          included: task.defaultTiming !== 'Exclude',
        },
      }))
      .filter(({ task, assignment }) => {
        const textMatch =
          !filterText ||
          task.task.toLowerCase().includes(filterText.toLowerCase()) ||
          task.whoHow.text.toLowerCase().includes(filterText.toLowerCase())
        const timingMatch = !filterTiming || assignment.customTiming === filterTiming
        return textMatch && timingMatch
      })
      .sort((a, b) => {
        let cmp = 0
        if (sortField === 'taskNum') cmp = a.task.taskNum - b.task.taskNum
        else if (sortField === 'task') cmp = a.task.task.localeCompare(b.task.task)
        else if (sortField === 'customTiming')
          cmp =
            TIMING_ORDER.indexOf(a.assignment.customTiming) -
            TIMING_ORDER.indexOf(b.assignment.customTiming)
        return sortDir === 'asc' ? cmp : -cmp
      })
  }, [tasks, assignmentMap, filterText, filterTiming, sortField, sortDir])

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortField(field)
      setSortDir('asc')
    }
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

  return (
    <div className="animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-[#222b36]">Custom Onboarding Checklist</h2>
          {employeeInfo.name && (
            <p className="text-sm text-gray-500">
              {employeeInfo.name}
              {employeeInfo.selectedPathway ? ` · ${employeeInfo.selectedPathway}` : ''}
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-sm bg-white border border-gray-200 hover:border-[#0078d4] text-[#0078d4] font-medium rounded-lg transition-colors"
          >
            + Add Task
          </button>
          <button
            onClick={() => setActiveTab('output')}
            className="px-4 py-2 text-sm bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Preview Output →
          </button>
        </div>
      </div>

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
          {rows.length} of {tasks.length} tasks
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm bg-white">
        <table ref={tableRef} className="w-full text-sm">
          <thead>
            <tr className="bg-[#222b36] text-white">
              <th className="px-3 py-3 text-left font-medium w-8">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={rows.every((r) => r.assignment.included)}
                  onChange={(e) =>
                    rows.forEach((r) => toggleTaskIncluded(r.task.taskNum, e.target.checked))
                  }
                />
              </th>
              <th
                className="px-3 py-3 text-left font-medium cursor-pointer select-none whitespace-nowrap"
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
              <th className="px-3 py-3 text-left font-medium whitespace-nowrap">Default Timing</th>
              <th
                className="px-3 py-3 text-left font-medium cursor-pointer select-none whitespace-nowrap"
                onClick={() => handleSort('customTiming')}
              >
                Custom Assignment{' '}
                <SortIcon field="customTiming" sortField={sortField} sortDir={sortDir} />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ task, assignment }, idx) => (
              <tr
                key={task.taskNum}
                className={`border-t border-gray-50 transition-colors ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-[#f4f4f4]'
                } ${!assignment.included ? 'opacity-50' : ''} hover:bg-blue-50`}
              >
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    className="rounded cursor-pointer"
                    checked={assignment.included}
                    onChange={(e) => toggleTaskIncluded(task.taskNum, e.target.checked)}
                  />
                </td>
                <td className="px-3 py-2 text-gray-400 font-mono text-xs">{task.taskNum}</td>
                <td className="px-3 py-2 font-medium text-[#222b36] max-w-xs">{task.task}</td>
                <td className="px-3 py-2 text-gray-500 max-w-xs text-xs">{task.whyGoal}</td>
                <td className="px-3 py-2 text-gray-500 text-xs whitespace-nowrap">
                  {task.whoHow.text}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${timingColor(task.defaultTiming)}`}
                  >
                    {task.defaultTiming}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <select
                    value={assignment.customTiming}
                    onChange={(e) => updateAssignment(task.taskNum, e.target.value)}
                    className={`px-2 py-1 rounded-lg border text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0078d4] transition-colors ${timingColor(assignment.customTiming)} border-transparent`}
                  >
                    {TIMING_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
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

      {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} />}
    </div>
  )
}
