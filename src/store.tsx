import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { initialAssignments, initialProgress, tenants, users } from './data'
import type { Assignment, Certificate, DemoRole, ProgressRecord, TenantId, User } from './types'

interface PersistedState {
  tenantId: TenantId | null
  role: DemoRole
  progress: ProgressRecord[]
  certificates: Certificate[]
  assignments: Assignment[]
  lowBandwidth: boolean
}

interface DemoContextValue extends PersistedState {
  currentUser: User | null
  signedIn: boolean
  selectTenant: (tenantId: TenantId) => void
  enterWorkspace: (tenantId: TenantId, role: DemoRole) => void
  switchRole: (role: DemoRole) => void
  signOut: () => void
  setLowBandwidth: (enabled: boolean) => void
  markModuleComplete: (courseId: string, moduleId: string, moduleCount: number) => void
  recordQuiz: (courseId: string, score: number, passMark: number, moduleIds: string[]) => void
  addAssignment: (assignment: Omit<Assignment, 'id' | 'tenantId'>) => void
}

const defaultState: PersistedState = {
  tenantId: null,
  role: 'learner',
  progress: initialProgress,
  certificates: [
    { id: 'CERT-ACA-84917', tenantId: 'acacia', userId: 'u-ac-1', courseId: 'acacia-policy', issuedAt: '2026-08-28', score: 90 },
  ],
  assignments: initialAssignments,
  lowBandwidth: false,
}

const storageKey = 'banking-learning-hub-demo'
const DemoContext = createContext<DemoContextValue | null>(null)

function loadState(): PersistedState {
  try {
    const value = localStorage.getItem(storageKey)
    return value ? { ...defaultState, ...JSON.parse(value) } : defaultState
  } catch {
    return defaultState
  }
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(loadState)
  const [signedIn, setSignedIn] = useState(() => Boolean(loadState().tenantId))

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state))
  }, [state])

  const currentUser = useMemo(() => {
    if (!state.tenantId) return null
    return users.find((user) => user.tenantId === state.tenantId && user.portalRole === state.role) ?? null
  }, [state.tenantId, state.role])

  const value: DemoContextValue = {
    ...state,
    currentUser,
    signedIn,
    selectTenant: (tenantId) => setState((current) => ({ ...current, tenantId })),
    enterWorkspace: (tenantId, role) => {
      setState((current) => ({ ...current, tenantId, role }))
      setSignedIn(true)
    },
    switchRole: (role) => setState((current) => ({ ...current, role })),
    signOut: () => {
      setSignedIn(false)
      setState((current) => ({ ...current, tenantId: null }))
    },
    setLowBandwidth: (lowBandwidth) => setState((current) => ({ ...current, lowBandwidth })),
    markModuleComplete: (courseId, moduleId, moduleCount) => {
      if (!currentUser || !state.tenantId) return
      setState((current) => {
        const existing = current.progress.find((record) => record.userId === currentUser.id && record.courseId === courseId)
        const completed = Array.from(new Set([...(existing?.completedModuleIds ?? []), moduleId]))
        const percent = Math.min(100, Math.round((completed.length / moduleCount) * 100))
        const updated: ProgressRecord = { tenantId: state.tenantId!, userId: currentUser.id, courseId, percent, completedModuleIds: completed, attempts: existing?.attempts ?? 0, score: existing?.score, status: percent === 100 ? 'Completed' : 'In progress' }
        return { ...current, progress: [...current.progress.filter((record) => !(record.userId === currentUser.id && record.courseId === courseId)), updated] }
      })
    },
    recordQuiz: (courseId, score, passMark, moduleIds) => {
      if (!currentUser || !state.tenantId) return
      setState((current) => {
        const existing = current.progress.find((record) => record.userId === currentUser.id && record.courseId === courseId)
        const passed = score >= passMark
        const completed = passed ? moduleIds : existing?.completedModuleIds ?? []
        const updated: ProgressRecord = { tenantId: state.tenantId!, userId: currentUser.id, courseId, percent: passed ? 100 : existing?.percent ?? 0, completedModuleIds: completed, score, attempts: (existing?.attempts ?? 0) + 1, status: passed ? 'Completed' : existing?.status ?? 'In progress' }
        const hasCertificate = current.certificates.some((certificate) => certificate.userId === currentUser.id && certificate.courseId === courseId)
        const certificate: Certificate | null = passed && !hasCertificate ? { id: `CERT-${state.tenantId!.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-5)}`, tenantId: state.tenantId!, userId: currentUser.id, courseId, issuedAt: new Date().toISOString().slice(0, 10), score } : null
        return { ...current, progress: [...current.progress.filter((record) => !(record.userId === currentUser.id && record.courseId === courseId)), updated], certificates: certificate ? [...current.certificates, certificate] : current.certificates }
      })
    },
    addAssignment: (assignment) => {
      if (!state.tenantId) return
      setState((current) => ({ ...current, assignments: [...current.assignments, { ...assignment, id: `as-${Date.now()}`, tenantId: state.tenantId! }] }))
    },
  }

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (!context) throw new Error('useDemo must be used inside DemoProvider')
  return context
}

export function useTenant() {
  const { tenantId } = useDemo()
  return tenants.find((tenant) => tenant.id === tenantId) ?? tenants[0]
}
