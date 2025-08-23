'use client'

import { Button } from '@/components/ui/button'

import Link from 'next/link'

import { useSession } from '@/lib/auth-client'
import { SignOutButton } from './sign-out-button'

export const GetStartedButton = () => {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <Button size='lg' className='opacity-50' asChild>
        <span>Get Started</span>
      </Button>
    )
  }

  const href = session ? '/admin/dashboard' : '/auth/sign-in'

  return (
    <div className='flex flex-col items-center gap-4'>
      <Button size='lg' asChild>
        <Link href={href}>Get Started</Link>
      </Button>

      {session && (
        <div className='mx-auto flex flex-col space-y-4'>
          <div className='flex items-center gap-6'>
            <span
              data-role={session.user.role}
              className='size-4 animate-pulse rounded-full data-[role=admin]:bg-red-600 data-[role=member]:bg-blue-600 data-[role=owner]:bg-green-600'
            />
            <p>Welcome back, {session.user.name}! 👋</p>
          </div>

          <SignOutButton />
        </div>
      )}
    </div>
  )
}
