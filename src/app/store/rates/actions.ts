import {
  SET_RATES,
  ActionTypes,
  UPDATE_RATE,
  SET_BEST_RATES,
  SET_MODE,
  SET_SORT_BY,
  SET_SELECTED_POINT,
} from './types';

const setRates = (rates: ExchangeRate[]): ActionTypes => {
  return {
    type: SET_RATES,
    payload: rates,
  };
};

const updateRate = (rate: ExchangeRate, index: number): ActionTypes => {
  return {
    type: UPDATE_RATE,
    payload: {
      rate,
      index,
    },
  };
};

const setBestRates = (bestRates: BestRates): ActionTypes => {
  return {
    type: SET_BEST_RATES,
    payload: bestRates,
  };
};

const setMode = (mode: string): ActionTypes => {
  return {
    type: SET_MODE,
    payload: mode,
  };
};

const setSortBy = (sortBy: string): ActionTypes => {
  return {
    type: SET_SORT_BY,
    payload: sortBy,
  };
};

const setSelectedPoint = (selected: number): ActionTypes => {
  return {
    type: SET_SELECTED_POINT,
    payload: selected,
  };
};

export {
  setRates,
  updateRate,
  setBestRates,
  setMode,
  setSortBy,
  setSelectedPoint,
};
