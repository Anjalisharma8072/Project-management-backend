import { AppError } from '../utils/appError.js'

export const validate = schema => (req, _res, next) => {
  const data = {
    body: req.body ?? {},
    params: req.params ?? {},
    query: req.query ?? {}
  }
  const parsed = schema.safeParse(data)
  if (!parsed.success) {
    return next(new AppError(parsed.error.issues[0]?.message || 'Validation error', 400))
  }
  req.body = parsed.data.body
  req.params = parsed.data.params
  req.query = parsed.data.query
  next()
}
