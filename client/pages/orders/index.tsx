import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { buildClient } from '../../api/buildClient'
import { Header } from '../../components/Header'
import { IUserPayload } from '../auth/signup'
import { IOrder } from './[orderId]'

interface MyOrdersProps {
  currentUser: IUserPayload | null
  orders: IOrder[]
}

const MyOrders = ({ currentUser, orders }: MyOrdersProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>Ticketing</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header currentUser={currentUser} />
      <div className="container">
        <h1 className="my-4 text-2xl font-bold">My Orders</h1>
        <ul>
          {orders.map((order) => {
            return (
              <li key={order.id}>
                {order.ticket.title} - {order.status}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const client = buildClient(ctx)
  const [
    { data: { currentUser } = { currentUser: null } },
    { data: orders = [] },
  ] = await Promise.all([
    client.get('/api/users/currentuser'),
    client.get('/api/orders'),
  ])

  return {
    props: {
      orders,
      currentUser,
    },
  }
}

export default MyOrders
