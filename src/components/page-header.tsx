import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export function PageHeader({
  title,
  children,
  className
}: {
  title: string
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn('mb-8 flex items-center justify-between gap-4', className)}
    >
      <h1 className='text-2xl font-semibold'>{title}</h1>
      {children && <div>{children}</div>}
    </div>
  )
}
