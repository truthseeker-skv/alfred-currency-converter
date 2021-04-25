import { IAction } from '@truthseeker-skv/alfred-workflow';

import { ICurrencyPair } from './types';

export enum Action {
  PinPair = 'pin-pair',
}

export function pinPairAction(pair: ICurrencyPair): IAction<ICurrencyPair> {
  return {
    name: Action.PinPair,
    payload: pair,
  };
}

