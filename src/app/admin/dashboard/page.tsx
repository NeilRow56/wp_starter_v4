import { ChartAreaInteractive } from '@/components/sidebar/chart-area-interactive'
import { DataTable } from '@/components/sidebar/data-table'
import { SectionCards } from '@/components/sidebar/section-cards'
import data from './data.json'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ReturnButton } from '@/components/return-button'

export default async function Page() {
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
            NOT AUTHORISED
          </p>
        </div>
      </div>
    )
  }
  return (
    <>
      <SectionCards />
      <div className='px-4 lg:px-6'>
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </>
  )
}
