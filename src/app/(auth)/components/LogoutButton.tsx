"use client"
import styles from "../../styles/Home.module.css"
import logout from "../mutations/logout"
import { useRouter } from "next/navigation"
import { useMutation } from "@blitzjs/rpc"

/**
 * Renders a logout button component that triggers a logout mutation and refreshes the router.
 * @returns {JSX.Element} A button element that, when clicked, logs out the user and refreshes the page.
 */
export function LogoutButton() {
  const router = useRouter()
  const [logoutMutation] = useMutation(logout)
  return (
    <>
      <button
        className={styles.button}
        /**
         * Handles the click event for logout
         * @param {void} - No parameters
         * @returns {Promise<void>} Logs out the user and refreshes the router
         */
        onClick={async () => {
          await logoutMutation()
          router.refresh()
        }}
      >
        Logout
      </button>
    </>
  )
}
