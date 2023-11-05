'use strict';
import { World } from "./classes/index.js";
const size = 300;
const world = new World( size );
const calculateCentroids = ( points, delaunay ) => {
    const numTriangles = delaunay.halfedges.length / 3;
    const centroids = [];
    for ( let t = 0; t < numTriangles; t++ ) {
        let sumOfX = 0;
        let sumOfY = 0;
        for ( let i = 0; i < 3; i++ ) {
            const s = 3 * t + i;
            const p = points[ delaunay.triangles[ s ] ];
            sumOfX += p.x;
            sumOfY += p.y;
        }
        centroids[ t ] = { x: sumOfX / 3, y: sumOfY / 3 };
    }
    return centroids;
};
/** @TIP Canvas */
// const drawLocation = ( context: CanvasRenderingContext2D, map: any, color?: string ): void => {
//   // context.fillStyle = color;
//   // context.fillRect( point.x, point.y, 10, 10 );
//   for ( let i = 0; i < world.size; i++ ) {
//       // const JITTER: number = Math.random() * 0.4;
//       // const offset: Point = {
//       //   x: x / JITTER - ( Math.random() / Math.random() ),
//       //   y: y / JITTER - ( Math.random() / Math.random() ),
//       // };
//     context.fillStyle = "#000000";
//     context.beginPath();
//     // context.arc( map.x, map.y, 0.2, 0, Math.round( 2 * Math.random() ) * Math.PI );
//     context.arc( map.centers[ i ].x, map.centers[ i ].y, 0.2, 0, 2 * Math.PI );
//     context.fill();
//   }
// };
/** @TIP OffscreenCanvas */
const drawLocation = ( context, map, color ) => {
    for ( let i = 0; i < map.centers.length; i++ ) {
        context.fillStyle = color || '#000000';
        context.beginPath();
        context.arc( map.centers[ i ].x, map.centers[ i ].y, 0.2, 0, 2 * Math.PI );
    }
    context.fill();
    return context;
};
const triangleOfEdge = ( e ) => Math.floor( e / 3 );
const nextHalfedge = ( e ) => ( e % 3 === 2 ) ? e - 2 : e + 1;
// const drawCellBoundaries = ( context: CanvasRenderingContext2D, map: any, delaunay: any ): void => {
const drawCellBoundaries = ( context, map, delaunay ) => {
    const { centers, halfedges, numEdges } = map;
    context.lineWidth = 0.2;
    context.strokeStyle = "black";
    for ( let e = 0; e < numEdges; e++ ) {
        if ( e < delaunay.halfedges[ e ] ) {
            const p = centers[ triangleOfEdge( e ) ];
            const q = centers[ triangleOfEdge( halfedges[ e ] ) ];
            context.beginPath();
            context.moveTo( p.x, p.y );
            context.lineTo( q.x, q.y );
            context.stroke();
        }
    }
};
const WAVELENGTH = 0.15;
const EARTHLEVEL = 0.5;
const DELTA = 1.2;
const assignCellEffect = ( points ) => {
    const pointsLengthRef = points.length;
    //@ts-ignore
    const noise = new SimplexNoise();
    const result = [];
    for ( let r = 0; r < pointsLengthRef; r++ ) {
        const nx = points[ r ].x / world.size - 1 * EARTHLEVEL;
        const ny = points[ r ].y / world.size - 1 * EARTHLEVEL;
        // start with noise:
        result[ r ] = ( DELTA + noise.noise2D( nx / WAVELENGTH, ny / WAVELENGTH ) ) * EARTHLEVEL;
        // if ( Math.random() > 0.8 ) {
            // modify noise to make islands:
            let d = DELTA * Math.max( Math.abs( nx ), Math.abs( ny ) ); // should be 0-1
            result[ r ] = ( DELTA + result[ r ] - d ) * EARTHLEVEL;
        // }
    }
    return result;
};
const edgesAroundPoint = ( delaunay, start ) => {
    const result = [];
    let incoming = start;
    do {
        result.push( incoming );
        const outgoing = nextHalfedge( incoming );
        incoming = delaunay.halfedges[ outgoing ];
    } while ( incoming !== -1 && incoming !== start );
    return result;
};

