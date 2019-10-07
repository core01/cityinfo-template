import * as React from 'react';
import { Fragment } from 'react';
import { connect } from 'react-redux';
import { AppState } from '@app/store';
import { currencies, currencyFlags } from '@app/constants';
import { State as RatesState } from '@app/store/rates/reducers';
import {
  setSortBy,
  setSelectedPoint,
  setMode,
  setRates,
} from '@app/store/rates/actions';
import Row from './row';
import * as styles from './index.module.css';
import { sortRates, getModeTitle } from '@app/utils';

interface Props {
  rates: RatesState;

  // setMode: Function;
  setSortBy: Function;
  setRates: Function;
  // selectPoint: Function;
}

const Table = (props: Props) => {
  const { rates, best, mode } = props.rates;

  const setSortBy = (value: string) => {
    props.setSortBy(value);
    const newRates = sortRates(rates, value);
    props.setRates(newRates);
  };

  const title = getModeTitle(mode);
  const currencyThs = currencies.map(currency => (
    <th colSpan={2} key={currency} className="text-center">
      <div className="flex justify-around items-center">
        <img src={currencyFlags[currency]} alt={currency} />
        <span>{currency}</span>
      </div>
    </th>
  ));

  const currencySortTh = currencies.map(currency => (
    <Fragment key={currency}>
      <th
        className="cursor-pointer"
        onClick={setSortBy.bind(this, 'buy' + currency)}
      >
        покуп
      </th>
      <th
        className="cursor-pointer"
        onClick={setSortBy.bind(this, 'sell' + currency)}
      >
        прод
      </th>
    </Fragment>
  ));

  const rows = rates.map(rate => (
    <Row rate={rate} best={best} selectPoint={() => {}} key={rate.id} />
  ));
  return (
    <table cellPadding="0" cellSpacing="0" className="exchangeTable">
      <thead>
        <tr>
          <th rowSpan={2} className="text-center title" onClick={null}>
            Обменный пункт
          </th>
          {currencyThs}
          <th rowSpan={2} className="text-center phones">
            Телефоны
          </th>
        </tr>
        <tr>{currencySortTh}</tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan={12}>
            <h5 className={styles.RatesTitle}>{title}</h5>
          </td>
        </tr>
        {rows}
      </tbody>
    </table>
  );
};

const mapStateToProps = (state: AppState) => ({
  rates: state.rates,
});

const actionCreators = {
  setSortBy,
  setRates,
};

export default connect(
  mapStateToProps,
  actionCreators
)(Table);
