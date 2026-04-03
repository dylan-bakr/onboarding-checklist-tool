import { useState } from 'react'
import { useAppStore } from '../store/appStore'
import { ROLE_PATHWAYS } from '../data/masterList'

export default function SupervisorInterface() {
  const { employeeInfo, setEmployeeInfo, setActiveTab, initializeAssignments, tasks } =
    useAppStore()
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Dynamic pathway options based on roles that have job codes mapped
  const pathwayOptions = Object.entries(ROLE_PATHWAYS)

  // Also gather unique job codes from tasks that have role-specific columns
  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!employeeInfo.name.trim()) newErrors.name = 'Employee name is required'
    if (!employeeInfo.startDate) newErrors.startDate = 'Start date is required'
    if (!employeeInfo.supervisor.trim()) newErrors.supervisor = 'Supervisor is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleStart = () => {
    if (!validate()) return
    initializeAssignments()
    setActiveTab('checklist')
  }

  const inputClass =
    'w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent transition-shadow text-sm'
  const labelClass = 'block text-sm font-medium text-[#222b36] mb-1'
  const errorClass = 'text-xs text-red-500 mt-1'

  // count unique job codes in custom tasks
  void tasks

  return (
    <div className="animate-fade-in max-w-xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-semibold text-[#222b36] mb-1">New Employee Setup</h2>
        <p className="text-sm text-gray-500 mb-6">
          Fill in the details below to create a customized onboarding checklist.
        </p>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>
              Employee Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className={`${inputClass} ${errors.name ? 'border-red-400' : ''}`}
              placeholder="Enter new employee name"
              value={employeeInfo.name}
              onChange={(e) => setEmployeeInfo({ name: e.target.value })}
            />
            {errors.name && <p className={errorClass}>{errors.name}</p>}
          </div>

          <div>
            <label className={labelClass}>Employee Job Code</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. ACTU0009"
              value={employeeInfo.jobCode}
              onChange={(e) => setEmployeeInfo({ jobCode: e.target.value })}
            />
          </div>

          <div>
            <label className={labelClass}>
              Employee Start Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              className={`${inputClass} ${errors.startDate ? 'border-red-400' : ''}`}
              value={employeeInfo.startDate}
              onChange={(e) => setEmployeeInfo({ startDate: e.target.value })}
            />
            {errors.startDate && <p className={errorClass}>{errors.startDate}</p>}
          </div>

          <div>
            <label className={labelClass}>
              Supervisor <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className={`${inputClass} ${errors.supervisor ? 'border-red-400' : ''}`}
              placeholder="Supervisor name"
              value={employeeInfo.supervisor}
              onChange={(e) => setEmployeeInfo({ supervisor: e.target.value })}
            />
            {errors.supervisor && <p className={errorClass}>{errors.supervisor}</p>}
          </div>

          <div>
            <label className={labelClass}>Peer Guide</label>
            <input
              type="text"
              className={inputClass}
              placeholder="Peer guide name"
              value={employeeInfo.peerGuide}
              onChange={(e) => setEmployeeInfo({ peerGuide: e.target.value })}
            />
          </div>

          <div>
            <label className={labelClass}>View Defined Role Pathways</label>
            <select
              className={inputClass}
              value={employeeInfo.selectedPathway}
              onChange={(e) => setEmployeeInfo({ selectedPathway: e.target.value })}
            >
              <option value="">— Select a role pathway (optional) —</option>
              {pathwayOptions.map(([code, name]) => (
                <option key={code} value={code}>
                  {code} — {name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Pre-fills timing assignments based on the selected role's default pathway.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleStart}
            className="w-full py-3 px-6 bg-[#0078d4] hover:bg-[#006cbd] active:bg-[#005a9e] text-white font-semibold rounded-xl transition-colors duration-150 shadow-sm hover:shadow-md"
          >
            Start Customizing →
          </button>
        </div>
      </div>
    </div>
  )
}
