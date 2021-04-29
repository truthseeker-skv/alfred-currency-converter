import { getWorkflow } from '@truthseeker-skv/alfred-workflow/lib/workflow';

import { IConfig, ICache } from './config';
import { ICurrencyPair } from './types';

const DEFAULT_CURRENCIES = ['BYN', 'RUB', 'USD', 'EUR', 'KZT', 'UAH', 'CAD', 'PLN' ,'GBP'];

const workflow = getWorkflow<IConfig, ICache>({
  configOptions: {},
  cacheOptions: {},
});

if (!workflow.config.get('currencies', []).length) {
  workflow.config.set('currencies', DEFAULT_CURRENCIES);
}

export default {
  ...workflow,

  currencies: () => workflow.config.get('currencies'),
  isRatesLoading: () => workflow.cache.get('isRatesLoading'),
  currencyRates: () => workflow.cache.get('currencyRates'),
  pinnedPair: () => workflow.config.get('pinnedPair', null),

  setIsRatesLoading: (isLoading: boolean) => workflow.cache.set('isRatesLoading', isLoading, { maxAge: 5000 }),
  setCurrencyRates: (rates: Record<string, number>) => (
    workflow.cache.set('currencyRates', rates, { maxAge: 60 * 60 * 1000 })
  ),
  setPinnedPair: (pair: ICurrencyPair) => workflow.config.set('pinnedPair', pair),
};
