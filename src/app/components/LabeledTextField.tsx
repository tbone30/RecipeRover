import { forwardRef, PropsWithoutRef } from "react"
import { useField, useFormikContext, ErrorMessage } from "formik"

export interface LabeledTextFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabeledTextField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  /**
   * Renders a form input field with label and error message handling.
   * @param {Object} props - The component props.
   * @param {string} props.name - The name of the input field.
   * @param {string} props.label - The label text for the input field.
   * @param {Object} props.outerProps - Additional props for the outer div container.
   * @param {React.Ref} ref - Ref object for the input element.
   * @returns {JSX.Element} A div containing a labeled input field with error handling and styling.
   */
  ({ name, label, outerProps, ...props }, ref) => {
    const [input] = useField(name)
    const { isSubmitting } = useFormikContext()

    return (
      <div {...outerProps}>
        <label>
          {label}
          <input {...input} disabled={isSubmitting} {...props} ref={ref} />
        </label>

        <ErrorMessage name={name}>
          /**
           * Renders an error message component
           * @param {string} msg - The error message to display
           * @returns {JSX.Element} A div element containing the error message with red text
           */
          {(msg) => (
            <div role="alert" style={{ color: "red" }}>
              {msg}
            </div>
          )}
        </ErrorMessage>

        <style jsx>{`
          label {
            display: flex;
            flex-direction: column;
            align-items: start;
            font-size: 1rem;
          }
          input {
            font-size: 1rem;
            padding: 0.25rem 0.5rem;
            border-radius: 3px;
            border: 1px solid purple;
            appearance: none;
            margin-top: 0.5rem;
          }
        `}</style>
      </div>
    )
  }
)

LabeledTextField.displayName = "LabeledTextField"

export default LabeledTextField
