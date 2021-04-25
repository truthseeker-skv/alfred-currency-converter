import { ICurrency, ICurrencyPair } from './types';
import workflow from './workflow';

export interface IConfig {
  isRatesLoading: boolean;
  currencies: Array<string>;
  pinnedPair: ICurrencyPair | null;
}

export interface ICache {
  currencyRates: Record<ICurrency['code'], ICurrency>;
}

export const config = workflow.config;
export const cache = workflow.cache;
