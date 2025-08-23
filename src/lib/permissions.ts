import { createAccessControl } from 'better-auth/plugins/access'
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access'

const statements = {
  ...defaultStatements,
  employees: ['create', 'read', 'update', 'delete']
} as const

export const ac = createAccessControl(statements)

export const roles = {
  member: ac.newRole({
    employees: ['read']
  }),
  owner: ac.newRole({
    employees: ['read']
  }),

  admin: ac.newRole({
    employees: ['create', 'read', 'update', 'delete'],
    ...adminAc.statements
  })
}
