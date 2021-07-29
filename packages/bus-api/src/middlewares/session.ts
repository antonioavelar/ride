// This middleware uses ORY Krato's `/sessions/whoami` endpoint to check if the user is signed in or not:
import * as nconf from 'nconf';

import { Configuration, V0alpha1Api, } from '@ory/kratos-client'

import { NextFunction, Request, Response } from 'express'


const kratos = new V0alpha1Api(
  new Configuration({ basePath: nconf.get('KRATOS_PUBLIC_URL') })
)

export default (req: Request, res: Response, next: NextFunction) => {
  kratos
    .toSession(undefined, req.header('Cookie'))
    .then(({ data: session }) => {
      // `whoami` returns the session or an error. We're changing the type here
      // because express-session is not detected by TypeScript automatically.
      (req as Request & { user: any }).user = session;

      next()
    })
    .catch((error) => {
      // If no session is found, redirect to login.
      res
        .status(401)
        .json({
          error: error.response?.data?.error
        });
    });
}

