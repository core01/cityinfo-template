const SET_RATES = 'SET_RATES';
const UPDATE_RATE = 'UPDATE_RATE';
const SET_BEST_RATES = 'SET_BEST_RATES';
const SET_MODE = 'SET_MODE';
const SET_SORT_BY = 'SET_SORT_BY';
const SET_SELECTED_POINT = 'SET_SELECTED_POINT';

interface SetRatesAction {
  type: typeof SET_RATES;
  payload: ExchangeRate[];
}

interface UpdateRateAction {
  type: typeof UPDATE_RATE;
  payload: {
    index: number;
    rate: ExchangeRate;
  };
}

interface SetBestRatesAction {
  type: typeof SET_BEST_RATES;
  payload: BestRates;
}

interface SetModeAction {
  type: typeof SET_MODE;
  payload: string;
}

interface SetSortByAction {
  type: typeof SET_SORT_BY;
  payload: string;
}

interface SetSelectedPoint {
  type: typeof SET_SELECTED_POINT;
  payload: number;
}

export {
  SET_RATES,
  SET_BEST_RATES,
  UPDATE_RATE,
  SET_MODE,
  SET_SORT_BY,
  SET_SELECTED_POINT,
};
export type ActionTypes =
  | SetRatesAction
  | UpdateRateAction
  | SetBestRatesAction
  | SetModeAction
  | SetSortByAction
  | SetSelectedPoint;
