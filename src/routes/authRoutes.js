import { Router } from 'express'
import { login, signup } from '../controllers/authController.js'
import { validate } from '../middleware/validate.js'
import { loginSchema, signupSchema } from '../validators/authValidators.js'

const router = Router()

router.post('/signup', validate(signupSchema), signup)
router.post('/login', validate(loginSchema), login)

export default router
