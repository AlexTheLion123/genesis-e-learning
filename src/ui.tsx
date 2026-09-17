import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { X } from 'lucide-react'
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'; size?: 'sm' | 'md' | 'lg' }) {
  return <button className={cn('inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold transition disabled:pointer-events-none disabled:opacity-45', size === 'sm' && 'h-9 px-3 text-sm', size === 'md' && 'h-11 px-4 text-sm', size === 'lg' && 'h-12 px-5', variant === 'primary' && 'bg-[var(--tenant-dark)] text-white hover:brightness-110', variant === 'secondary' && 'bg-[var(--tenant-accent)] text-[#162311] hover:brightness-95', variant === 'outline' && 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50', variant === 'ghost' && 'text-slate-600 hover:bg-slate-100', variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700', className)} {...props} />
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn('rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,.04)]', className)} {...props} /> }
export function Badge({ children, tone = 'neutral', className }: { children: ReactNode; tone?: 'neutral' | 'green' | 'amber' | 'red' | 'blue'; className?: string }) { return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', tone === 'neutral' && 'bg-slate-100 text-slate-650', tone === 'green' && 'bg-emerald-100 text-emerald-800', tone === 'amber' && 'bg-amber-100 text-amber-800', tone === 'red' && 'bg-red-100 text-red-700', tone === 'blue' && 'bg-blue-100 text-blue-800', className)}>{children}</span> }

export function Progress({ value, className }: { value: number; className?: string }) {
  return <ProgressPrimitive.Root aria-label={`${value}% complete`} value={value} className={cn('relative h-2 overflow-hidden rounded-full bg-slate-200', className)}><ProgressPrimitive.Indicator className="h-full rounded-full bg-[var(--tenant-accent)] transition-transform" style={{ transform: `translateX(-${100 - value}%)` }} /></ProgressPrimitive.Root>
}

export function Dialog({ open, onOpenChange, title, description, children }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; description?: string; children: ReactNode }) {
  return <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}><DialogPrimitive.Portal><DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-[2px]" /><DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(92vw,620px)] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"><div className="pr-9"><DialogPrimitive.Title className="text-xl font-bold text-slate-900">{title}</DialogPrimitive.Title>{description && <DialogPrimitive.Description className="mt-1 text-sm leading-6 text-slate-600">{description}</DialogPrimitive.Description>}</div>{children}<DialogPrimitive.Close aria-label="Close dialog" className="absolute right-5 top-5 rounded-md p-1 text-slate-500 hover:bg-slate-100"><X size={20} /></DialogPrimitive.Close></DialogPrimitive.Content></DialogPrimitive.Portal></DialogPrimitive.Root>
}

export const Tabs = TabsPrimitive.Root
export const TabsList = ({ className, ...props }: TabsPrimitive.TabsListProps) => <TabsPrimitive.List className={cn('inline-flex rounded-lg bg-slate-100 p-1', className)} {...props} />
export const TabsTrigger = ({ className, ...props }: TabsPrimitive.TabsTriggerProps) => <TabsPrimitive.Trigger className={cn('rounded-md px-4 py-2 text-sm font-semibold text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm', className)} {...props} />
export const TabsContent = TabsPrimitive.Content

export function PageTitle({ eyebrow, title, description, action, compact = false }: { eyebrow?: string; title: string; description?: string; action?: ReactNode; compact?: boolean }) {
  return <div className={cn('flex flex-col justify-between gap-4 sm:flex-row sm:items-end', compact ? 'mb-5' : 'mb-7')}><div>{eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-[var(--tenant-dark)]">{eyebrow}</p>}<h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>{description && <p className={cn('max-w-2xl text-sm leading-6 text-slate-600', compact ? 'mt-1' : 'mt-2')}>{description}</p>}</div>{action}</div>
}

export const inputClass = 'h-11 w-full rounded-[10px] border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--tenant-accent)] focus:outline-none'
