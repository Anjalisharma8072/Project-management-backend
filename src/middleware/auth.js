import { verifyToken } from '../services/tokenService.js'
import { User } from '../models/User.js'
import { AppError } from '../utils/appError.js'

export const auth = async (req, _res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) throw new AppError('Unauthorized', 401)
    const decoded = verifyToken(token)
    const user = await User.findById(decoded.userId).select('-password')
    if (!user) throw new AppError('Unauthorized', 401)
    req.user = user
    next()
  } catch {
    next(new AppError('Unauthorized', 401))
  }
}

export const allowRoles = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) return next(new AppError('Forbidden', 403))
  next()
}
