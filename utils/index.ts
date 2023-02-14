'use strict';

export const getRandomInt = ( digits: number = 1 ): number => {
  Math.random();
  return Math.round( Math.random() * digits );
};
