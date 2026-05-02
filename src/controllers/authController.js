import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { signToken } from '../services/tokenService.js'
import { AppError } from '../utils/appError.js'

const cleanUser = user => ({ id: String(user._id), name: user.name, email: user.email, role: user.role })

export const signup = async (req, res, next) => {
  try {
    const exists = await User.findOne({ email: req.body.email })
    if (exists) throw new AppError('Email already used', 409)
    const password = await bcrypt.hash(req.body.password, 10)
    const user = await User.create({ ...req.body, password })
    const token = signToken({ userId: user._id })
    res.status(201).json({ token, user: cleanUser(user) })
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: String(req.body.email || '').trim().toLowerCase() })
    if (!user) throw new AppError('This email is not registered. Sign up first.', 404)
    const valid = await bcrypt.compare(req.body.password, user.password)
    if (!valid) throw new AppError('Invalid credentials', 401)
    const token = signToken({ userId: user._id })
    res.json({ token, user: cleanUser(user) })
  } catch (err) {
    next(err)
  }
}
