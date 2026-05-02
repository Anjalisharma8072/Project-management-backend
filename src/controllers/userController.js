import { User } from '../models/User.js'

export const searchUsers = async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim().slice(0, 128)
    if (q.length < 2) return res.json([])
    const users = await User.find({
      email: { $regex: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }
    })
      .select('name email role')
      .limit(15)
      .lean()
    res.json(users.map(u => ({ id: String(u._id), name: u.name, email: u.email, role: u.role })))
  } catch (err) {
    next(err)
  }
}
