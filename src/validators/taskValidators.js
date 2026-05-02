import { z } from 'zod'

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/)

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    description: z.string().optional().default(''),
    projectId: objectId,
    assignedTo: objectId,
    status: z.enum(['pending', 'in_progress', 'completed']).optional(),
    dueDate: z.string().datetime()
  }),
  params: z.object({}),
  query: z.object({})
})

export const updateTaskStatusSchema = z.object({
  body: z.object({ status: z.enum(['pending', 'in_progress', 'completed']) }),
  params: z.object({ taskId: objectId }),
  query: z.object({})
})
