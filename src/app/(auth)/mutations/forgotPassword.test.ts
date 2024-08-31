import { vi, describe, it, beforeEach } from "vitest"
import db from "db"
import { hash256 } from "@blitzjs/auth"
import forgotPassword from "./forgotPassword"
import previewEmail from "preview-email"
import { Ctx } from "@blitzjs/next"

/**
 * Resets the database before each test
 * @returns {Promise<void>} A promise that resolves when the database reset is complete
 */
beforeEach(async () => {
  await db.$reset()
})

const generatedToken = "plain-token"
/**
 * Mocks the @blitzjs/auth module for testing purposes
 * @param {void} None
 * @returns {Object} An object containing the original auth module properties with a mocked generateToken function
 */
vi.mock("@blitzjs/auth", async () => {
  const auth = await vi.importActual<Record<string, unknown>>("@blitzjs/auth")!
  return {
    ...auth,
    /**
     * Generates and returns a token.
     * @returns {string} The generated token.
     */
    generateToken: () => generatedToken,
  }
})

/**
 * Mocks the "preview-email" module using Vitest
 * @param {string} "preview-email" - The module path to be mocked
 * @returns {object} An object with a mocked default export function
 */
vi.mock("preview-email", () => ({ default: vi.fn() }))

/**
 * Test suite for the forgotPassword mutation
 * @param {void} None - This is a test suite and doesn't take parameters directly
 * @returns {void} This test suite doesn't return a value, it performs assertions
 */
describe("forgotPassword mutation", () => {
  /**
   * Test case to verify that the forgotPassword function does not throw an error for a non-existent user.
   * @param {Object} testObject - The test object containing the email for a non-existent user.
   * @param {string} testObject.email - The email address of a non-existent user.
   * @param {Object} contextObject - The context object, typed as Ctx (likely a mock or stub).
   * @returns {Promise<void>} A promise that resolves if no error is thrown, as expected.
   */
  it("does not throw error if user doesn't exist", async () => {
    await expect(forgotPassword({ email: "no-user@email.com" }, {} as Ctx)).resolves.not.toThrow()
  })

  /**
   * Tests the functionality of the forgotPassword mutation.
   * @param {void} - This test function doesn't take any parameters.
   * @returns {Promise<void>} Resolves when the test is complete.
   */
  it("works correctly", async () => {
    // Create test user
    const user = await db.user.create({
      data: {
        email: "user@example.com",
        tokens: {
          // Create old token to ensure it's deleted
          create: {
            type: "RESET_PASSWORD",
            hashedToken: "token",
            expiresAt: new Date(),
            sentTo: "user@example.com",
          },
        },
      },
      include: { tokens: true },
    })

    // Invoke the mutation
    await forgotPassword({ email: user.email }, {} as Ctx)

    const tokens = await db.token.findMany({ where: { userId: user.id } })
    const token = tokens[0]
    if (!user.tokens[0]) throw new Error("Missing user token")
    if (!token) throw new Error("Missing token")

    // delete's existing tokens
    expect(tokens.length).toBe(1)

    expect(token.id).not.toBe(user.tokens[0].id)
    expect(token.type).toBe("RESET_PASSWORD")
    expect(token.sentTo).toBe(user.email)
    expect(token.hashedToken).toBe(hash256(generatedToken))
    expect(token.expiresAt > new Date()).toBe(true)
    expect(previewEmail).toBeCalled()
  })
})
