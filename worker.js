'use strict';

window.addEventListener( 'message', ( { data: { offscreenCanvas, width, height } } ) => {
  if ( offscreenCanvas != null ) {
    const gl = offscreenCanvas.getContext( 'webgl' );
    series.context( gl );
    series( data );
  }

  if ( width != null && height != null ) {
    const gl = series.context();
    gl.canvas.width = width;
    gl.canvas.height = height;
    gl.viewport( 0, 0, gl.canvas.width, gl.canvas.height );
  }
} );
