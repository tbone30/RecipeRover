import { useQuery } from "@blitzjs/rpc"
import getCurrentUser from "../queries/getCurrentUser"

/**
 * Custom React hook to fetch and return the current user
 * @returns {Object|null} The current user object if authenticated, or null if not
 */
export const useCurrentUser = () => {
  const [user] = useQuery(getCurrentUser, null)
  return user
}
