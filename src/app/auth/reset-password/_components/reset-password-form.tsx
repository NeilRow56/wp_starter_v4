/* eslint-disable @next/next/no-img-element */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import { z } from 'zod/v4'
import { toast } from 'sonner'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import { useRouter, useSearchParams } from 'next/navigation'

import { APP_NAME } from '@/lib/constants'
import { resetPassword } from '@/lib/auth-client'

const formSchema = z.object({
  password: z.string().min(8, { error: 'Password should be >= 8 Characters ' }),
  confirmPassword: z.string().min(8)
})

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const token = searchParams.get('token') as string

  const [isPending, setPending] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setPending(true)

    if (values.password !== values.confirmPassword) {
      toast.error('Passwords do not match')
      setPending(false)
      return
    }

    const { error } = await resetPassword({
      newPassword: values.password,
      token
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Password reset successfully')
      router.push('/auth/sign-in')
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
                  <h1 className='text-2xl font-bold'>Reset Password</h1>
                  <p className='text-muted-foreground text-balance'>
                    Enter your new password
                  </p>
                </div>
                <div className='grid gap-6'>
                  <div className='grid gap-3'>
                    <FormField
                      control={form.control}
                      name='password'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input {...field} type='password' />
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
                            <Input {...field} type='password' />
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
                      'Reset Password'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
          <div className='relative hidden flex-col items-center justify-center gap-y-4 bg-radial from-green-700 to-green-900 md:flex'>
            <img src='/logo.svg' alt='image' className='h-[92px] w-[92px]' />
            <p className='text-2xl font-semibold text-white'>{APP_NAME}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
