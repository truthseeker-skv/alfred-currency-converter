import { getWorkflow } from '@truthseeker-skv/alfred-workflow/lib/workflow';

import { IConfig, ICache } from './config';
import { ICurrency, ICurrencyPair } from './types';

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
  isRatesLoading: () => workflow.config.get('isRatesLoading', false),
  currencyRates: () => workflow.cache.get('currencyRates'),
  pinnedPair: () => workflow.config.get('pinnedPair', null),

  setIsRatesLoading: (isLoading: boolean) => workflow.config.set('isRatesLoading', isLoading),
  setCurrencyRates: (rates: Record<string, ICurrency>) => (
    workflow.cache.set('currencyRates', rates, { maxAge: 60 * 60 * 1000 })
  ),
  setPinnedPair: (pair: ICurrencyPair) => workflow.config.set('pinnedPair', pair),
};
