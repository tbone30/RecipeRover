"use client" // Error components must be Client components
import React, { useEffect } from "react"

/**
 * Renders an error component with a retry button
 * @param {Object} props - The component props
 * @param {Error} props.error - The error object to be displayed
 * @param {() => void} props.reset - Function to reset and attempt recovery
 * @returns {JSX.Element} A div containing an error message and a retry button
 */
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  /**
   * Logs an error to the console when the error state changes
   * @param {Error} error - The error object to be logged
   * @returns {void} This effect does not return anything
   */
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}
