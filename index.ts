'use strict';

import path from 'path';
import { FastifyInstance } from 'fastify';

import { serverFactory } from './server';

const app: FastifyInstance = serverFactory( {
  ignoreDuplicateSlashes: true,
  ignoreTrailingSlash: true,
  logger: {
    redact: [ 'req.headers.authorization' ],
  },
} );

app.register( import( '@fastify/static' ), {
  root: path.join( __dirname, '/public' ),
  prefix: '/public', // optional: default '/'
} );

// import { getRandomInt } from './utils';

// import {
//   Point,
//   UnitOptions,
// } from './types';

// import {
//   Unit,
//   World,
// } from './classes';

// const size = 50;
// const world: World = new World( size );

// const unit1 = new Unit( world, { name: 'Unit 1' } as UnitOptions );
// const unit2 = new Unit( world, { name: 'Unit 2' } as UnitOptions );
// const unit3 = new Unit( world, { name: 'Unit 3' } as UnitOptions );
// const unit4 = new Unit( world, { name: 'Unit 4' } as UnitOptions );

// const target: Point = { x: getRandomInt( size ), y: getRandomInt( size ) };

// const unit5 = new Unit( world, { name: 'Unit 5', position: target } as UnitOptions );

// unit5.moveTo( unit1.position );
// unit1.moveTo( target );

// console.dir( { ...unit1, health: unit1.health, effects: { ...world[ unit1.position.x ][ unit1.position.y ], units: null }, position: unit1.position, world: null }, { depth: null } );
app.get( '/', ( req, reply ) => {
  reply
    .header( 'content-type', 'text/html' )
    .code( 200 )
    .sendFile( '/index.html' );
} );

app.listen( { port: 3000, host: 'localhost' } );
