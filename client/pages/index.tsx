import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { buildClient } from '../api/buildClient'
import { Header } from '../components/Header'
import { IUserPayload } from './auth/signup'
import { ITicket } from './tickets/new'

interface HomeProps {
  currentUser: IUserPayload | null
  tickets: ITicket[]
}

export default function Home({ currentUser, tickets }: HomeProps) {
  const ticketsList = tickets.map((ticket) => {
    return (
      <tr className="border-b bg-white hover:bg-gray-50 " key={ticket.id}>
        <td className="px-6 py-4">{ticket.title}</td>
        <td className="px-6 py-4">{ticket.price}</td>
        <td className="px-6 py-4">
          <Link href={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    )
  })
  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>Ticketing</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header currentUser={currentUser} />
      <div className="container">
        <h1 className="my-4 text-2xl font-bold">Tickets</h1>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Title
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Link
                </th>
              </tr>
            </thead>
            <tbody>{ticketsList}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = buildClient(context)
  const [{ data: { currentUser } = { currentUser: null } }, { data: tickets }] =
    await Promise.all([
      client.get('/api/users/currentuser'),
      client.get('/api/tickets'),
    ])
  return {
    props: {
      currentUser,
      tickets,
    },
  }
}
