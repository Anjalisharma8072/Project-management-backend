import { Project } from '../models/Project.js'
import { Task } from '../models/Task.js'
import { AppError } from '../utils/appError.js'
import { isActiveMember } from '../utils/projectMembership.js'

export const createTask = async (req, res, next) => {
  try {
    const project = await Project.findById(req.body.projectId)
    if (!project) throw new AppError('Project not found', 404)
    if (!isActiveMember(project, req.user._id)) throw new AppError('Forbidden', 403)
    if (!isActiveMember(project, req.body.assignedTo)) {
      throw new AppError('Assignee must be an active member of the project team', 400)
    }
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description || '',
      project: req.body.projectId,
      assignedTo: req.body.assignedTo,
      createdBy: req.user._id,
      status: req.body.status || 'pending',
      dueDate: new Date(req.body.dueDate)
    })
    res.status(201).json(task)
  } catch (err) {
    next(err)
  }
}

export const updateTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId)
    if (!task) throw new AppError('Task not found', 404)
    if (!task.assignedTo.equals(req.user._id) && req.user.role !== 'admin') throw new AppError('Forbidden', 403)
    if (req.user.role !== 'admin') {
      const project = await Project.findById(task.project)
      if (!project || !isActiveMember(project, req.user._id)) {
        throw new AppError('Your access to this project has been removed. Task updates are frozen.', 403)
      }
    }
    task.status = req.body.status
    await task.save()
    res.json(task)
  } catch (err) {
    next(err)
  }
}

export const listTasks = async (req, res, next) => {
  try {
    let tasks
    if (req.user.role === 'admin') {
      tasks = await Task.find({})
        .populate('project', 'name _id')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
    } else {
      const activeProjectIds = await Project.find({
        members: {
          $elemMatch: {
            user: req.user._id,
            $or: [{ status: { $exists: false } }, { status: 'active' }]
          }
        }
      }).distinct('_id')
      tasks = await Task.find({
        assignedTo: req.user._id,
        project: { $in: activeProjectIds }
      })
        .populate('project', 'name _id')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
    }
    res.json(tasks)
  } catch (err) {
    next(err)
  }
}

export const dashboard = async (req, res, next) => {
  try {
    let tasks
    if (req.user.role === 'admin') {
      tasks = await Task.find({})
    } else {
      const activeProjectIds = await Project.find({
        members: {
          $elemMatch: {
            user: req.user._id,
            $or: [{ status: { $exists: false } }, { status: 'active' }]
          }
        }
      }).distinct('_id')
      tasks = await Task.find({
        assignedTo: req.user._id,
        project: { $in: activeProjectIds }
      })
    }
    const now = new Date()
    const status = { pending: 0, in_progress: 0, completed: 0 }
    let overdue = 0
    tasks.forEach(task => {
      if (status[task.status] !== undefined) status[task.status] += 1
      if (task.status !== 'completed' && task.dueDate < now) overdue += 1
    })
    res.json({ totalTasks: tasks.length, status, overdue })
  } catch (err) {
    next(err)
  }
}
