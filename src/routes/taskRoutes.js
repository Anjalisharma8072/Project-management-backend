import { Router } from 'express'
import { createTask, dashboard, listTasks, updateTaskStatus } from '../controllers/taskController.js'
import { auth, allowRoles } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { createTaskSchema, updateTaskStatusSchema } from '../validators/taskValidators.js'

const router = Router()

router.use(auth)
router.get('/', listTasks)
router.get('/dashboard', dashboard)
router.post('/', allowRoles('admin'), validate(createTaskSchema), createTask)
router.patch('/:taskId/status', validate(updateTaskStatusSchema), updateTaskStatus)

export default router
