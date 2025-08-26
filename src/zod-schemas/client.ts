import { z } from 'zod/v4'

export const clientSchema = z.object({
  name: z.string().min(1, 'Name required'),
  owner: z.string().min(1, 'Fee earner required'),
  notes: z.string()
})

// import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
// import { clients } from '@/db/schema'

// export const insertClientSchema = createInsertSchema(clients, {
//   name: schema => schema.min(1, 'Name is required'),
//   owner: schema => schema.min(1, 'Fee earner name is required')
// })

// export const selectClientSchema = createSelectSchema(clients)

// export type insertClientSchemaType = typeof insertClientSchema

// export type selectClientSchemaType = typeof selectClientSchema
