export type TenantId = 'acacia' | 'highland'
export type DemoRole = 'learner' | 'admin'
export type CourseCategory = 'Compliance' | 'Credit' | 'Risk' | 'Customer Service' | 'Onboarding' | 'Digital Banking'

export interface BankTenant {
  id: TenantId
  name: string
  shortName: string
  initials: string
  accent: string
  dark: string
  tagline: string
}

export interface User {
  id: string
  tenantId: TenantId
  name: string
  staffId: string
  email: string
  portalRole: DemoRole
  jobTitle: string
  grade: string
  branch: string
  region: string
  preferredLanguage: 'English' | 'Amharic'
  employmentStatus: 'Active' | 'Inactive'
  lastActive: string
}

export interface LessonVideo {
  youtubeId: string
  title: string
  author: string
  seconds: number
}

export interface CourseModule {
  id: string
  title: string
  duration: number
  kind: 'lesson' | 'assessment'
  content: string[]
  video?: LessonVideo
}

export interface QuizQuestion {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface Course {
  id: string
  tenantId?: TenantId
  title: string
  category: CourseCategory
  description: string
  audience: string
  languages: Array<'EN' | 'AM'>
  duration: number
  required: boolean
  passMark: number
  certificateAvailable: boolean
  objectives: string[]
  modules: CourseModule[]
  quiz?: QuizQuestion[]
}

export interface Assignment {
  id: string
  tenantId: TenantId
  courseId: string
  title: string
  required: boolean
  dueDate: string
  audienceType: 'Everyone' | 'Role' | 'Grade' | 'Branch' | 'Region'
  audienceValue?: string
  matchedEmployees: number
}

export interface ProgressRecord {
  tenantId: TenantId
  userId: string
  courseId: string
  percent: number
  completedModuleIds: string[]
  score?: number
  attempts: number
  status: 'Not started' | 'In progress' | 'Completed'
}

export interface Certificate {
  id: string
  tenantId: TenantId
  userId: string
  courseId: string
  issuedAt: string
  score: number
}

export interface AdminMetrics {
  tenantId: TenantId
  assignedEmployees: number
  completionRate: number
  overdue: number
  averageScore: number
  trend: Array<{ month: string; completion: number }>
  regions: Array<{ name: string; completion: number }>
}
