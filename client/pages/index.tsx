import { GetServerSideProps } from 'next'
import Head from 'next/head'
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
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
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
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>{ticketsList}</tbody>
        </table>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = buildClient(context)
  const [{ data: currentUser }, { data: tickets }] = await Promise.all([
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
