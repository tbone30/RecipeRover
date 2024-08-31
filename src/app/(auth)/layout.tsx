import { useAuthenticatedBlitzContext } from "../blitz-server"

/**
 * Layout component for authentication-related pages
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout
 * @returns {Promise<React.ReactNode>} A Promise that resolves to the rendered layout with authenticated context
 */
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  await useAuthenticatedBlitzContext({
    redirectAuthenticatedTo: "/",
  })
  return <>{children}</>
}
