'use server'

import { db } from '@/db'
import { user } from '@/db/schema'
import { auth } from '@/lib/auth'
import { APIError } from 'better-auth/api'
import { asc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const getCurrentUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect('/auth/sign-in')
  }

  const currentUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id)
  })

  if (!currentUser) {
    redirect('/auth/sign-in')
  }

  return {
    ...session,
    currentUser
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password
      }
    })

    return {
      success: true,
      message: 'Signed in successfully.'
    }
  } catch (error) {
    const e = error as Error

    return {
      success: false,
      message: e.message || 'An unknown error occurred.'
    }
  }
}

export const signUp = async (email: string, password: string, name: string) => {
  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password
      }
    })

    return {
      success: true,
      message: 'Signed up successfully.'
    }
  } catch (error) {
    const e = error as Error

    return {
      success: false,
      message: e.message || 'An unknown error occurred.'
    }
  }
}

/* ADMIN QUERIES - THESE QUERIES REQUIRE ADMIN ACCESS */

export async function findAllUsers() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) redirect('/auth/sign-in')

  const allUsers = await db.select().from(user).orderBy(asc(user.name))

  return allUsers
}

export async function deleteUser(id: string) {
  const headersList = await headers()

  const session = await auth.api.getSession({
    headers: headersList
  })

  if (!session) throw new Error('Unauthorized')

  if (session.user.role !== 'admin' || session.user.id === id) {
    throw new Error('Forbidden operation')
  }

  try {
    await db.delete(user).where(eq(user.id, id))
  } catch (error) {
    console.error(error)
    return {
      error:
        'Failed to delete user. Admin users cannot be deleted. Users cannot delete themselves'
    }
  }

  revalidatePath('/admin/dashboard')
}
export async function changePasswordAction(formData: FormData) {
  const currentPassword = String(formData.get('currentPassword'))
  if (!currentPassword) return { error: 'Please enter your current password' }

  const newPassword = String(formData.get('newPassword'))
  if (!newPassword) return { error: 'Please enter your new password' }

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword,
        newPassword
      }
    })

    return { error: null }
  } catch (err) {
    if (err instanceof APIError) {
      return { error: err.message }
    }

    return { error: 'Internal Server Error' }
  }
}
