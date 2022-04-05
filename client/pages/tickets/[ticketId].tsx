import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { buildClient } from '../../api/buildClient'
import { Header } from '../../components/Header'
import { useRequest } from '../../hooks/useRequest'
import { IUserPayload } from '../auth/signup'
import { ITicket } from './new'

interface ShowTicketProps {
  ticket: ITicket
  currentUser: IUserPayload
}

export const TicketShow = ({ ticket, currentUser }: ShowTicketProps) => {
  const router = useRouter()
  const { doRequest, errors } = useRequest<
    { id: string },
    { ticketId: string }
  >({
    method: 'post',
    url: '/api/orders',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (data) => router.push(`/orders/${data.id}`),
  })
  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>Ticketing</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header currentUser={currentUser} />
      <div className="container my-6 flex flex-col">
        <h1>{ticket.title}</h1>
        <h4>Price: {ticket.price}</h4>
        {errors}
        <button
          onClick={() => doRequest()}
          className="my-4 w-fit rounded-md bg-blue-500 p-2 text-white"
        >
          Purchase
        </button>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const ticketId = ctx.query.ticketId
  const client = buildClient(ctx)
  const [
    { data: ticket },
    {
      data: { currentUser },
    },
  ] = await Promise.all([
    client.get(`/api/tickets/${ticketId}`),
    client.get('/api/users/currentuser'),
  ])
  return {
    props: {
      ticket,
      currentUser,
    },
  }
}

export default TicketShow
