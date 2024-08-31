import { NotFoundError } from "blitz"
import db from "db"
import { authenticateUser } from "./login"
import { ChangePassword } from "../validations"
import { resolver } from "@blitzjs/rpc"
import { SecurePassword } from "@blitzjs/auth/secure-password"

export default resolver.pipe(
  resolver.zod(ChangePassword),
  resolver.authorize(),
  /**
   * Updates the user's password after authentication
   * @param {Object} params - The parameters object
   * @param {string} params.currentPassword - The user's current password
   * @param {string} params.newPassword - The new password to set
   * @param {Object} ctx - The context object containing session information
   * @returns {Promise<boolean>} Returns true if the password update is successful
   */
  async ({ currentPassword, newPassword }, ctx) => {
    const user = await db.user.findFirst({ where: { id: ctx.session.userId } })
    if (!user) throw new NotFoundError()
    await authenticateUser(user.email, currentPassword)
    const hashedPassword = await SecurePassword.hash(newPassword.trim())
    await db.user.update({
      where: { id: user.id },
      data: { hashedPassword },
    })

    return true
  }
)
