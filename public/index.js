'use strict';

import { World } from "./../classes/index.js";

const size = 100;
const world = new World( size );

const drawLocation = ( context, point, color ) => {
  context.fillStyle = color;
  // context.fillStyle = "cyan";
  context.fillRect( point.x, point.y, 10, 10 );

  context.fillStyle = "#000000";
  context.beginPath();
  // context.arc( point.offset.x, point.offset.y, 0.2, 0, 2 * Math.PI );
  context.arc( point.offset.x, point.offset.y, 0.2, 0, Math.round( 2 * Math.random() ) * Math.PI );
  context.fill();
};

const main = () => {
  const locationWidth = 1000 / world.size;
  const locationHeight = 1000 / world.size;

  const colors = {
    dirt: "#584f196e",
    forest: "#0f6217b5",
    grass: "#8be578c7",
    ground: "#838383",
    ice: "#9ceaffa3",
    sand: "#dbbc0038",
    snow: "#00bcd48a",
    stone: "#000000a1",
    swamp: "#7a6f00d4",
    water: "#52bbf3",
  };

  // const points = [];
  const canvasControl = document.getElementById( "world" );
  // const offscreenCanvas = canvasControl.transferControlToOffscreen();
  // const context = offscreenCanvas.getContext( "webgl" );
  const context = canvasControl.getContext( "2d" );

  // const offscreenCanvas = new OffscreenCanvas( 256, 256 );
  // const context = offscreenCanvas.getContext( "webgl" );

  context.save();

  context.scale( canvasControl.width * 0.01, canvasControl.height * 0.01 );

  const JITTER = 0.5;

  for ( let x = 0; x <= world.size; x++ ) {
    for ( let y = 0; y < world[ x ].length; y++ ) {
      // console.log( { x, y, type: world[ x ][ y ].type } );
      const offset = {
        x: x + JITTER + ( Math.random() / Math.random() ),
        y: y + JITTER + ( Math.random() / Math.random() ),
      };

      const mapLocation = drawLocation( context, { x, y, offset }, colors[ world[ x ][ y ].type ] );
      // context.drawImage( mapLocation, x * 10, y * 10 );
      // points.push( { x, y } );
    }
  }

  context.restore();
  // offscreenCanvas.transferToImageBitmap();
};

main();

export { main };
