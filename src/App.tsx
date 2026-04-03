import { useEffect } from 'react'
import { useAppStore } from './store/appStore'
import type { Tab } from './store/appStore'
import SupervisorInterface from './components/SupervisorInterface'
import CustomOnboardingChecklist from './components/CustomOnboardingChecklist'
import OutputTemplateView from './components/OutputTemplateView'
import MasterListView from './components/MasterListView'

const TABS: { id: Tab; label: string; description: string }[] = [
  { id: 'supervisor', label: 'Supervisor Interface', description: 'Set up new employee' },
  { id: 'checklist', label: 'Custom Onboarding Checklist', description: 'Customize task timing' },
  { id: 'output', label: 'Output Template', description: 'Preview & export' },
  { id: 'master', label: 'Master List', description: 'View all tasks' },
]

export default function App() {
  const { activeTab, setActiveTab, assignments } = useAppStore()

  // Show checklist/output tabs only if assignments exist
  const checklistEnabled = assignments.length > 0

  useEffect(() => {
    if (!checklistEnabled && (activeTab === 'checklist' || activeTab === 'output')) {
      setActiveTab('supervisor')
    }
  }, [checklistEnabled, activeTab, setActiveTab])

  const renderContent = () => {
    switch (activeTab) {
      case 'supervisor':
        return <SupervisorInterface />
      case 'checklist':
        return <CustomOnboardingChecklist />
      case 'output':
        return <OutputTemplateView />
      case 'master':
        return <MasterListView />
      default:
        return <SupervisorInterface />
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {/* Top nav bar */}
      <header className="bg-[#222b36] shadow-lg sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4 py-0">
          <div className="flex items-center gap-4">
            {/* Logo area */}
            <div className="py-3 pr-4 border-r border-white/10 flex-shrink-0">
              <span className="text-white font-bold text-lg tracking-tight">Milliman</span>
              <span className="text-[#50bdff] font-light text-lg"> Onboarding</span>
            </div>

            {/* Tabs */}
            <nav className="flex overflow-x-auto">
              {TABS.map((tab) => {
                const isDisabled =
                  !checklistEnabled && (tab.id === 'checklist' || tab.id === 'output')
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => !isDisabled && setActiveTab(tab.id)}
                    disabled={isDisabled}
                    title={isDisabled ? 'Complete the supervisor form first' : tab.description}
                    className={`
                      relative px-4 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-150
                      ${
                        isActive
                          ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0078d4]'
                          : isDisabled
                            ? 'text-white/25 cursor-not-allowed'
                            : 'text-white/60 hover:text-white/90'
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-screen-xl mx-auto px-4 py-8">{renderContent()}</main>
    </div>
  )
}
