import { useState, ReactNode, PropsWithoutRef } from "react"
import { Formik, FormikProps } from "formik"
import { validateZodSchema } from "blitz"
import { z } from "zod"

export interface FormProps<S extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit"> {
  /** All your form fields */
  children?: ReactNode
  /** Text to display in the submit button */
  submitText?: string
  schema?: S
  onSubmit: (values: z.infer<S>) => Promise<void | OnSubmitResult>
  initialValues?: FormikProps<z.infer<S>>["initialValues"]
}

interface OnSubmitResult {
  FORM_ERROR?: string
  [prop: string]: any
}

export const FORM_ERROR = "FORM_ERROR"

/**
 * A reusable Form component that uses Formik and Zod for form handling and validation.
 * @param {ReactNode} children - The form fields to be rendered within the form.
 * @param {string} [submitText] - The text to display on the submit button. If not provided, no submit button will be rendered.
 * @param {z.ZodType<any, any>} schema - The Zod schema for form validation.
 * @param {Object} [initialValues] - The initial values for the form fields.
 * @param {Function} onSubmit - The function to call when the form is submitted. It should return an object with FORM_ERROR and/or field-specific errors.
 * @param {Object} props - Additional props to be spread on the form element.
 * @returns {JSX.Element} A form component with validation, error handling, and customizable fields.
 */
export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  schema,
  initialValues,
  onSubmit,
  ...props
}: FormProps<S>) {
  const [formError, setFormError] = useState<string | null>(null)
  return (
    <Formik
      initialValues={initialValues || {}}
      validate={validateZodSchema(schema)}
      /**
       * Handles form submission asynchronously
       * @param {Object} values - The form values to be submitted
       * @param {Object} formikBag - The Formik bag object containing utility functions
       * @param {Function} formikBag.setErrors - Function to set form errors
       * @returns {Promise<void>} No explicit return, but may set form errors
       */
      onSubmit={async (values, { setErrors }) => {
        const { FORM_ERROR, ...otherErrors } = (await onSubmit(values)) || {}

        if (FORM_ERROR) {
          setFormError(FORM_ERROR)
        }

        if (Object.keys(otherErrors).length > 0) {
          setErrors(otherErrors)
        }
      }}
    >
      /**
       * Renders a form component with submit functionality and error handling.
       * @param {Object} props - The component props.
       * @param {Function} props.handleSubmit - Function to handle form submission.
       * @param {boolean} props.isSubmitting - Indicates if the form is currently submitting.
       * @param {React.ReactNode} props.children - Form fields to be rendered within the form.
       * @param {string} [props.formError] - Error message to display if form submission fails.
       * @param {string} [props.submitText] - Text to display on the submit button.
       * @returns {React.ReactElement} A form element with children, error handling, and a submit button.
       */
      {({ handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit} className="form" {...props}>
          {/* Form fields supplied as children are rendered here */}
          {children}

          {formError && (
            <div role="alert" style={{ color: "red" }}>
              {formError}
            </div>
          )}

          {submitText && (
            <button type="submit" disabled={isSubmitting}>
              {submitText}
            </button>
          )}

          <style global jsx>{`
            .form > * + * {
              margin-top: 1rem;
            }
          `}</style>
        </form>
      )}
    </Formik>
  )
}

export default Form
