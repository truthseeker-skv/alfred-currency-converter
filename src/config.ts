import { ICurrencyPair } from './types';
import workflow from './workflow';

export interface IConfig {
  currencies: Array<string>;
  pinnedPair: ICurrencyPair | null;
}

export interface ICache {
  isRatesLoading: boolean;
  currencyRates: Record<string, number>;
}

export const config = workflow.config;
export const cache = workflow.cache;
