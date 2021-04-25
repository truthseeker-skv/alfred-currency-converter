import { ICurrency } from '../types';
import { loadPageDom } from '../utils';
import workflow from '../workflow';

(async () => {
  workflow.setIsRatesLoading(true);
  await loadCurrencies()
    .then((rates) => {
      workflow.setIsRatesLoading(false);
      workflow.setCurrencyRates(rates);
    });
})();

export async function loadCurrencies(): Promise<Record<string, ICurrency>> {
  try {
    const dom = await loadPageDom('https://www.cbr.ru/currency_base/daily/');

    const result = Array.from(dom.querySelectorAll('table.data tr'))
      .slice(1)
      .reduce((acc: Record<string, ICurrency>, row) => {
        const [_, code, num, name, rate] = Array.from(row.querySelectorAll('td')).map(it => it.textContent.trim());

        acc[code] = {
          code,
          name,
          rate: parseFloat(rate.replace(',', '.')) / parseInt(num, 10),
        };

        return acc;
      }, {});

    return result
      ? { RUB: { code: 'RUB', name: 'Российский рубль', rate: 1 }, ...result }
      : {};
  } catch (err) {
    throw new Error(`Failed to load currencies rates.\r\n${err.message}`);
  }
}
