import { ReturnButton } from '@/components/return-button'
import { SignOutButton } from '@/components/sign-out-button'
import { Button } from '@/components/ui/button'
import { ChangePasswordForm } from '@/components/users/change-password-form'
import { UpdateUserForm } from '@/components/users/update-user-form'
import { auth } from '@/lib/auth'
import { ArrowLeftIcon } from 'lucide-react'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) redirect('/auth/sign-in')

  const role = session.user.role

  const FULL_POST_ACCESS = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permissions: {
        employees: ['create', 'read', 'update', 'delete']
      }
    }
  })

  return (
    <div className='container mx-auto max-w-screen-lg space-y-8 px-8 py-16'>
      <div className='space-y-4'>
        <Button size='icon' asChild>
          <Link href='/' className='w-[90px] p-1'>
            <ArrowLeftIcon />
            <span> Home</span>
          </Link>
        </Button>
        <h1 className='text-3xl font-bold'>Profile</h1>
        <div className='flex items-center gap-2'>
          {session.user.role === 'admin' && (
            <Button size='sm' asChild>
              <Link href='/admin/dashboard'>Admin Dashboard</Link>
            </Button>
          )}

          <SignOutButton />
          <div>
            {session.user.email === 'admin@wpaccpac.org' ? (
              <div className='px-8'>
                <div className='space-y-4'>
                  <ReturnButton
                    href='/protected'
                    label='Protected User Information'
                  />
                </div>
              </div>
            ) : (
              <div className='container mx-auto max-w-screen-lg space-y-8 px-8 py-16'>
                <span></span>
              </div>
            )}
          </div>
        </div>

        <h2 className='text-2xl font-bold'>Permissions</h2>

        <div className='space-x-4'>
          <Button
            size='sm'
            asChild
            disabled={!FULL_POST_ACCESS.success}
            className='cursor-pointer'
          >
            <Link href='/admin/employees'>Manage employees</Link>
          </Button>
        </div>

        {session.user.image ? (
          <Image
            src={session.user.image}
            width={96}
            height={96}
            alt='User Image'
            className='border-primary size-24 rounded-md border object-cover'
          />
        ) : (
          <div className='border-primary bg-primary text-primary-foreground flex size-24 items-center justify-center rounded-md border'>
            <span className='text-lg font-bold uppercase'>
              {session.user.name.slice(0, 2)}
            </span>
          </div>
        )}

        <pre className='overflow-clip text-sm'>
          {JSON.stringify(session, null, 2)}
        </pre>
        <div className='space-y-4 rounded-b-md border border-t-8 border-blue-600 p-4'>
          <h2 className='text-2xl font-bold'>Update User</h2>
          <UpdateUserForm
            name={session.user.name}
            image={session.user.image ?? ''}
          />
        </div>
        <div className='space-y-4 rounded-b-md border border-t-8 border-red-600 p-4'>
          <h2 className='text-2xl font-bold'>Change Password</h2>

          <ChangePasswordForm />
        </div>
      </div>
      <div>User Role: {role}</div>
    </div>
  )
}
