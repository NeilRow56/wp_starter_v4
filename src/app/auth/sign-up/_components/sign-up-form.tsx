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

import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { APP_NAME } from '@/lib/constants'
import { signUp } from '@/server/users'

const formSchema = z
  .object({
    name: z.string().min(3, { error: 'Name should be >= 3 Characters ' }),
    email: z.email(),
    password: z
      .string()
      .min(8, { error: 'Password should be >= 8 Characters ' }),
    confirmPassword: z
      .string()
      .min(8, { error: 'Password should be >= 8 Characters ' })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })

export const SignUpForm = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  const router = useRouter()

  const [isPending, setPending] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setPending(true)

    const { success, message } = await signUp(
      values.email,
      values.password,
      values.name
    )

    if (success) {
      toast.success(
        `${message as string} Please check your email for verification.`
      )
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
                  <h1 className='text-2xl font-bold'>Welcome </h1>
                  <p className='text-muted-foreground text-balance'>
                    Create your account
                  </p>
                </div>
                <div className='grid gap-3'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type='text'
                            placeholder='e.g. John Doe'
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
                          <Input
                            type='password'
                            placeholder='********'
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
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type='password'
                            placeholder='********'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type='submit'
                  className='w-full cursor-pointer'
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className='size-4 animate-spin' />
                  ) : (
                    'Register'
                  )}
                </Button>
              </div>
              <div className='py-2 text-center text-sm'>
                Already have an account?{' '}
                <Link
                  href='/auth/sign-in'
                  className='text-blue-600 underline underline-offset-4'
                >
                  Sign in
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
