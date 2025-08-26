import { relations, sql } from 'drizzle-orm'
import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  varchar,
  integer
} from 'drizzle-orm/pg-core'

export const role = pgEnum('role', ['member', 'admin'])

export type Role = (typeof role.enumValues)[number]

export const sectionUnitCharges = [
  'cost_revenue',
  'wdv-b/fwd',
  'w/off',
  "dep'n_period_charge"
] as const
export type SectionUnitCharge = (typeof sectionUnitCharges)[number]
export const sectionUnitChargeEnum = pgEnum(
  'section_unit_charge',
  sectionUnitCharges
)

export const entity_typeEnum = pgEnum('entity_type', [
  'unassigned',
  'sole_trader',
  'partnership',
  'small_limited_company',
  'medium_limited_company'
])

// export type EntityType = (typeof entity_type.enumValues)[number]

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
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'restrict' }),
  entity_type: entity_typeEnum('entity_type').notNull().default('unassigned'),
  owner: varchar('owner').notNull(),
  notes: text('notes'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
})

export const ClientRelationships = relations(clients, ({ many, one }) => ({
  accountinPeriods: many(accountsPeriod),
  user: one(user, {
    fields: [clients.userId],
    references: [user.id]
  })
}))

// Once created a client can have many accounting periods
export type SelectClient = typeof clients.$inferSelect

//Creating a client
export type InsertClient = typeof clients.$inferInsert

export const accountsPeriod = pgTable('accounts_period', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  clientId: text('customer_id')
    .notNull()
    .references(() => clients.id),
  periodNumeric: varchar('period_numeric').notNull(),
  periodEnding: varchar('period_ending').notNull(),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
})

export type AccountingPeriod = typeof accountsPeriod.$inferSelect

export const accountsPeriodRelations = relations(
  accountsPeriod,
  ({ one, many }) => ({
    client: one(clients, {
      fields: [accountsPeriod.clientId],
      references: [clients.id]
    }),
    accountsSections: many(accountsSection)
  })
)

// export const clientAccountsPeriodTable = pgTable('client_period', {
//   clientId: text()
//     .notNull()
//     .references(() => clients.id, { onDelete: 'restrict' }),

//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   updatedAt: timestamp('updated_at')
//     .notNull()
//     .defaultNow()
//     .$onUpdate(() => new Date())
// })

// export const clientAccountsPeriodRelationships = relations(
//   clientAccountsPeriodTable,
//   ({ one, many }) => ({
//     client: one(clients, {
//       fields: [clientAccountsPeriodTable.clientId],
//       references: [clients.id]
//     }),
//     accountsPeriods: many(accountsPeriod)
//   })
// )

export const accountsSection = pgTable('accounts_section', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  accountsPeriodId: text()
    .notNull()
    .references(() => accountsPeriod.id, { onDelete: 'restrict' }),
  name: varchar('name'),
  category: varchar('category').notNull(),
  description: varchar('name'),
  amount: integer('amount').notNull(),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
})

export type AccountsSection = typeof accountsSection.$inferSelect

export const accountsSectionRelationships = relations(
  accountsSection,
  ({ many, one }) => ({
    accountsPeriod: one(accountsPeriod, {
      fields: [accountsSection.accountsPeriodId],
      references: [accountsPeriod.id]
    }),
    section_breakdown: many(sectionBreakdown)
  })
)

export const accountsPeriodSectionTable = pgTable('accounts_period_section', {
  accountsPeriodId: text()
    .notNull()
    .references(() => accountsPeriod.id, { onDelete: 'restrict' }),
  accountsSectionId: text()
    .notNull()
    .references(() => accountsSection.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
})

export const accountsPeriodSectionRelationships = relations(
  accountsPeriodSectionTable,
  ({ one }) => ({
    accountsPeriod: one(accountsPeriod, {
      fields: [accountsPeriodSectionTable.accountsPeriodId],
      references: [accountsPeriod.id]
    }),
    accountsSection: one(accountsSection, {
      fields: [accountsPeriodSectionTable.accountsSectionId],
      references: [accountsSection.id]
    })
  })
)

export const sectionBreakdown = pgTable('section_breakdown', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text().notNull(),
  amount: integer('amount').notNull(),
  description: text(),
  sectionId: text()
    .notNull()
    .references(() => accountsSection.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
})

export type SectionBreakdown = typeof sectionBreakdown.$inferSelect

export const sectionBrakdownRelationships = relations(
  sectionBreakdown,
  ({ one }) => ({
    section: one(accountsSection, {
      fields: [sectionBreakdown.sectionId],
      references: [accountsSection.id]
    })
  })
)
export const sectionUnit = pgTable('section_unit', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  chargeDetails: sectionUnitChargeEnum().notNull().default('cost_revenue'),
  AmountInPounds: integer('value').notNull(),
  description: text(),
  sectionBreakdownId: text()
    .notNull()
    .references(() => sectionBreakdown.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
})

export type SectionUnit = typeof sectionUnit.$inferSelect

export const sectionUnitRelationships = relations(sectionUnit, ({ one }) => ({
  section: one(sectionBreakdown, {
    fields: [sectionUnit.sectionBreakdownId],
    references: [sectionBreakdown.id]
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
  accountsPeriodRelations,
  // clientAccountsPeriodTable,
  // clientAccountsPeriodRelationships,
  accountsSection,
  accountsSectionRelationships,
  accountsPeriodSectionTable,
  accountsPeriodSectionRelationships,
  sectionBreakdown,
  sectionBrakdownRelationships,
  sectionUnit,
  sectionUnitRelationships,
  organization,
  member,
  invitation,
  organizationRelations,
  memberRelations
}
