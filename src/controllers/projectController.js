import { Project } from '../models/Project.js'
import { User } from '../models/User.js'
import { AppError } from '../utils/appError.js'
import { findMemberEntry, isActiveMember } from '../utils/projectMembership.js'

export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      description: req.body.description || '',
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }]
    })
    res.status(201).json(project)
  } catch (err) {
    next(err)
  }
}

export const addMember = async (req, res, next) => {
  try {
    const { projectId } = req.params
    const { userId, role } = req.body
    const project = await Project.findById(projectId)
    if (!project) throw new AppError('Project not found', 404)
    const user = await User.findById(userId)
    if (!user) throw new AppError('User not found', 404)
    const existing = findMemberEntry(project, userId)
    if (existing) {
      if (existing.status === 'removed') {
        existing.status = 'active'
        existing.removedAt = undefined
        existing.role = role
        await project.save()
        const updated = await Project.findById(projectId).populate('members.user', 'name email role')
        return res.json(updated)
      }
      throw new AppError('Member already added', 409)
    }
    project.members.push({ user: userId, role, status: 'active' })
    await project.save()
    const updated = await Project.findById(projectId).populate('members.user', 'name email role')
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

export const removeMember = async (req, res, next) => {
  try {
    const { projectId, userId } = req.params
    const project = await Project.findById(projectId)
    if (!project) throw new AppError('Project not found', 404)
    if (project.owner.equals(userId)) throw new AppError('Cannot remove project owner', 400)
    const member = findMemberEntry(project, userId)
    if (!member) throw new AppError('Member not in project', 404)
    if (member.status === 'removed') throw new AppError('Member already removed', 400)
    member.status = 'removed'
    member.removedAt = new Date()
    await project.save()
    const updated = await Project.findById(projectId).populate('members.user', 'name email role')
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

export const listProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ 'members.user': req.user._id })
      .populate('members.user', 'name email role')
      .lean()
    const payload = projects.map(p => ({
      ...p,
      myMembershipStatus: isActiveMember(p, req.user._id) ? 'active' : 'removed'
    }))
    res.json(payload)
  } catch (err) {
    next(err)
  }
}
