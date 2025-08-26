'use client'

import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createClient } from '@/server/clients'
import { toast } from 'sonner'

import { useState } from 'react'
import { Loader2, PlusCircleIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { clientSchema } from '@/zod-schemas/client'

// const formSchema = z.object({
//   name: z.string().min(2).max(50)
// })

export const CreateClientButton = () => {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      owner: '',
      notes: ''
    }
  })

  async function onSubmit(values: z.infer<typeof clientSchema>) {
    try {
      setIsLoading(true)
      const userId = (await getSession()).data?.user.id

      if (!userId) {
        toast.error('You must be logged in to create a notebook')
        return
      }

      const response = await createClient({
        ...values,
        userId
      })
      if (response.success) {
        form.reset()
        toast.success('Client created successfully')
        router.refresh()
        setIsOpen(false)
      } else {
        toast.error(response.message)
      }
    } catch {
      toast.error('Failed to create client')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='w-max'>
          <PlusCircleIcon />
          <span>Create client</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Client Form</DialogTitle>
          <DialogDescription>Create a new client .</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='ABC Limited' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='owner'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fee Earner</FormLabel>
                  <FormControl>
                    <Input placeholder='John Doe' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder='Client information' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isLoading} type='submit'>
              {isLoading ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                'Create'
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
