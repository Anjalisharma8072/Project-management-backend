import mongoose from 'mongoose'

const memberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    status: { type: String, enum: ['active', 'removed'], default: 'active' },
    removedAt: { type: Date }
  },
  { _id: false }
)

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: { type: [memberSchema], default: [] }
  },
  { timestamps: true }
)

export const Project = mongoose.model('Project', projectSchema)
