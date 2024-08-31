import { z } from "zod"

export const email = z
  .string()
  .email()
  /**
   * Transforms a string by converting it to lowercase and removing leading/trailing whitespace.
   * @param {string} str - The input string to be transformed.
   * @returns {string} The transformed string in lowercase with trimmed whitespace.
   */
  .transform((str) => str.toLowerCase().trim())

export const password = z
  .string()
  .min(10)
  .max(100)
  /**
   * Transforms a string by trimming whitespace from both ends.
   * @param {string} str - The input string to be trimmed.
   * @returns {string} The trimmed string with leading and trailing whitespace removed.
   */
  .transform((str) => str.trim())

export const Signup = z.object({
  email,
  password,
})

export const Login = z.object({
  email,
  password: z.string(),
})

export const ForgotPassword = z.object({
  email,
})

export const ResetPassword = z
  .object({
    password: password,
    passwordConfirmation: password,
    token: z.string().optional(),
  })
  /**
   * Refines the data by comparing password and passwordConfirmation fields
   * @param {Object} data - The object containing password and passwordConfirmation fields
   * @returns {boolean} True if password matches passwordConfirmation, false otherwise
   */
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"], // set the path of the error
  })

export const ChangePassword = z.object({
  currentPassword: z.string(),
  newPassword: password,
})