const vertices = [];
// const drawCellColors = ( context: CanvasRenderingContext2D, map: any, colorFn: any, delaunay: any ): void => {
const drawCellColors = ( context, map, colorFn, delaunay ) => {
    const seen = new Set(); // of region ids
    // const canvasControl = document.getElementById( "world" );
    // const rect = canvasControl.getBoundingClientRect();
    const { triangles, numEdges, centers } = map;
    for ( let e = 0; e < numEdges; e++ ) {
        const r = triangles[ nextHalfedge( e ) ];
        if ( !seen.has( r ) ) {
            vertices[ e ] = edgesAroundPoint( delaunay, e ).map( ( e ) => centers[ triangleOfEdge( e ) ] );

            seen.add( r );

            context.fillStyle = colorFn( r );
            context.beginPath();
            context.moveTo( vertices[ e ][ 0 ].x, vertices[ e ][ 0 ].y );
            const summary = { x: vertices[ e ][ 0 ].x, y: vertices[ e ][ 0 ].y };
            for ( let i = 1; i < vertices[ e ].length; i++ ) {
                context.lineTo( vertices[ e ][ i ].x, vertices[ e ][ i ].y );
                summary.x += vertices[ e ][ i ].x;
                summary.y += vertices[ e ][ i ].y;
            }

            context.fill();

            const center = { x: summary.x / vertices[ e ].length, y: summary.y / vertices[ e ].length };
            if ( !Object.values( center ).some( item => item < 0 ) ) {
                context.fillStyle = "red";
                context.beginPath();
                context.arc( center.x, center.y, 0.2, 0, 2 * Math.PI );
                context.fill();
            }
        }
    }
    // console.log( seen.size );
};
// const assignMoisture = ( points: Point[] ): number[] => {
//   const pointsLengthRef: number = points.length;
//   //@ts-ignore
//   const noise: any = new SimplexNoise();
//   const moisture: number[] = [];
//   for ( let r = 0; r < pointsLengthRef; r++ ) {
//     const nx: number = points[ r ].x / world.size - 1 / 2;
//     const ny: number = points[ r ].y / world.size - 1 / 2;
//     moisture[ r ] = ( 1 + noise.noise2D( nx / WAVELENGTH, ny / WAVELENGTH ) ) / 2;
//   }
//   return moisture;
// };
const biomeColor = ( map, c ) => {
    let m = map.moisture[ c ];
    let e = ( m - 0.5 ) * 2;
    let r, g, b = 0;
    if ( e < 0 ) {
        r = 48 + 48 * e;
        g = 64 + 64 * e;
        b = 127 + 127 * e;
    } else {
        m = m * ( 1 - e );
        e = e ** 4; // tweaks
        r = 210 - 100 * m;
        g = 185 - 45 * m;
        b = 139 - 45 * m;
        r = 255 * e + r * ( 1 - e );
        g = 255 * e + g * ( 1 - e );
        b = 255 * e + b * ( 1 - e );
    }
    return `rgb(${ r || 0 }, ${ g || 0 }, ${ b || 0 })`;
};
const cellSize = 0.008;
const main = () => {
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
    const points = [];
    const canvasControl = document.getElementById( "world" );
    const offscreenCanvas = canvasControl.transferControlToOffscreen();
    const context = offscreenCanvas.getContext( '2d' );

    // Get the DPR and size of the canvas
    const dpr = window.devicePixelRatio;
    const rect = canvasControl.getBoundingClientRect();

    // Set the "actual" size of the canvas
    offscreenCanvas.width = rect.width * dpr;
    offscreenCanvas.height = rect.height * dpr;

    // Scale the context to ensure correct drawing operations
    context.save();
    // context.scale( dpr, dpr );

    context.scale( canvasControl.height * cellSize, canvasControl.height * cellSize );
    for ( let x = 0; x < world.size; x++ ) {
        for ( let y = 0; y < world.size; y++ ) {
            const JITTER = Math.random() * 0.5;
            // console.log( { x, y, type: world[ x ][ y ].type } );
            const offset = {
                x: x / JITTER - ( Math.random() / Math.random() + JITTER ),
                y: y / JITTER - ( Math.random() / Math.random() + JITTER ),
            };
            // // const mapLocation = drawLocation( context, { x, y, offset }, colors[ world[ x ][ y ].type ] );
            // // context.drawImage( mapLocation, x * 10, y * 10 );
            points.push( { ...offset } );
        }
    }
    //@ts-ignore
    const delaunay = Delaunator.from( points, ( point ) => point.x, ( point ) => point.y );
    const map = {
        centers: calculateCentroids( points, delaunay ),
        elevation: assignCellEffect( points ),
        halfedges: delaunay.halfedges,
        moisture: assignCellEffect( points ),
        numEdges: delaunay.halfedges.length,
        numRegions: points.length,
        numTriangles: delaunay.halfedges.length / 3,
        points,
        triangles: delaunay.triangles,
    };

    // // drawCellBoundaries(context, map, delaunay);
    drawCellColors( context, map, ( c ) => biomeColor( map, c ), delaunay );

    // // drawLocation( context, map, colors[ world[ x ][ y ].type ] );

    context.restore();
    context.drawImage( offscreenCanvas, 0, 0 );
    // offscreenCanvas.transferToImageBitmap();

    document.addEventListener( "click", ( event ) => {
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        console.log( { x, y } );

        // const cellIndex = map.triangles.indexOf( x );
        // console.log( cellIndex, map.triangles[ cellIndex ], map.centers[ cellIndex ] );

        // const vertices = edgesAroundPoint( delaunay, 0 ).map( ( e ) => map.centers[ triangleOfEdge( e ) ] );
        // console.log( { vertices } );
        // // edgesAroundPoint( delaunay, e ).map( ( e ) => centers[ triangleOfEdge( e ) ] );

        // context.fillStyle = "#00000050";
        // context.beginPath();
        // context.moveTo( vertices[ 0 ].x, vertices[ 0 ].y );
        // for ( let i = 1; i < vertices.length; i++ ) {
        //     context.lineTo( vertices[ i ].x, vertices[ i ].y );
        // }
        // context.fill();

        // context.fillStyle = "#00ff0055";
        // context.beginPath();
        // context.arc( event.offsetX, event.offsetY, 10, 0, 2 * Math.PI );
        // context.fill();
    } );
};

main();

export { main };
