import { vi, describe, it, beforeEach, expect } from "vitest"
import resetPassword from "./resetPassword"
import db from "db"
import { hash256 } from "@blitzjs/auth"
import { SecurePassword } from "@blitzjs/auth/secure-password"

/**
 * Resets the database before each test
 * @returns {Promise<void>} A promise that resolves when the database reset is complete
 */
beforeEach(async () => {
  await db.$reset()
})

const mockCtx: any = {
  session: {
    $create: vi.fn(),
  },
}

/**
 * Test suite for the resetPassword mutation
 * @param {void} - This function doesn't take any parameters
 * @returns {void} This function doesn't return anything, it uses Jest's expect statements for assertions
 */
describe("resetPassword mutation", () => {
  /**
   * Test case for password reset functionality
   * @param {void} - This function doesn't take any parameters
   * @returns {Promise<void>} Resolves when all assertions have passed
   */
  it("works correctly", async () => {
    expect(true).toBe(true)

    // Create test user
    const goodToken = "randomPasswordResetToken"
    const expiredToken = "expiredRandomPasswordResetToken"
    const future = new Date()
    future.setHours(future.getHours() + 4)
    const past = new Date()
    past.setHours(past.getHours() - 4)

    const user = await db.user.create({
      data: {
        email: "user@example.com",
        tokens: {
          // Create old token to ensure it's deleted
          create: [
            {
              type: "RESET_PASSWORD",
              hashedToken: hash256(expiredToken),
              expiresAt: past,
              sentTo: "user@example.com",
            },
            {
              type: "RESET_PASSWORD",
              hashedToken: hash256(goodToken),
              expiresAt: future,
              sentTo: "user@example.com",
            },
          ],
        },
      },
      include: { tokens: true },
    })

    const newPassword = "newPassword"

    // Non-existent token
    await expect(
      resetPassword({ token: "no-token", password: "", passwordConfirmation: "" }, mockCtx)
    ).rejects.toThrowError()

    // Expired token
    await expect(
      resetPassword(
        { token: expiredToken, password: newPassword, passwordConfirmation: newPassword },
        mockCtx
      )
    ).rejects.toThrowError()

    // Good token
    await resetPassword(
      { token: goodToken, password: newPassword, passwordConfirmation: newPassword },
      mockCtx
    )

    // Delete's the token
    const numberOfTokens = await db.token.count({ where: { userId: user.id } })
    expect(numberOfTokens).toBe(0)

    // Updates user's password
    const updatedUser = await db.user.findFirst({ where: { id: user.id } })
    expect(await SecurePassword.verify(updatedUser!.hashedPassword, newPassword)).toBe(
      SecurePassword.VALID
    )
  })
})
