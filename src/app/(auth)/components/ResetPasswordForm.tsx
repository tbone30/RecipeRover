"use client"
import { LabeledTextField } from "src/app/components/LabeledTextField"
import { Form, FORM_ERROR } from "src/app/components/Form"
import { ResetPassword } from "../validations"
import resetPassword from "../mutations/resetPassword"
import { useMutation } from "@blitzjs/rpc"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

/**
 * ResetPasswordForm component for rendering a password reset form.
 * @returns {JSX.Element} A React component that displays either a password reset form or a success message.
 */
export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams?.get("token")?.toString()
  const [resetPasswordMutation, { isSuccess }] = useMutation(resetPassword)

  return (
    <div>
      <h1>Set a New Password</h1>

      {isSuccess ? (
        <div>
          <h2>Password Reset Successfully</h2>
          <p>
            Go to the <Link href="/">homepage</Link>
          </p>
        </div>
      ) : (
        <Form
          submitText="Reset Password"
          schema={ResetPassword}
          initialValues={{
            password: "",
            passwordConfirmation: "",
            token,
          }}
          /**
           * Handles form submission for password reset
           * @param {Object} values - The form values containing reset password data
           * @param {string} token - The reset password token
           * @returns {Promise<Object|undefined>} An object with FORM_ERROR if an error occurs, undefined otherwise
           */
          onSubmit={async (values) => {
            try {
              await resetPasswordMutation({ ...values, token })
            } catch (error: any) {
              if (error.name === "ResetPasswordError") {
                return {
                  [FORM_ERROR]: error.message,
                }
              } else {
                return {
                  [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                }
              }
            }
          }}
        >
          <LabeledTextField name="password" label="New Password" type="password" />
          <LabeledTextField
            name="passwordConfirmation"
            label="Confirm New Password"
            type="password"
          />
        </Form>
      )}
    </div>
  )
}
