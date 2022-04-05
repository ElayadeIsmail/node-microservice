import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import { buildClient } from '../../api/buildClient'
import { Header } from '../../components/Header'
import { IUserPayload } from '../auth/signup'
import { ITicket } from '../tickets/new'

interface IOrder {
  id: string
  userId: string
  expiresAt: string
  version: number
  status: string
  ticket: ITicket
}

interface OrderProps {
  order: IOrder
  currentUser: IUserPayload
}

export const OrderShow = ({ currentUser, order }: OrderProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0)
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt).getTime() - new Date().getTime()
      setTimeLeft(Math.round(msLeft / 1000))
    }
    findTimeLeft()
    const timerId = setInterval(findTimeLeft, 1000)
    return () => {
      clearInterval(timerId)
    }
  }, [])
  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>Ticketing</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header currentUser={currentUser} />
      <div className="container my-6 flex flex-col">
        {timeLeft > 0 ? (
          <>
            <div>Time left to pay {timeLeft} seconds left</div>
            <StripeCheckout
              token={(token) => console.log('token', token)}
              stripeKey="pk_test_51KkU0fJwpwmPjRKY7Ugi0YEjc2S7o3bwJiXuoRFaMF0A9hzAbts4XJNzChe0dMka3B4EC48OLL1XDS6p8J00xjWE00jNjcQ7pz"
              amount={order.ticket.price * 100}
              email={currentUser.email}
            />
          </>
        ) : (
          <div>Your order expired</div>
        )}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const orderId = ctx.query.orderId
  const client = buildClient(ctx)
  const [
    { data: order },
    {
      data: { currentUser },
    },
  ] = await Promise.all([
    client.get(`/api/orders/${orderId}`),
    client.get('/api/users/currentuser'),
  ])
  return {
    props: {
      order,
      currentUser,
    },
  }
}

export default OrderShow
