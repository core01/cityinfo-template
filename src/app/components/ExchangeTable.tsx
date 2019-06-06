import * as React from 'react';
import { useState, useEffect } from 'react';
// @ts-ignore
import styles from './ExchangeTable.module.css';
import * as socketIOClient from 'socket.io-client';
import ExchangeRate from './ExchangeRate';

interface BestCourses {
  [key: string]: number;
}

interface Props {
  rates: exchangeRate[];
  best: BestCourses;
  mode: string;
  setMode: Function;
  setSortBy: Function;
  selectPoint: Function;
}

interface State {
  selectedCurrency: string;
  sortBy: string;
  rates: exchangeRate[];
  filteredRates: exchangeRate[];
  filterQuery: string;
}

const ExchangeTable = (props: Props) => {
  const [currency, setCurrency] = useState('USD');
  const [filteredRates, setFilteredRates] = useState([]);
  const [query, setQuery] = useState('');

  const currencies: {
  [key: string]: string;
  } = {
    USD: 'https://www.cityinfo.kz/assets/images/flags/flag_usa_1.png',
    EUR: 'https://www.cityinfo.kz/assets/images/flags/European%20Union_1.png',
    RUB: 'https://www.cityinfo.kz/assets/images/flags/flag_russia_1.png',
    CNY: 'https://www.cityinfo.kz/assets/images/flags/flag_china_1.png',
    GBP: 'https://www.cityinfo.kz/assets/images/flags/flag_gb_1.png',
  };

  const changeCurrency = (event: any) => {
    setCurrency(event.target.value);
  };

  const filterRates = (event: any) => {
    const value = event.target.value.toLowerCase();
    let filteredRates: exchangeRate[] = [];
    if (value.length > 0) {
      filteredRates = props.rates.filter(rate => {
        return (
          rate.info.toLowerCase().indexOf(value) !== -1 ||
          rate.name.toLowerCase().indexOf(value) !== -1
        );
      });
    }

    setFilteredRates(filteredRates);
    setQuery(value);
  };

  const setSortBy = (field: string) => {
    props.setSortBy(field);
  };

  useEffect(() => {
    const socket = socketIOClient(process.env.SOCKET_URL, {
      path: '/ws',
    });
    socket.emit('join', 2);
    socket.on('update', (data: any) => {
      console.log('RECEIVED FROM SOCKET', data);
    });
  }, []);

  const setMode = (mode: string) => {
    props.setMode(mode);
  };

  let rates = props.rates;
  let best: BestCourses = props.best;
  let title = 'Розничные курсы';
  if (props.mode === 'wholesale') {
    title = 'Оптовые курсы';
  }

  if (query.length > 0) {
    rates = filteredRates;

    if (filteredRates.length < 1) {
      title = 'Ничего не найдено';
    }
  }

  const rows = rates.map(rate => {
    if(rate['buy' + currency] > 0 || rate['sell' + currency] > 0){
      return (
        <ExchangeRate rate={rate} currency={currency} key={rate.id} best={best} selectPoint={props.selectPoint} />
      );
    }
  });

  return (
    <table className={styles.Table}>
      <thead>
        <tr>
          <th colSpan={5}>
            <h4 className={styles.CityTitle}>
              Курсы обмена валюты в г. Усть-Каменогорск
            </h4>
          </th>
        </tr>
        <tr>
          <th
            className={styles.RetailColumn}
            onClick={setMode.bind(this, 'retail')}
          >
            Розница
          </th>
          <th
            className={styles.WholesaleColumn}
            onClick={setMode.bind(this, 'wholesale')}
          >
            Опт
          </th>
          <th colSpan={3}>
            <div className={styles.Filter}>
              <label>Поиск</label>
              <input
                type="text"
                onChange={filterRates}
              />
            </div>
          </th>
        </tr>
        <tr>
          <th
            rowSpan={2}
            colSpan={2}
            className={styles.PointColumn}
            onClick={setSortBy.bind(this, 'date_update')}
          >
            Обменный пункт
          </th>
          <th rowSpan={2} className={styles.PhonesColumn}>
            Телефоны
          </th>
          <th colSpan={2} className={styles.CurrencySelectColumn}>
            <img
              src={currencies[currency]}
              alt={currency}
            />
            <select
              name="currency"
              id="currency"
              value={currency}
              onChange={changeCurrency}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="RUB">RUB</option>
              <option value="CNY">CNY</option>
              <option value="GBP">GBP</option>
            </select>
          </th>
        </tr>
        <tr>
          <th
            className={styles.CurrencyColumn}
            onClick={setSortBy.bind(this, 'buy' + currency)}
          >
            покуп
          </th>
          <th
            className={styles.CurrencyColumn}
            onClick={setSortBy.bind(this, 'sell' + currency)}
          >
            прод
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            colSpan={5}
            className={styles.TitleRow}
          >
            <h5 className={styles.RatesTitle}>{title}</h5>
          </td>
        </tr>
        {rows}
      </tbody>
    </table>
  );
};

export default ExchangeTable;
