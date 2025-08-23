import { ReturnButton } from '@/components/return-button'

import { auth } from '@/lib/auth'

import { headers } from 'next/headers'

import { redirect } from 'next/navigation'

export default async function AdminDashboardPage() {
  const headersList = await headers()

  const session = await auth.api.getSession({
    headers: headersList
  })
  if (!session) redirect('/auth/sign-in')

  if (session.user.role !== 'admin') {
    return (
      <div className='container mx-auto max-w-screen-lg space-y-8 px-8 py-16'>
        <div className='space-y-4'>
          <ReturnButton href='/profile' label='Profile' />

          <h1 className='text-3xl font-bold'>Admin Dashboard</h1>

          <p className='rounded-md bg-red-600 p-2 text-lg font-bold text-white'>
            FORBIDDEN
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto max-w-screen-lg space-y-8 px-8 py-16'>
      <div className='space-y-4'>
        <ReturnButton href='/profile' label='Profile' />

        <h1 className='text-3xl font-bold'>Admin Dashboard</h1>

        <p className='rounded-md bg-green-600 p-2 text-lg font-bold text-white'>
          ACCESS GRANTED
        </p>
      </div>

      <div className='w-full overflow-x-auto'>Employee Table</div>
    </div>
  )
}
