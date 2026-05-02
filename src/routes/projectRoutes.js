import { Router } from 'express'
import { addMember, createProject, listProjects, removeMember } from '../controllers/projectController.js'
import { auth, allowRoles } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { addMemberSchema, createProjectSchema, removeMemberSchema } from '../validators/projectValidators.js'

const router = Router()

router.use(auth)
router.get('/', listProjects)
router.post('/', allowRoles('admin'), validate(createProjectSchema), createProject)
router.post('/:projectId/members', allowRoles('admin'), validate(addMemberSchema), addMember)
router.delete('/:projectId/members/:userId', allowRoles('admin'), validate(removeMemberSchema), removeMember)

export default router
