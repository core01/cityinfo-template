declare interface ExchangeRate {
  id: number;
  name: string;
  buyUSD: number;
  sellUSD: number;
  buyEUR: number;
  sellEUR: number;
  buyRUB: number;
  sellRUB: number;
  buyCNY: number;
  sellCNY: number;
  buyGBP: number;
  info: string;
  phones: string | string[];
  date_update: number;
  day_and_night: number;
  published: number;
  company_id: number;
  longitude: number;
  latitude: number;

  [key: string]: string | number | string[];
}

declare interface ExchangeRateUpdate extends ExchangeRate {
  city_id: number;
}
