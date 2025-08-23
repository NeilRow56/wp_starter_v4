'use client'

import { Button, buttonVariants } from '@/components/ui/button'

import Image from 'next/image'
import Link from 'next/link'

import { useSession } from '@/lib/auth-client'
import { UserDropdown } from './user-dropdown'
import { ModeToggle } from '@/components/mode-toggle'
import { APP_NAME } from '@/lib/constants'
// import { GetStartedButton } from '@/components/get-started'

interface navigationItemsProps {
  name: string
  href: string
}

const navigationItems: navigationItemsProps[] = [
  //   {
  //     name: 'Courses',
  //     href: '/courses'
  //   },
  {
    name: 'Dashboard',
    href: '/admin/dashboard'
  }
]

export function Navbar() {
  const { data: session, isPending } = useSession()
  return (
    <header className='bg-background/95 backdrop-blur-[backdrop-filter]:bg-background sticky top-0 z-50 w-full border-b'>
      <div className='container mx-auto flex min-h-16 items-center px-4 md:px-6 lg:px-8'>
        <Link href='/' className='mr-4 flex items-center space-x-2'>
          <Image
            src={'/logo.svg'}
            alt='logo'
            width={32}
            height={32}
            className='size-9'
          />
          <span className='font-bold'>{APP_NAME}</span>
        </Link>
        {/* Desktop navigation */}
        <nav className='hidden md:flex md:flex-1 md:items-center md:justify-between'>
          <div className='flex items-center gap-2'></div>
          <div className='flex items-center space-x-4'>
            <ModeToggle />

            {isPending ? null : session ? (
              <>
                {navigationItems.map(item => (
                  <Link
                    className='hover:text-primary text-sm font-medium text-blue-600 transition-colors'
                    href={item.href}
                    key={item.href}
                  >
                    {item.name}
                  </Link>
                ))}
                <UserDropdown
                  name={session.user.name}
                  email={session.user.email}
                  image={session.user.image || ''}
                />
              </>
            ) : (
              <>
                <Button
                  asChild
                  size='lg'
                  className='rounded-full bg-green-500 px-6 py-6 text-xl font-semibold text-white transition-all duration-200 hover:bg-green-500/70 md:px-8 md:py-2.5'
                >
                  <Link href='/auth/sign-up'>Join Now</Link>
                </Button>
                <Link
                  href='/auth/sign-in'
                  className={buttonVariants({
                    variant: 'secondary'
                  })}
                >
                  Login
                </Link>
                {/* <GetStartedButton /> */}
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
