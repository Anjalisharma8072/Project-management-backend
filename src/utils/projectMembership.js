const sameUser = (memberUserRef, userId) => String(memberUserRef?._id ?? memberUserRef) === String(userId)

/** Treat missing status as active (legacy documents). */
export const isActiveMember = (project, userId) =>
  project.members.some(m => sameUser(m.user, userId) && (!m.status || m.status === 'active'))

export const findMemberEntry = (project, userId) => project.members.find(m => sameUser(m.user, userId))
