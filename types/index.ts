'use strict';

import {
  ILocationEffects,
  IUnitOptions,
} from './../interfaces';

/**
 * @enum {string}
 * @readonly
 */
export enum LocationType {
  dirt = 'dirt',
  forest = 'forest',
  grass = 'grass',
  ground = 'ground',
  ice = 'ice',
  sand = 'sand',
  snow = 'snow',
  stone = 'stone',
  swamp = 'swamp',
  water = 'water',
};

export type Point = { x: number; y: number; };

export type UnitOptions = ILocationEffects & IUnitOptions;
