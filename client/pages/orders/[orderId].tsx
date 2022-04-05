import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import { buildClient } from '../../api/buildClient'
import { Header } from '../../components/Header'
import { STRIPE_PUB_KEY } from '../../constants/vars'
import { useRequest } from '../../hooks/useRequest'
import { IUserPayload } from '../auth/signup'
import { ITicket } from '../tickets/new'

export interface IOrder {
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

const OrderShow = ({ currentUser, order }: OrderProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0)

  const router = useRouter()

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => router.push('/orders'),
  })

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
        {errors}
        {timeLeft > 0 ? (
          <>
            <div>Time left to pay {timeLeft} seconds left</div>
            <StripeCheckout
              token={({ id }) => doRequest({ token: id })}
              stripeKey={STRIPE_PUB_KEY!}
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
