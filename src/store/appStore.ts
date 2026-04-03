import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MASTER_TASKS, ROLE_PATHWAYS } from '../data/masterList'
import type { MasterTask, TimingKey } from '../data/masterList'

export type Tab = 'supervisor' | 'checklist' | 'output' | 'master'

export interface EmployeeInfo {
  name: string
  jobCode: string
  startDate: string
  supervisor: string
  peerGuide: string
  selectedPathway: string // job code like ACTU0009
  level: string
}

export interface TaskAssignment {
  taskNum: number
  customTiming: string
  included: boolean
}

export interface FeedbackEntry {
  date: string
  jobCode: string
  taskNum: number
  timing: string
}

interface AppState {
  activeTab: Tab
  employeeInfo: EmployeeInfo
  tasks: MasterTask[]
  assignments: TaskAssignment[]
  feedbackDb: FeedbackEntry[]
  isExporting: boolean

  setActiveTab: (tab: Tab) => void
  setEmployeeInfo: (info: Partial<EmployeeInfo>) => void
  initializeAssignments: () => void
  updateAssignment: (taskNum: number, timing: string) => void
  toggleTaskIncluded: (taskNum: number, included: boolean) => void
  addTask: (task: Omit<MasterTask, 'taskNum'>) => void
  exportAndRecord: () => void
  setIsExporting: (v: boolean) => void
}

function getDefaultTimingForPathway(task: MasterTask, pathwayJobCode: string): string {
  const roleColumn = ROLE_PATHWAYS[pathwayJobCode]
  if (!roleColumn) return task.defaultTiming
  if (roleColumn === 'Actuarial Analyst') return task.actuarialAnalyst
  if (roleColumn === 'Software Developer') return task.softwareDeveloper
  return task.defaultTiming
}

const FEEDBACK_STORAGE_KEY = 'onboarding-feedback-db'

function loadFeedback(): FeedbackEntry[] {
  try {
    const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveFeedback(entries: FeedbackEntry[]) {
  localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(entries))
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeTab: 'supervisor',
      employeeInfo: {
        name: '',
        jobCode: '',
        startDate: '',
        supervisor: '',
        peerGuide: '',
        selectedPathway: '',
        level: '1i',
      },
      tasks: MASTER_TASKS,
      assignments: [],
      feedbackDb: loadFeedback(),
      isExporting: false,

      setActiveTab: (tab) => set({ activeTab: tab }),

      setEmployeeInfo: (info) =>
        set((state) => ({ employeeInfo: { ...state.employeeInfo, ...info } })),

      initializeAssignments: () => {
        const { employeeInfo, tasks } = get()
        const assignments: TaskAssignment[] = tasks.map((task) => {
          const timing = getDefaultTimingForPathway(task, employeeInfo.selectedPathway)
          return {
            taskNum: task.taskNum,
            customTiming: timing,
            included: timing !== 'Exclude',
          }
        })
        set({ assignments })
      },

      updateAssignment: (taskNum, timing) =>
        set((state) => ({
          assignments: state.assignments.map((a) =>
            a.taskNum === taskNum
              ? { ...a, customTiming: timing, included: timing !== 'Exclude' }
              : a,
          ),
        })),

      toggleTaskIncluded: (taskNum, included) =>
        set((state) => ({
          assignments: state.assignments.map((a) =>
            a.taskNum === taskNum ? { ...a, included } : a,
          ),
        })),

      addTask: (taskData) =>
        set((state) => {
          const maxNum = Math.max(...state.tasks.map((t) => t.taskNum), 0)
          const newTask: MasterTask = { taskNum: maxNum + 1, ...taskData }
          const newAssignment: TaskAssignment = {
            taskNum: newTask.taskNum,
            customTiming: newTask.defaultTiming,
            included: newTask.defaultTiming !== 'Exclude',
          }
          return {
            tasks: [...state.tasks, newTask],
            assignments: [...state.assignments, newAssignment],
          }
        }),

      exportAndRecord: () => {
        const { employeeInfo, assignments } = get()
        const today = new Date().toISOString().split('T')[0]
        const newEntries: FeedbackEntry[] = assignments
          .filter((a) => a.included)
          .map((a) => ({
            date: today,
            jobCode: employeeInfo.jobCode,
            taskNum: a.taskNum,
            timing: a.customTiming,
          }))
        const allFeedback = [...loadFeedback(), ...newEntries]
        saveFeedback(allFeedback)
        set({ feedbackDb: allFeedback })
      },

      setIsExporting: (v) => set({ isExporting: v }),
    }),
    {
      name: 'onboarding-app-state',
      partialize: (state) => ({
        tasks: state.tasks,
      }),
    },
  ),
)

export function getTimingColumnKey(pathwayJobCode: string): TimingKey {
  const roleColumn = ROLE_PATHWAYS[pathwayJobCode]
  if (roleColumn === 'Actuarial Analyst') return 'actuarialAnalyst'
  if (roleColumn === 'Software Developer') return 'softwareDeveloper'
  return 'defaultTiming'
}
