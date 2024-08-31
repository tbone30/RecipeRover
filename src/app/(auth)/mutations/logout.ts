import { Ctx } from "blitz"

/**
 * Logs out the current user by revoking their session.
 * @param {any} _ - Unused parameter (placeholder).
 * @param {Ctx} ctx - The context object containing the session information.
 * @returns {Promise<void>} A promise that resolves when the session is successfully revoked.
 */
export default async function logout(_: any, ctx: Ctx) {
  return await ctx.session.$revoke()
}
