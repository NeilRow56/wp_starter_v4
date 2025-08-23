/* eslint-disable @next/next/no-img-element */
'use client'

import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import { Card, CardContent } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { signIn } from '@/server/users'
import { APP_NAME } from '@/lib/constants'

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(1, { error: 'Password is required ' })
})

export const SignInForm = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  const router = useRouter()

  const [isPending, setPending] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setPending(true)

    const { success, message } = await signIn(values.email, values.password)

    if (success) {
      toast.success(message as string)
      router.push('/')
    } else {
      toast.error(message as string)
    }

    setPending(false)
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='px-6 pt-6 pb-2 md:px-8 md:pt-8'
            >
              <div className='flex flex-col gap-6'>
                <div className='flex flex-col items-center text-center'>
                  <h1 className='text-2xl font-bold'>Welcome back</h1>
                  <p className='text-muted-foreground text-balance'>
                    Login to your account
                  </p>
                </div>
                <div className='grid gap-3'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type='email'
                            placeholder='e.g. m@example.com'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='grid gap-3'>
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder='********' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Link
                    href='/auth/forgot-password'
                    className='ml-auto text-sm text-blue-600 underline-offset-4 hover:underline'
                  >
                    <span className='dark:text-blue-300'>
                      Forgot your password?
                    </span>
                  </Link>
                </div>

                <Button
                  type='submit'
                  className='w-full cursor-pointer dark:bg-blue-600 dark:text-white'
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className='size-4 animate-spin' />
                  ) : (
                    'Login'
                  )}
                </Button>
              </div>
              <div className='py-2 text-center text-sm'>
                Don&apos;t have an account?{' '}
                <Link
                  href='/auth/sign-up'
                  className='drark:text-blue-300 text-blue-600 underline underline-offset-4'
                >
                  <span className='dark:text-blue-300'>Sign up</span>
                </Link>
              </div>
            </form>
          </Form>
          <div className='relative hidden flex-col items-center justify-center gap-y-4 bg-radial from-green-700 to-green-900 md:flex'>
            <img src='/logo.svg' alt='image' className='h-[92px] w-[92px]' />
            <p className='text-2xl font-semibold text-white'>{APP_NAME}</p>
          </div>
        </CardContent>
      </Card>
      <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
        By continuing, you agree to our <Link href='#'>Terms of Service</Link>{' '}
        and <Link href='#'>Privacy Policy</Link>.
      </div>
    </div>
  )
}
