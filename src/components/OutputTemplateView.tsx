import { useMemo } from 'react'
import { useAppStore } from '../store/appStore'
import { LEVEL_OPTIONS, TIMING_OPTIONS } from '../data/masterList'
import { generatePDF } from '../utils/pdfExport'
import WhoHowLink from './WhoHowLink'

const TIMING_ORDER = ['Day 1', 'Week 1', '30 Days', '60 Days', 'Exclude']

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

export default function OutputTemplateView() {
  const {
    employeeInfo,
    setEmployeeInfo,
    tasks,
    assignments,
    setActiveTab,
    exportAndRecord,
    setIsExporting,
    isExporting,
  } = useAppStore()

  const assignmentMap = useMemo(
    () => new Map(assignments.map((a) => [a.taskNum, a])),
    [assignments],
  )

  const includedRows = useMemo(
    () =>
      tasks
        .map((task) => ({
          task,
          assignment: assignmentMap.get(task.taskNum) ?? {
            taskNum: task.taskNum,
            customTiming: task.defaultTiming,
            included: task.defaultTiming !== 'Exclude',
          },
        }))
        .filter((r) => r.assignment.included)
        .sort(
          (a, b) =>
            TIMING_ORDER.indexOf(a.assignment.customTiming) -
            TIMING_ORDER.indexOf(b.assignment.customTiming),
        ),
    [tasks, assignmentMap],
  )

  const handleExport = async () => {
    setIsExporting(true)
    try {
      exportAndRecord()
      await generatePDF(tasks, assignments, employeeInfo)
    } finally {
      setIsExporting(false)
      document.location.reload()
    }
  }

  const formatDate = (d: string) => {
    if (!d) return '—'
    const [y, m, day] = d.split('-')
    return `${m}/${day}/${y}`
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-semibold text-[#222b36]">Output Template</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('checklist')}
            className="px-4 py-2 text-sm bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
          >
            ← Back to Checklist
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 text-sm bg-[#0078d4] hover:bg-[#006cbd] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Exporting…
              </>
            ) : (
              <>Export PDF</>
            )}
          </button>
        </div>
      </div>

      {/* Output card */}
      <div
        id="output-template"
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
      >
        {/* Employee header info */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-2 mb-6 text-sm">
          <div>
            <span className="font-semibold text-[#222b36]">Employee Name: </span>
            <span className="text-gray-700">{employeeInfo.name || '—'}</span>
          </div>
          <div>
            <span className="font-semibold text-[#222b36]">Employee Start Date: </span>
            <span className="text-gray-700">{formatDate(employeeInfo.startDate)}</span>
          </div>
          <div>
            <span className="font-semibold text-[#222b36]">Title: </span>
            <span className="text-gray-700">{employeeInfo.title || '—'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#222b36]">Level: </span>
            <select
              value={employeeInfo.level}
              onChange={(e) => setEmployeeInfo({ level: e.target.value })}
              className="px-2 py-0.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] bg-white"
            >
              {LEVEL_OPTIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className="font-semibold text-[#222b36]">Supervisor: </span>
            <span className="text-gray-700">{employeeInfo.supervisor || '—'}</span>
          </div>
          <div>
            <span className="font-semibold text-[#222b36]">Peer Guide: </span>
            <span className="text-gray-700">{employeeInfo.peerGuide || '—'}</span>
          </div>
        </div>

        <hr className="border-gray-100 mb-5" />

        {/* task count */}
        <p className="text-xs text-gray-400 mb-4">{includedRows.length} tasks included</p>

        {/* Timing legend */}
        <div className="flex flex-wrap gap-2 mb-4">
          {TIMING_OPTIONS.filter((t) => t !== 'Exclude').map((t) => (
            <span
              key={t}
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${timingColor(t)}`}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#222b36] text-white">
                <th className="px-3 py-3 text-left font-medium w-10">#</th>
                <th className="px-3 py-3 text-left font-medium">Onboarding Task</th>
                <th className="px-3 py-3 text-left font-medium">Why / Goal</th>
                <th className="px-3 py-3 text-left font-medium">Who / How</th>
                <th className="px-3 py-3 text-left font-medium whitespace-nowrap">
                  Assigned Timing
                </th>
              </tr>
            </thead>
            <tbody>
              {includedRows.map(({ task, assignment }, idx) => (
                <tr
                  key={task.taskNum}
                  className={`border-t border-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#f4f4f4]'}`}
                >
                  <td className="px-3 py-2 text-gray-400 font-mono text-xs">{task.taskNum}</td>
                  <td className="px-3 py-2 font-medium text-[#222b36]">{task.task}</td>
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
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${timingColor(assignment.customTiming)}`}
                    >
                      {assignment.customTiming}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {includedRows.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">
              No tasks included. Go back to the checklist to select tasks.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
