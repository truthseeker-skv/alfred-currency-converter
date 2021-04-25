export interface ICurrency {
  code: string;
  name: string;
  rate: number;
}

export interface ICurrencyPair {
  from: string;
  to: string;
}
