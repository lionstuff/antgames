'use strict';

import {
  LocationType,
  Point,
} from './../types';

import { Unit } from './../classes';

export interface IUnitOptions {
  readonly name: string;
  position: Point;
};

export interface ILocationEffects {
  readonly armor?: number;
  readonly energy?: number;
  readonly health?: number;
  readonly power?: number;
  readonly speed?: number;
};

export interface ILocationOptions {
  readonly effects: ILocationEffects;
  readonly size: number; /** @TODO */
  readonly type: LocationType;
  readonly units: Unit[];
  readonly weight: number; /** @TODO */
};
