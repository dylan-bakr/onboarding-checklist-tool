import { useState } from 'react'
import { useAppStore } from '../store/appStore'
import { TIMING_OPTIONS } from '../data/masterList'
import type { MasterTask } from '../data/masterList'

interface Props {
  onClose: () => void
  taskToEdit?: MasterTask
}

export default function AddTaskModal({ onClose, taskToEdit }: Props) {
  const { addTask, updateTask } = useAppStore()
  const isEditMode = taskToEdit !== undefined
  const [form, setForm] = useState({
    task: taskToEdit?.task ?? '',
    whyGoal: taskToEdit?.whyGoal ?? '',
    whoHowText: taskToEdit?.whoHow.text ?? '',
    whoHowLink: taskToEdit?.whoHow.link ?? '',
    timing: taskToEdit?.defaultTiming ?? 'Week 1',
  })
  const [showLinkInput, setShowLinkInput] = useState(
    isEditMode && taskToEdit?.whoHow.link !== null && taskToEdit?.whoHow.link !== '',
  )
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!form.task.trim()) {
      setError('Task name is required.')
      return
    }
    const taskData = {
      task: form.task,
      whyGoal: form.whyGoal,
      whoHow: { text: form.whoHowText, link: form.whoHowLink.trim() || null },
      defaultTiming: form.timing,
      softwareDeveloper: form.timing,
      actuarialAnalyst: form.timing,
    }
    if (isEditMode) {
      updateTask(taskToEdit.taskNum, taskData)
    } else {
      addTask(taskData)
    }
    onClose()
  }

  const inputClass =
    'w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] text-sm'
  const labelClass = 'block text-xs font-medium text-gray-600 mb-1'

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#222b36]">
            {isEditMode ? 'Edit Task' : 'Add New Task'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className={labelClass}>
              Task Name <span className="text-red-400">*</span>
            </label>
            <input
              className={inputClass}
              placeholder="Task name"
              value={form.task}
              onChange={(e) => setForm({ ...form, task: e.target.value })}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          <div>
            <label className={labelClass}>Why / Goal</label>
            <input
              className={inputClass}
              placeholder="Purpose or goal"
              value={form.whyGoal}
              onChange={(e) => setForm({ ...form, whyGoal: e.target.value })}
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs font-medium text-gray-600">Who / How</span>
              <button
                type="button"
                onClick={() => setShowLinkInput((v) => !v)}
                title={showLinkInput ? 'Remove link' : 'Add link'}
                className={`leading-none text-base transition-colors ${showLinkInput ? 'text-[#0078d4]' : 'text-gray-400 hover:text-[#0078d4]'} cursor-pointer`}
              >
                🔗
              </button>
            </div>
            {showLinkInput && <label className={labelClass}>text</label>}
            <input
              className={inputClass}
              placeholder="Resource or person"
              value={form.whoHowText}
              onChange={(e) => setForm({ ...form, whoHowText: e.target.value })}
            />
            {showLinkInput && (
              <div className="mt-2">
                <label className={labelClass}>link</label>
                <input
                  className={inputClass}
                  placeholder="https:// or S:\path\to\file"
                  value={form.whoHowLink}
                  onChange={(e) => setForm({ ...form, whoHowLink: e.target.value })}
                />
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>Timing</label>
            <select
              className={[inputClass, 'cursor-pointer'].join(' ')}
              value={form.timing}
              onChange={(e) => setForm({ ...form, timing: e.target.value })}
            >
              {TIMING_OPTIONS.filter((t) => t !== 'Exclude').map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 bg-[#0078d4] hover:bg-[#006cbd] text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
          >
            {isEditMode ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </div>
    </div>
  )
}
