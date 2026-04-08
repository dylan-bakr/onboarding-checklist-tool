import { create } from 'zustand'
import { MASTER_TASKS, PATHWAY_TITLES } from '../data/masterList'
import type { MasterTask } from '../data/masterList'

export type Tab = 'supervisor' | 'checklist' | 'output' | 'master'

export interface EmployeeInfo {
  name: string
  startDate: string
  supervisor: string
  peerGuide: string
  selectedPathway: string
  title: string
  level: string
}

export interface TaskAssignment {
  taskNum: number
  customTiming: string
  included: boolean
}

export interface FeedbackEntry {
  date: string
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

function getDefaultTimingForPathway(task: MasterTask, jobTitle: string): string {
  const timingKey = PATHWAY_TITLES[jobTitle]
  if (!timingKey) return task.defaultTiming
  return task[timingKey]
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

export const useAppStore = create<AppState>()((set, get) => ({
  activeTab: 'supervisor',
  employeeInfo: {
    name: '',
    startDate: '',
    supervisor: '',
    peerGuide: '',
    selectedPathway: '',
    title: '',
    level: '1i',
  },
  tasks: MASTER_TASKS,
  assignments: [],
  feedbackDb: loadFeedback(),
  isExporting: false,

  setActiveTab: (tab) => set({ activeTab: tab }),

  setEmployeeInfo: (info) => set((state) => ({ employeeInfo: { ...state.employeeInfo, ...info } })),

  initializeAssignments: () => {
    const { employeeInfo, tasks } = get()
    const assignments: TaskAssignment[] = tasks.map((task) => {
      const timing = getDefaultTimingForPathway(
        task,
        employeeInfo.selectedPathway || employeeInfo.title,
      )
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
        a.taskNum === taskNum ? { ...a, customTiming: timing, included: timing !== 'Exclude' } : a,
      ),
    })),

  toggleTaskIncluded: (taskNum, included) =>
    set((state) => ({
      assignments: state.assignments.map((a) => (a.taskNum === taskNum ? { ...a, included } : a)),
    })),

  addTask: (taskData) =>
    set((state) => {
      const maxNum = Math.max(...state.tasks.map((t) => t.taskNum), 0)
      const newTask: MasterTask = { taskNum: maxNum + 1, ephemeral: true, ...taskData }
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
    const { assignments } = get()
    const today = new Date().toISOString().split('T')[0]
    const newEntries: FeedbackEntry[] = assignments
      .filter((a) => a.included)
      .map((a) => ({
        date: today,
        taskNum: a.taskNum,
        timing: a.customTiming,
      }))
    const allFeedback = [...loadFeedback(), ...newEntries]
    saveFeedback(allFeedback)
    set({ feedbackDb: allFeedback })
  },

  setIsExporting: (v) => set({ isExporting: v }),
}))
