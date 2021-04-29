import round from 'lodash/round';
import isNumber from 'lodash/isNumber';

import { run, createItem, createInfoItem } from '@truthseeker-skv/alfred-workflow';

import { pinPairAction, Action } from '../actions';
import { ICurrencyPair } from '../types';
import workflow from '../workflow';

async function main() {
  if (workflow.action.name === Action.PinPair) {
    workflow.setPinnedPair(workflow.action.payload);
  }

  const { price, query } = explodeInput(workflow.input);
  const currencies = workflow.currencies();
  const pinnedPair = workflow.pinnedPair();

  const currenciesPairs = pinnedPair && !query
    ? [pinnedPair]
    : filterCurrencyPairs(currencies, query);

  if (!currenciesPairs.length) {
    workflow.sendResult(
      createInfoItem({ title: 'Currency not found.' }),
    );
    return;
  }

  workflow.sendResult(
    currenciesPairs.map((pair) => (
      createItem({
        title: renderItemTitle({ price, pair }),
        valid: true,
        arg: isNumber(price) ? String(price) : '',
        action: pinPairAction(pair),
      })
    )),
    { rerunInterval: 1 },
  );
}

function explodeInput(input: string) {
  const { price, query } = /(?<price>[\d ]+) *(?<query>[^\d]+)?$/gmi.exec(input)?.groups || {};

  return {
    price: parseFloat(price?.replace(/ /gm, '').replace(',', '.')) || null,
    query: query || null,
  };
}

interface IRenderItemTitleParams {
  price: number | null;
  pair: ICurrencyPair;
}

function renderItemTitle({ price, pair }: IRenderItemTitleParams) {
  const rates = retrieveCurrenciesRates();
  const renderPair = (content: string) => `${pair.from} ➞ ${pair.to}  ⎪  ${content}`;

  if (!rates || workflow.isRatesLoading()) {
    return renderPair('Loading...');
  }

  const convertedPrice = convertPrice({ price, from: pair.from, to: pair.to, rates });

  return renderPair(
    convertedPrice
      ? convertedPrice
      : 'Failed to convert price.'
  );
}

interface IConvertPriceParams {
  price: number | null;
  from: string;
  to: string;
  rates: Record<string, number> | null;
}

function convertPrice(params: IConvertPriceParams) {
  const price = params.price;
  const rates = params.rates;

  if (!price || !rates) {
    return null;
  }

  const fromRate = rates[params.from];
  const toRate = rates[params.to];

  // TODO: needs to resolve locale with config + add possibility to change it dynamically
  return new Intl.NumberFormat('ru-Ru', { style: 'currency', currency: params.to })
    .format(round(price * toRate / fromRate, 2));
}

function retrieveCurrenciesRates(): Record<string, number> | null {
  const rates = workflow.currencyRates() as Record<string, number>;

  if (!workflow.isRatesLoading() && !rates) {
    runUpdateCurrenciesRatesScript();
    return null;
  }

  return rates;
}

function runUpdateCurrenciesRatesScript(): void {
  workflow.runExternal({ trigger: 'upd-rates' });
}

function filterCurrencyPairs(currencies: Array<string>, query: string | null): Array<ICurrencyPair> {
  const hasMatch = (fromCurr: string, toCurr: string) => {
    if (!query) {
      return true;
    }

    const [fromChar, toChar] = query.toLowerCase().split('');

    return fromCurr.toLowerCase().startsWith(fromChar) && (!toChar || toCurr.toLowerCase().startsWith(toChar));
  };

  return currencies.reduce((acc: Array<ICurrencyPair>, cur: string) => {
    return acc.concat(
      currencies
        .filter((it) => (it !== cur) && hasMatch(cur, it))
        .map((it) => ({
          from: cur,
          to: it,
        })),
    );
  }, []);
}

run(main);
