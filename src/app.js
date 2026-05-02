import cors from 'cors'
import express from 'express'
import authRoutes from './routes/authRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/tasks', taskRoutes)

app.use(errorHandler)

export default app
