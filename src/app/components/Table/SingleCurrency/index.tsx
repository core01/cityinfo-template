import * as React from 'react';
import { useState, useEffect } from 'react';
import * as styles from './index.module.css';
import Row from './row';
import CurrencySelect from '@app/components/CurrencySelect';
import { getModeTitle } from '@app/utils';

interface Props {
  rates: ExchangeRate[];
  best: BestRates;
  mode: string;
  setSortBy: Function;
  selectPoint: Function;
}

const SingleCurrencyTable = (props: Props) => {
  const [currency, setCurrency] = useState('USD');
  const [filteredRates, setFilteredRates] = useState([]);
  const [query, setQuery] = useState('');

  const changeCurrency = (currency: string) => {
    setCurrency(currency);
  };

  const filterRates = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  let rates = props.rates;
  let best: BestRates = props.best;
  let title = getModeTitle(props.mode);

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
    if (
      (rate['buy' + currency] > 0 || rate['sell' + currency] > 0) &&
      rate.published &&
      !rate.hidden
    ) {
      return (
        <Row
          rate={rate}
          currency={currency}
          key={rate.id}
          best={best}
          selectPoint={props.selectPoint}
        />
      );
    }
  });

  return (
    <div className={styles.Wrapper}>
      <div className={styles.HeadTableWrapper} id="head-table-wrapper">
        <div className="flex mb-1">
          <div className={[styles.Filter, 'w-full'].join(' ')}>
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
                <CurrencySelect
                  currency={currency}
                  onChangeCurrency={changeCurrency}
                />
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
    </div>
  );
};

export default SingleCurrencyTable;
