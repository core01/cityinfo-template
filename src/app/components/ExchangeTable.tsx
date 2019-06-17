import * as React from 'react';
import { useState, useEffect } from 'react';
// @ts-ignore
import styles from './ExchangeTable.module.css';
import ExchangeRate from './ExchangeRate';
import { currencies, currencyFlags } from '../constants';

interface BestCourses {
  [key: string]: number;
}

interface Props {
  rates: ExchangeRate[];
  best: BestCourses;
  mode: string;
  setMode: Function;
  setSortBy: Function;
  selectPoint: Function;
}

const ExchangeTable = (props: Props) => {
  const [currency, setCurrency] = useState('USD');
  const [filteredRates, setFilteredRates] = useState([]);
  const [query, setQuery] = useState('');

  const changeCurrency = (event: any) => {
    setCurrency(event.target.value);
  };

  const filterRates = (event: any) => {
    const value = event.target.value.toLowerCase();
    let filteredRates: ExchangeRate[] = [];
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

  const setHeadWrapperPadding = () => {
    const contentWrapper = document.getElementById('content-table-wrapper');
    const table = contentWrapper.getElementsByTagName('table')[0];
    // get scrollWidth
    const scrollWidth = contentWrapper.offsetWidth - table.offsetWidth;
    const headWrapper = document.getElementById('head-table-wrapper');
    // set padding-right as scrollwidth minus 1px
    headWrapper.style.paddingRight = scrollWidth - 1 + 'px';
  };

  useEffect(() => {
    // fix head table width
    window.addEventListener('load', setHeadWrapperPadding);
    window.addEventListener('resize', setHeadWrapperPadding);

    return () => {
      window.removeEventListener('load', setHeadWrapperPadding);
      window.removeEventListener('resize', setHeadWrapperPadding);
    };
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
  const notEmptyRates = rates.filter(rate => {
    return rate['buy' + currency] > 0 || rate['sell' + currency] > 0;
  });

  if (notEmptyRates.length === 0) {
    title = 'Нет курсов по данной валюте';
  }

  const rows = notEmptyRates.map(rate => {
    if (rate['buy' + currency] > 0 || rate['sell' + currency] > 0) {
      return (
        <ExchangeRate
          rate={rate}
          currency={currency}
          key={rate.id}
          best={best}
          selectPoint={props.selectPoint}
        />
      );
    }
  });

  const selectOptions = currencies.map(currency => {
    return (
      <option value={currency} key={currency}>
        {currency}
      </option>
    );
  });
  const tabActiveClass =
    'inline-block py-2 px-4 text-white bg-pelorous-500 text-white font-semibold cursor-pointer';
  const tabInActiveClass =
    'inline-block py-2 px-4 text-blue-500 hover:underline font-semibold cursor-pointer';
  return (
    <React.Fragment>
      <div className={styles.HeadTableWrapper} id="head-table-wrapper">
        <div className="flex mb-1">
          <div className="w-1/2">
            <ul className="flex">
              <li className="mr-1">
                <a
                  className={
                    props.mode === 'retail' ? tabActiveClass : tabInActiveClass
                  }
                  onClick={setMode.bind(this, 'retail')}
                >
                  Розница
                </a>
              </li>
              <li className="mr-1">
                <a
                  className={
                    props.mode === 'wholesale'
                      ? tabActiveClass
                      : tabInActiveClass
                  }
                  onClick={setMode.bind(this, 'wholesale')}
                >
                  Опт
                </a>
              </li>
            </ul>
          </div>
          <div className={[styles.Filter, 'w-1/2'].join(' ')}>
            <label>Поиск</label>
            <input type="text" onChange={filterRates} />
          </div>
        </div>
        <table cellPadding="0" cellSpacing="0">
          <thead>
            <tr>
              <th
                rowSpan={2}
                className={styles.PointColumn}
                onClick={setSortBy.bind(this, 'date_update')}
              >
                Обменный пункт
              </th>
              <th rowSpan={2} className={styles.PhonesColumn}>
                Телефоны
              </th>
              <th colSpan={2} className={styles.CurrencySelectColumn}>
                <img src={currencyFlags[currency]} alt={currency} />
                <select
                  name="currency"
                  id="currency"
                  value={currency}
                  onChange={changeCurrency}
                >
                  {selectOptions}
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
        </table>
      </div>
      <div className={styles.ContentTableWrapper} id="content-table-wrapper">
        <table cellPadding="0" cellSpacing="0">
          <tbody>
            <tr>
              <td colSpan={4} className={styles.TitleRow}>
                <h5 className={styles.RatesTitle}>{title}</h5>
              </td>
            </tr>
            {rows}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};

export default ExchangeTable;
