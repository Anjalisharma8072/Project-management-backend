import { Router } from 'express'
import { searchUsers } from '../controllers/userController.js'
import { auth, allowRoles } from '../middleware/auth.js'

const router = Router()

router.use(auth, allowRoles('admin'))
router.get('/search', searchUsers)

export default router
