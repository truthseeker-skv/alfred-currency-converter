import axios from 'axios';

import { logger } from '@truthseeker-skv/alfred-workflow';

import workflow from '../workflow';

(async () => {
  workflow.setIsRatesLoading(true);

  logger.log('response#start');

  await loadCurrencies()
    .then((rates) => {
      workflow.setIsRatesLoading(false);
      workflow.setCurrencyRates(rates);
    });
})();

export async function loadCurrencies(): Promise<Record<string, number>> {
  try {
    const response = await axios.get('https://www.cbr-xml-daily.ru/latest.js');

    logger.log('response: ', response.data);

    return { RUB: 1, ...response.data.rates };
  } catch (err) {
    throw new Error(`Failed to load currencies rates.\r\n${err.message}`);
  }
}
