'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { toast } from 'sonner'
import { changePasswordAction } from '@/server/users'

export const ChangePasswordForm = () => {
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()
    const formData = new FormData(evt.target as HTMLFormElement)

    setIsPending(true)

    const { error } = await changePasswordAction(formData)

    if (error) {
      toast.error(error)
    } else {
      toast.success('Password changed successfully')
      ;(evt.target as HTMLFormElement).reset()
    }

    setIsPending(false)
  }

  return (
    <form onSubmit={handleSubmit} className='w-full max-w-sm space-y-4'>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='currentPassword'>Current Password</Label>
        <Input type='password' id='currentPassword' name='currentPassword' />
      </div>

      <div className='flex flex-col gap-2'>
        <Label htmlFor='newPassword'>New Password</Label>
        <Input type='password' id='newPassword' name='newPassword' />
      </div>

      <Button type='submit' disabled={isPending}>
        Change Password
      </Button>
    </form>
  )
}
