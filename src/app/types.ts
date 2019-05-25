declare interface exchangeRate {
  id: number,
  name: string,
  buyUSD: number,
  sellUSD: number,
  buyEUR: number,
  sellEUR: number,
  buyRUB: number,
  sellRUB: number,
  buyCNY: number,
  sellCNY: number,
  buyGBP: number,
  info: string,
  phones: string,
  date_update: number,
  day_and_night: number,
  published: number,
  city_id: number,

  [key: string]: string | number;
}