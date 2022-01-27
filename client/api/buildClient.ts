import axios from 'axios'
import { IncomingMessage } from 'http'
import { NextApiRequestCookies } from 'next/dist/server/api-utils'
import { isSsr } from '../utils/isSsr'

// http://SERVICENAME.NAMESPACE.svc.cluster.local
// k get services -n ingress-nginx

export const buildClient = ({
  req,
}: {
  req: IncomingMessage & {
    cookies: NextApiRequestCookies
  }
}) => {
  if (isSsr()) {
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      // @ts-ignore
      headers: req.headers,
    })
  } else {
    return axios.create({
      baseURL: '/',
    })
  }
}
