import { relations, sql } from 'drizzle-orm'
import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  varchar
} from 'drizzle-orm/pg-core'

export const role = pgEnum('role', ['member', 'admin'])

export type Role = (typeof role.enumValues)[number]

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: role('role').default('admin').notNull(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull()
})

export type User = typeof user.$inferSelect

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' })
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp('updated_at').$defaultFn(
    () => /* @__PURE__ */ new Date()
  )
})

export const clients = pgTable('clients', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar('name').notNull(),
  owner: varchar('owner').notNull(),
  notes: text('notes'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
})

export const accountsPeriod = pgTable('accounts_period', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  clientId: text('client_id')
    .notNull()
    .references(() => clients.id),
  debtorId: text('debtor_id')
    .notNull()
    .references(() => debtors.id),
  periodHeading: varchar('period_heading').notNull(),
  periodEnding: varchar('period_ending').notNull(),
  completed: boolean('completed').notNull().default(false),
  member: varchar('member').notNull().default('unassigned'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
})

// Create relations
export const clientsRelations = relations(clients, ({ many }) => ({
  accountsPeriod: many(accountsPeriod)
}))

export const accountsPeriodRelations = relations(accountsPeriod, ({ one }) => ({
  client: one(clients, {
    fields: [accountsPeriod.clientId],
    references: [clients.id]
  }),
  debtors: one(debtors, {
    fields: [accountsPeriod.debtorId],
    references: [debtors.id]
  })
}))

export const debtors = pgTable('debtors', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  accountsPeriodId: text('accounts_period_id')
    .notNull()
    .references(() => clients.id),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
})

// Create relations

export const debtorsRelations = relations(accountsPeriod, ({ one }) => ({
  client: one(clients, {
    fields: [accountsPeriod.clientId],
    references: [clients.id]
  })
}))

export const organization = pgTable('organization', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique(),
  logo: text('logo'),
  createdAt: timestamp('created_at').notNull(),
  metadata: text('metadata')
})

export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member)
}))

export type Organization = typeof organization.$inferSelect

export const member = pgTable('member', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  role: role('role').default('member').notNull(),
  createdAt: timestamp('created_at').notNull()
})

export const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id]
  }),
  user: one(user, {
    fields: [member.userId],
    references: [user.id]
  })
}))

export type Member = typeof member.$inferSelect & {
  user: typeof user.$inferSelect
}

export const invitation = pgTable('invitation', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: role('role'),
  status: text('status').default('pending').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  inviterId: text('inviter_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' })
})

export const schema = {
  user,
  session,
  account,
  verification,
  clients,
  accountsPeriod,
  clientsRelations,
  accountsPeriodRelations,
  organization,
  member,
  invitation,
  organizationRelations,
  memberRelations,
  debtors,
  debtorsRelations
}
