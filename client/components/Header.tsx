import Link from 'next/link'
import { IUserPayload } from '../pages/auth/signup'

export const Header = ({
  currentUser,
}: {
  currentUser: IUserPayload | null
}) => {
  const renderLinks = () => {
    if (currentUser) {
      return (
        <ul className="flex text-sm">
          <li className="mr-4">
            <Link href="/tickets/new">
              <a className="cursor-pointer">Sell Ticket</a>
            </Link>
          </li>
          <li className="mr-4">
            <Link href="/orders">
              <a className="cursor-pointer">My orders</a>
            </Link>
          </li>
          <li>
            <Link href="/auth/signout">
              <a className="cursor-pointer">Sign Out</a>
            </Link>
          </li>
        </ul>
      )
    } else {
      return (
        <ul className="flex text-sm">
          <li className="mr-2">
            <Link href="/auth/signin">
              <a className="cursor-pointer">SignIn</a>
            </Link>
          </li>
          <li>
            <Link href="/auth/signup">
              <a className="cursor-pointer">SignUp</a>
            </Link>
          </li>
        </ul>
      )
    }
  }
  return (
    <header className="h-12 w-screen bg-blue-700 text-white">
      <div className="container flex h-full items-center justify-between">
        <Link href="/">
          <a className="cursor-pointer text-lg font-bold italic">Ticketing</a>
        </Link>
        {renderLinks()}
      </div>
    </header>
  )
}
