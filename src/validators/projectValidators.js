import { z } from 'zod'

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/)

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().optional().default('')
  }),
  params: z.object({}),
  query: z.object({})
})

export const addMemberSchema = z.object({
  body: z.object({
    userId: objectId,
    role: z.enum(['admin', 'member']).default('member')
  }),
  params: z.object({ projectId: objectId }),
  query: z.object({})
})

export const removeMemberSchema = z.object({
  body: z.object({}),
  params: z.object({ projectId: objectId, userId: objectId }),
  query: z.object({})
})
