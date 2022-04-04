import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import { Header } from '../../components/Header'
import { useRequest } from '../../hooks/useRequest'
import { IUserPayload } from '../auth/signup'

interface HomeProps {
  currentUser: IUserPayload | null
}
export interface ITicket {
  id: string
  price: number
  title: string
  userId: string
  version: number
}

export default function New({ currentUser }: HomeProps) {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')

  const router = useRouter()

  const { doRequest, errors } = useRequest<
    ITicket,
    { title: string; price: string }
  >({
    method: 'post',
    url: '/api/tickets',
    body: { title, price },
    onSuccess: () => router.push('/'),
  })

  const onBlur = () => {
    const value = parseFloat(price)

    if (isNaN(value)) {
      return
    }
    setPrice(value.toFixed(2))
  }
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    doRequest()
  }
  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>Ticketing</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header currentUser={currentUser} />
      <div className="container">
        <form onSubmit={onSubmit}>
          <h2 className="my-2 text-lg font-semibold text-blue-700">
            Create a ticket
          </h2>
          <div className="mb-4">
            <label className="mb-2 text-sm text-gray-900" htmlFor="email">
              Title
            </label>
            <input
              value={title}
              onChange={({ target: { value } }) => setTitle(value)}
              className="w-full rounded-md border border-gray-400 px-4 py-2"
              placeholder="Enter a title"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 text-sm text-gray-900" htmlFor="password">
              Price
            </label>
            <input
              value={price}
              onChange={({ target: { value } }) => setPrice(value)}
              onBlur={onBlur}
              className="w-full rounded-md border border-gray-400 px-4 py-2"
              placeholder="Enter price"
            />
          </div>
          {errors}
          <button
            type="submit"
            className="rounded-md border-0 bg-blue-600 p-2 text-white outline-none"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // const client = buildClient(context)
  // const { data } = await client.get('/api/users/currentuser')
  return {
    props: {
      currentUser: null,
    },
  }
}
