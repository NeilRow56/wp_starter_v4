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

import { APP_NAME } from '@/lib/constants'
import { forgetPassword } from '@/lib/auth-client'

const formSchema = z.object({
  email: z.email()
})

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [isPending, setPending] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setPending(true)

    const { error } = await forgetPassword({
      email: values.email,
      redirectTo: '/auth/reset-password'
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Password reset email sent')
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
                  <h1 className='text-2xl font-bold'>Forgot Password</h1>
                  <p className='text-muted-foreground text-balance'>
                    Enter your email to reset your password
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
