const sortRates = (rates: ExchangeRate[], sortBy: string) => {
  if (sortBy.substr(0, 3) === 'sel') {
    let zeroedRates: ExchangeRate[] = [];
    const filteredRates = rates.filter(rate => {
      if (rate[sortBy] === 0) {
        zeroedRates.push(rate);

        return false;
      }

      return true;
    });

    filteredRates.sort((first, second) => {
      if (first[sortBy] > second[sortBy] || first[sortBy] === 0) {
        return 1;
      }
      if (first[sortBy] < second[sortBy]) {
        return -1;
      }
      if (first[sortBy] === 0 && second[sortBy] > 0) {
        return 1;
      }
      if (first[sortBy] > 0 && second[sortBy] === 0) {
        return -1;
      }

      return 0;
    });

    rates = filteredRates.concat(zeroedRates);
  } else if (sortBy.substr(0, 3) === 'buy') {
    rates.sort((first, second) =>
      first[sortBy] < second[sortBy]
        ? 1
        : first[sortBy] > second[sortBy]
        ? -1
        : 0
    );
  } else {
    rates.sort((first, second) =>
      first.date_update > second.date_update
        ? -1
        : first.date_update < second.date_update
        ? 1
        : 0
    );
  }

  return rates;
};

const getBuy = (rate: ExchangeRate, currency: string, best: BestRates) => {
  return getCurrencyValueAndBest(rate, currency, best, 'buy');
};

const getSell = (rate: ExchangeRate, currency: string, best: BestRates) => {
  return getCurrencyValueAndBest(rate, currency, best, 'sell');
};
const getCurrencyValueAndBest = (
  rate: ExchangeRate,
  currency: string,
  best: BestRates,
  type: string = 'buy'
) => {
  const key = type + currency;

  return {
    value: rate[key] === 0 ? '-' : rate[key],
    best: rate[key] === best[key],
  };
};

const getModeTitle = (mode: string) => {
  const titles: {
    [key: string]: string;
  } = {
    retail: 'Розничные курсы',
    wholesale: 'Оптовые курсы',
  };
  return titles[mode];
};
export { sortRates, getBuy, getSell, getModeTitle };
