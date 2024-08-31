"use client"
import { LabeledTextField } from "src/app/components/LabeledTextField"
import { Form, FORM_ERROR } from "src/app/components/Form"
import { ForgotPassword } from "../validations"
import forgotPassword from "../mutations/forgotPassword"
import { useMutation } from "@blitzjs/rpc"

/**
 * Renders a forgot password form component
 * @returns {JSX.Element} A React component that displays either a form to submit a forgot password request or a success message
 */
export function ForgotPasswordForm() {
  const [forgotPasswordMutation, { isSuccess }] = useMutation(forgotPassword)

  return (
    <>
      <h1>Forgot your password?</h1>
      <>
        {isSuccess ? (
          <div>
            <h2>Request Submitted</h2>
            <p>
              If your email is in our system, you will receive instructions to reset your password
              shortly.
            </p>
          </div>
        ) : (
          <Form
            submitText="Send Reset Password Instructions"
            schema={ForgotPassword}
            initialValues={{ email: "" }}
            /**
             * Handles the form submission for the forgot password functionality
             * @param {Object} values - The form values containing the user's input
             * @returns {Object|undefined} Returns an object with FORM_ERROR if an error occurs, otherwise undefined
             */
            onSubmit={async (values) => {
              try {
                await forgotPasswordMutation(values)
              } catch (error: any) {
                return {
                  [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                }
              }
            }}
          >
            <LabeledTextField name="email" label="Email" placeholder="Email" />
          </Form>
        )}
      </>
    </>
  )
}
