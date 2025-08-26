'use server'

import { db } from '@/db'
import { clients, InsertClient } from '@/db/schema'
import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

export const createClient = async (values: InsertClient) => {
  console.log(values)
  try {
    await db.insert(clients).values(values)
    return { success: true, message: 'Client created successfully' }
  } catch {
    return { success: false, message: 'Failed to create client' }
  }
}

export const getAllClients = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    const userId = session?.user?.id

    if (!userId) {
      return { success: false, message: 'User not found' }
    }

    const clientsByUser = await db.query.clients.findMany({
      where: eq(clients.userId, userId)
      // with: {
      //   accountinPeriods: true
      // }
    })

    return { success: true, clients: clientsByUser }
  } catch {
    return { success: false, message: 'Failed to get clients' }
  }
}
