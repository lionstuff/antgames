'use strict';

import Fastify, {
  FastifyHttpOptions,
  FastifyInstance,
  FastifyRegisterOptions,
  RegisterOptions,
} from 'fastify';

export const serverFactory = ( options: FastifyHttpOptions<any> = {} ): FastifyInstance => {
  const app: FastifyInstance = Fastify( options );

  app.register( import( '@fastify/cors' ), {
    // put your options here
    origin: [
      /** @localhost */
      `${ process.env.CLIENT_HOST }:${ process.env.CLIENT_PORT }`,
      'https://127.0.0.1:5050', // for test
      'https://localhost:5050', // for test
      'http://127.0.0.1:8080',
      'http://localhost:8080',
      'https://127.0.0.1:8080',
      'https://localhost:8080',
    ],
    sessionPlugin: '@fastify/secure-session',
  } as FastifyRegisterOptions<RegisterOptions> );

  return app as FastifyInstance;
};
