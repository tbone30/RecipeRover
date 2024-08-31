import { Ctx } from "blitz"
import db from "db"

/**
 * Retrieves the current authenticated user from the database
 * @param {null} _ - Unused parameter (placeholder)
 * @param {Ctx} ctx - Context object containing session information
 * @returns {Promise<Object|null>} User object with id, name, email, and role if authenticated, null otherwise
 */
export default async function getCurrentUser(_: null, ctx: Ctx) {
  if (!ctx.session.userId) return null
  const user = await db.user.findFirst({
    where: { id: ctx.session.userId },
    select: { id: true, name: true, email: true, role: true },
  })

  return user
}
