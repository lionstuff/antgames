'use strict';
import { getRandomInt } from './../utils/index.js';
import { LocationType, } from './../types/index.js';
export class MapLocation /* extends OffscreenCanvas  */ {
    options;
    effects;
    size; /** @TODO Max units into location */
    type = LocationType[getRandomInt(Object.keys(LocationType).length) - 1];
    units = [];
    weight = 0; /** @TODO */
    constructor(options) {
        this.options = options;
        Object.assign(this, { ...options });
        switch (this.type) {
            case LocationType.dirt:
                this.effects = {
                    // armor: 0,
                    energy: -2,
                    // health: 0,
                    power: -1,
                    speed: -1,
                };
                break;
            case LocationType.forest:
                this.effects = {
                    armor: 1,
                    energy: -1,
                    health: 2,
                    // power: 0,
                    speed: -1,
                };
                break;
            case LocationType.grass:
                this.effects = {
                    // armor: 0,
                    energy: -1,
                    health: 1,
                    power: 1,
                    speed: 1,
                };
                break;
            case LocationType.ground:
                this.effects = {
                    // armor: 0,
                    energy: -1,
                    // health: 0,
                    // power: 0,
                    // speed: 0,
                };
                break;
            case LocationType.ice:
                this.effects = {
                    // armor: 0,
                    energy: -1,
                    // health: 0,
                    power: -2,
                    speed: 2,
                };
                break;
            case LocationType.sand:
                this.effects = {
                    armor: -1,
                    energy: -2,
                    // health: 0,
                    power: -1,
                    speed: -2,
                };
                break;
            case LocationType.snow:
                this.effects = {
                    armor: -1,
                    energy: -2,
                    health: -1,
                    power: -2,
                    speed: -2,
                };
                break;
            case LocationType.stone:
                this.effects = {
                    armor: 1,
                    energy: -1,
                    // health: 0,
                    // power: 0,
                    // speed: 0,
                };
                break;
            case LocationType.swamp:
                this.effects = {
                    armor: -2,
                    energy: -3,
                    health: -1,
                    power: -2,
                    speed: -3,
                };
                break;
            case LocationType.water:
                this.effects = {
                    // armor: 0,
                    energy: -2,
                    // health: 0,
                    // power: 0,
                    speed: -1,
                };
                break;
            default:
                this.effects = {
                    // armor: 0,
                    energy: -1,
                    // health: 0,
                    // power: 0,
                    // speed: 0,
                };
                break;
        }
    }
    ;
    /**
     * @name addUnit
     * @param {Unit} unit
     * @public
     * @returns {number}
     */
    addUnit(unit) {
        if (!!unit) {
            return this.units.push(unit);
        }
        return -1;
    }
    ;
    /**
     * @name removeUnit
     * @param {Unit} unit
     * @public
     * @returns {Unit[]}
     */
    removeUnit(unit) {
        const unitIndex = this.units.indexOf(unit, 0);
        if (unitIndex === -1) {
            return [unit];
        }
        return this.units.splice(unitIndex, 1);
    }
    ;
}
;
// export class World /* extends Array<MapLocation[]> */ {
class World {
    /**
     * @protected
     * @returns {MapLocation}
     */
    getRandomLocation() {
        return new MapLocation({ type: Object.keys(LocationType)[getRandomInt(Object.values(LocationType).length - 1)] });
    }
    ;
    /**
     * @default 10
     * @param {number} size
     */
    constructor(size = 10) {
        for (let row = 0; row < size; row++) {
            this[row] = [];
            this[row].length = size;
            for (let c = 0; c < size; c++) {
                this[row][c] = this.getRandomLocation();
            }
            const rnd = size * 0.5 + getRandomInt(size);
            for (let i = 0; i < rnd; i++) {
                const location = this.getRandomLocation();
                if (!!location) {
                    const col = getRandomInt(size - 1);
                    this[row][col] = location;
                }
            }
        }
    }
    ;
    /**
     * @public
     */
    get size() {
        if (!!this[0] && this[0]?.length) {
            return this[0].length;
        }
        return 0;
    }
    ;
}
;
export class Unit {
    armor;
    energy;
    #health;
    #position;
    power;
    speed;
    defaults = { armor: 0, energy: 0, health: 0, power: 0, speed: 0 };
    name;
    timerId;
    path = []; /** @TODO */
    world;
    constructor(world, options = {}) {
        if (world instanceof World) {
            this.world = world;
            this.initialize(options);
            this.lookAround();
            /** @TODO Start timer */
        }
        else {
            throw new TypeError('world should be instance of World');
        }
    }
    ;
    /**
     * @protected
     */
    initialize(options) {
        Object.assign(this, { ...options });
        this.armor = options?.armor ? options.armor : getRandomInt(5);
        this.energy = options?.energy ? options.energy : getRandomInt(10) + 5;
        this.health = options?.health ? options.health : getRandomInt(100) + 50;
        this.power = options?.power ? options.power : getRandomInt(5) + 1;
        this.speed = options?.speed ? options.speed : getRandomInt(5) + 1;
        Object.keys(this.defaults).forEach((effect) => {
            this.defaults[effect] = this[effect];
        });
        // this.position = options?.position ? this.normalizePosition( options.position ) : this.normalizePosition( { x: getRandomInt( this.world.size ), y: getRandomInt( this.world.size ) } ) as Point;
        if (options?.position) {
            this.move(this.normalizePosition(options.position));
        }
        else {
            this.move(this.normalizePosition({ x: getRandomInt(this.world.size), y: getRandomInt(this.world.size) }));
        }
        ;
    }
    ;
    normalizePosition(to) {
        const result = to;
        if (result?.x >= this.world.size) {
            result.x = this.world.size - 1;
        }
        if (result?.y >= this.world.size) {
            result.y = this.world.size - 1;
        }
        if (result?.x < 0) {
            result.x = 0;
        }
        if (result?.y < 0) {
            result.y = 0;
        }
        return result;
    }
    ;
    /**
     * @description Health Getter
     * @public
     * @returns {number} health
     */
    get health() {
        return this.#health;
    }
    ;
    /**
     * @description Health Getter
     * @param {number} value
     * @public
     */
    set health(value) {
        this.#health = value;
        if (this.#health <= 0) {
            this.destroy();
        }
    }
    ;
    /**
     * @description Location Getter
     * @protected
     * @returns {MapLocation} location
     */
    get location() {
        return this.world[this?.position?.x ? this.position.x : 0][this?.position?.y ? this.position.y : 0];
    }
    ;
    /**
     * @description Location Setter
     * @param {MapLocation} location
     * @protected
     */
    set location(location) {
        location.addUnit(this);
        this.applyLocationEffects();
    }
    ;
    /**
     * @description Apply current location effects
     * @name applyLocationEffects
     * @protected
     */
    applyLocationEffects() {
        Object.keys(this.location.effects)
            .forEach((effect) => {
            if (this[effect]) {
                const newVal = effect === 'health' || effect === 'energy' ? Number(this[effect]) + Number(this.location.effects[effect]) : Number(this.defaults[effect]) + Number(this.location.effects[effect]);
                if (newVal < 0) {
                    this[effect] = 0;
                }
                else {
                    this[effect] = newVal;
                }
            }
        });
    }
    ;
    /**
     * @description Position Getter
     * @public
     * @returns {Point} position
     */
    get position() {
        return this.#position;
    }
    ;
    /**
     * @description Position Setter
     * @param {Point} position
     * @public
     */
    set position(position) {
        /**@ @description Removing unit from location */
        this.location.removeUnit(this);
        /** @description Recovery previous state values */
        Object.keys(this.defaults).forEach((effect) => {
            if (effect !== 'health' && effect !== 'energy') {
                this[effect] = this.defaults[effect];
            }
        });
        if (this.location.effects?.health) {
            this.health -= this.location.effects.health;
        }
        /** @description Change unit position */
        this.#position = this.normalizePosition(position);
        /** @description Set new location */
        this.location = this.world[this.position.x][this.position.y];
    }
    ;
    /**
     * @name lookAround
     * @protected
     */
    lookAround() {
        if (this.location.units.length) {
            this.location.units.forEach((unit) => {
                if (unit.name !== this.name) {
                    console.log(this.name, this.position, 'say: hello', unit.name);
                }
            });
        }
        /** @TODO Others actions */
    }
    ;
    /**
     * @default { x: 0 y: 0 }
     * @name move
     * @param {Point} to
     * @protected
     */
    move(to = { x: 0, y: 0 }) {
        const toRef = this.normalizePosition(to);
        // if ( JSON.stringify( this.position ) !== JSON.stringify( toRef ) ) {
        if (this.energy >= this.energy + this.world[toRef.x][toRef.y].effects.energy) {
            this.position = toRef;
            // } else {
            //   this.energy += 1;
        }
        // if ( this.energy < 0 ) {
        //   this.energy = 0;
        // }
        // }
        this.lookAround();
    }
    ;
    getArea(size = 1, point) {
        const pointRef = this.normalizePosition(point?.x ? point : this.position);
        const points = [];
        for (let x = pointRef.x - 1; x <= pointRef.x + size; x++) {
            const row = this.world[x];
            if (!!row) {
                for (let y = pointRef.y - 1; y <= pointRef.y + size; y++) {
                    if (!!row[y]) {
                        points.push({ x, y });
                    }
                }
            }
        }
        return points;
    }
    ;
    getRect(start, end) {
        const result = [];
        let topLeft;
        let topRight;
        let bottomLeft;
        let bottomRight;
        if (start.x >= end.x && start.y <= end.y) {
            topLeft = { x: end.x, y: start.y };
            topRight = start;
            bottomLeft = { x: end.x, y: end.y };
            bottomRight = { x: start.x, y: end.y };
        }
        console.log({ topLeft, topRight, bottomLeft, bottomRight });
        return result;
    }
    ;
    getPath(from, to) {
        const toRef = this.normalizePosition(to);
        const toRefString = JSON.stringify(toRef);
        const currentPositionString = JSON.stringify(from);
        const localPath = [];
        if (currentPositionString !== toRefString) {
            let done = false;
            // const rect: Point[] = this.getRect( from, toRef );
            while (!done) {
                const positionRef = localPath.length ? localPath.slice(-1)[0] : from;
                const positionString = JSON.stringify(positionRef);
                const area = this.getArea(1, positionRef);
                // area.forEach( ( point: Point, index: number ): void => {
                //   console.log( { index, point, energy: this.world[ point.x ][ point.y ].effects.energy } );
                // } );
                /** @description выбираем клетки в направлении конечной точки */
                const point = area.filter((point) => {
                    const pointString = JSON.stringify(point);
                    if (pointString !== toRefString && !done) {
                        if (positionString !== pointString) {
                            // if ( // right || left || top || bottom
                            //   ( ( toRef.x === positionRef.x && toRef.y < positionRef.y ) && ( point.y < positionRef.x && point.x <= positionRef.y ) ) ||
                            //   ( ( toRef.x === positionRef.x && toRef.y > positionRef.y ) && ( point.y > positionRef.x && point.x >= positionRef.y ) ) ||
                            //   ( ( toRef.x < positionRef.x && toRef.y === positionRef.y ) && ( point.y <= positionRef.x && point.x < positionRef.y ) ) ||
                            //   ( ( toRef.x > positionRef.x && toRef.y === positionRef.y ) && ( point.y >= positionRef.x && point.x > positionRef.y ) )
                            // ) {
                            //   return point;
                            // } else {
                            if ( // left top // right bottom
                            ((toRef.x >= positionRef.x && toRef.y >= positionRef.y) && (point.x >= positionRef.x && point.y >= positionRef.y)) ||
                                ((toRef.x <= positionRef.x && toRef.y <= positionRef.y) && (point.x <= positionRef.x && point.y <= positionRef.y)) ||
                                // right top // left bottom
                                ((toRef.x >= positionRef.x && toRef.y <= positionRef.y) && (point.x > positionRef.x && point.y < positionRef.y)) ||
                                ((toRef.x <= positionRef.x && toRef.y >= positionRef.y) && (point.x < positionRef.x && point.y > positionRef.y)) ||
                                ((toRef.x === positionRef.x && toRef.y < positionRef.y) && (point.y < positionRef.x && point.x <= positionRef.y)) ||
                                ((toRef.x === positionRef.x && toRef.y > positionRef.y) && (point.y > positionRef.x && point.x >= positionRef.y))) {
                                return point;
                            }
                            // }
                        }
                    }
                    else if (pointString === toRefString && !done) {
                        done = true;
                        localPath.push(point);
                        return point;
                    }
                })
                    /** @description выбираем клетку из области в направлении конечной точки */
                    // .filter( ( point: Point ): Point => {
                    //   const pointString: string = JSON.stringify( point );
                    //   if ( pointString !== toRefString && !done ) {
                    //     if ( positionString !== pointString ) {
                    //       if ( // left top || right bottom
                    //         ( ( toRef.x >= positionRef.x && toRef.y >= positionRef.y ) && ( point.x > positionRef.x && point.y > positionRef.y ) ) ||
                    //         ( ( toRef.x <= positionRef.x && toRef.y <= positionRef.y ) && ( point.x < positionRef.x && point.y < positionRef.y ) )
                    //       ) {
                    //         return point;
                    //       } else {
                    //         if ( // right top || left bottom
                    //           ( ( toRef.x >= positionRef.x && toRef.y <= positionRef.y ) && ( point.x > positionRef.x && point.y < positionRef.y ) ) ||
                    //           ( ( toRef.x <= positionRef.x && toRef.y >= positionRef.y ) && ( point.x < positionRef.x && point.y > positionRef.y ) )
                    //         ) {
                    //           return point;
                    //         }
                    //       }
                    //     }
                    //   } else if ( pointString === toRefString && !done ) {
                    //     done = true;
                    //     localPath.push( point );
                    //     return point;
                    //   }
                    // } );
                    /** @description Sort points by energy lowest coast */
                    .sort((a, b) => {
                    if (JSON.stringify(a) !== toRefString /* || JSON.stringify( b ) !== toRefString */) {
                        return this.world[a.x][a.y].effects.energy - this.world[b.x][b.y].effects.energy;
                    }
                    else {
                        done = true;
                        return -1;
                    }
                });
                if (!done) {
                    localPath.push(point[0]);
                }
                // console.log( { done, toRef, positionRef, point } );
            }
            // const nextPosition: Point = this.path.slice( -1 )[ 0 ] || this.position;
            // while ( JSON.stringify( nextPosition ) !== JSON.stringify( toRef ) ) {
            //   if ( toRef.x > nextPosition.x ) {
            //     nextPosition.x += 1;
            //   }
            //   if ( toRef.y > nextPosition.y ) {
            //     nextPosition.y += 1;
            //   }
            //   if ( toRef.x < nextPosition.x ) {
            //     nextPosition.x -= 1;
            //   }
            //   if ( toRef.y < nextPosition.y ) {
            //     nextPosition.y -= 1;
            //   }
            //   this.path.push( { ...this.normalizePosition( nextPosition ) } as Point );
            //   this.move( nextPosition );
            // }
        }
        return localPath;
    }
    ;
    getPathSummaryEffect(path, effect) {
        return path.reduce((result, point) => {
            result += this.world[point.x][point.y].effects[effect] ? this.world[point.x][point.y].effects[effect] : 0;
            return result;
        }, 0);
    }
    ;
    getBestPath(from, to) {
        const forwardPath = this.getPath(from, to);
        const backwardPath = this.getPath(forwardPath.slice(-1)[0], from);
        const coefficient1 = this.getPathSummaryEffect(forwardPath, 'energy');
        const coefficient2 = this.getPathSummaryEffect(backwardPath, 'energy');
        if (coefficient1 > 0 && coefficient2 > 0) {
            if (coefficient1 < coefficient2) {
                return forwardPath;
            }
            else {
                return backwardPath.reverse();
            }
        }
        if (coefficient1 < 0 && coefficient2 < 0) {
            if (coefficient1 > coefficient2) {
                return forwardPath;
            }
            else {
                return backwardPath.reverse();
            }
        }
        if (coefficient1 > 0 && coefficient2 <= 0) {
            return forwardPath;
        }
        if (coefficient1 <= 0 && coefficient2 > 0) {
            return backwardPath.reverse();
        }
    }
    ;
    moveTo(to) {
        this.path = this.getBestPath(this.position, to);
        this.path.forEach((point) => this.move(point));
    }
    ;
    /**
     * @name destroy
     * @protected
     */
    destroy() {
        this.location.removeUnit(this);
        clearTimeout(this.timerId);
        this.timerId = null;
    }
    ;
}
;
export { World };
