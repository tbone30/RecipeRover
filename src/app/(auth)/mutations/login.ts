import { resolver } from "@blitzjs/rpc"
import { AuthenticationError } from "blitz"
import db from "db"
import { Login } from "../validations"
import { SecurePassword } from "@blitzjs/auth/secure-password"
import { Role } from "types"

/**
 * Authenticates a user based on their email and password.
 * @param {string} rawEmail - The user's email address.
 * @param {string} rawPassword - The user's password.
 * @returns {Promise<Object>} A promise that resolves to the user object without the hashed password.
 * @throws {AuthenticationError} If the user is not found or the password is invalid.
 */
export const authenticateUser = async (rawEmail: string, rawPassword: string) => {
  const { email, password } = Login.parse({ email: rawEmail, password: rawPassword })
  const user = await db.user.findFirst({ where: { email } })
  if (!user) throw new AuthenticationError()

  const result = await SecurePassword.verify(user.hashedPassword, password)

  if (result === SecurePassword.VALID_NEEDS_REHASH) {
    // Upgrade hashed password with a more secure hash
    const improvedHash = await SecurePassword.hash(password)
    await db.user.update({ where: { id: user.id }, data: { hashedPassword: improvedHash } })
  }

  const { hashedPassword, ...rest } = user
  return rest
}

/**
 * Authenticates a user and creates a session
 * @param {Object} loginData - The login data object
 * @param {string} loginData.email - The user's email address
 * @param {string} loginData.password - The user's password
 * @param {Object} ctx - The context object
 * @returns {Object} The authenticated user object
 */
export default resolver.pipe(resolver.zod(Login), async ({ email, password }, ctx) => {
  const user = await authenticateUser(email, password)
  await ctx.session.$create({ userId: user.id, role: user.role as Role })
  return user
})
