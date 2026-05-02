import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export const signToken = payload =>
  jwt.sign({ ...payload, userId: String(payload.userId) }, env.jwtSecret, { expiresIn: '7d' })
export const verifyToken = token => jwt.verify(token, env.jwtSecret)
