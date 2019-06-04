import * as React from 'react';
// @ts-ignore
import styles from './ExchangeTable.module.css';
import * as socketIOClient from 'socket.io-client';
import axios from 'axios';
import ExchangeRate from './ExchangeRate';

interface BestCourses {
  [key: string]: number
}

interface Props {
  rates: exchangeRate[],
  best: BestCourses,
  mode: string,
  setMode: Function,
}

interface State {
  selectedCurrency: string,
  sortBy: string,
  rates: exchangeRate[],
  filteredRates: exchangeRate[],
  filterQuery: string,
}

class ExchangeTable extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props);
    this.setState({rates: props.rates});
    this.changeCurrency = this.changeCurrency.bind(this);
    this.filterRates = this.filterRates.bind(this);
  }

  currencies: {
    [key: string]: string
  } = {
    'USD': 'https://www.cityinfo.kz/assets/images/flags/flag_usa_1.png',
    'EUR': 'https://www.cityinfo.kz/assets/images/flags/European%20Union_1.png',
    'RUB': 'https://www.cityinfo.kz/assets/images/flags/flag_russia_1.png',
    'CNY': 'https://www.cityinfo.kz/assets/images/flags/flag_china_1.png',
    'GBP': 'https://www.cityinfo.kz/assets/images/flags/flag_gb_1.png',
  };

  state: State = {
    selectedCurrency: 'USD',
    sortBy: 'date_update',
    filteredRates: [],
    filterQuery: '',
    rates: this.props.rates,
  };

  changeCurrency (event: any) {
    this.setState({ selectedCurrency: event.target.value });
  }

  filterRates (event: any) {
    const value = event.target.value.toLowerCase();
    let filteredRates: exchangeRate[] = [];
    if (value.length > 0) {
      filteredRates = this.props.rates.filter(rate => {
        return rate.info.toLowerCase().indexOf(value) !== -1 || rate.name.toLowerCase().indexOf(value) !== -1;
      });
    }
    this.setState({ filteredRates: filteredRates, filterQuery: value });
  }

  private sortRates (): void {
    const sortBy = this.state.sortBy;
    console.log('sortRates fired', sortBy);

    let rates: exchangeRate[] = this.state.rates;

    if (sortBy.substr(0, 3) === 'sel') {
      let zeroedRates: exchangeRate[] = [];
      const filteredRates = rates.filter(rate => {
        if (rate[sortBy] === 0) {
          zeroedRates.push(rate);
          return false;
        }
        return true;

      });
      filteredRates.sort((first, second) => {
        if (first[sortBy] > second[sortBy] || (first[sortBy] === 0)) {
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
    } else {

      rates.sort((first, second) => (first[sortBy] < second[sortBy]) ? 1 : first[sortBy] > second[sortBy] ? -1 : 0);

    }

    this.setState({ rates: rates });
  };

  sortRatesBy (field: string) {
    this.setSortBy(field, this.sortRates);
  }

  private setSortBy (field: string, callback: () => void) {
    this.setState({ sortBy: field }, callback);
  }

  componentDidMount () {
    const socket = socketIOClient(process.env.SOCKET_URL, {
      path: '/ws',
    });
    socket.emit('join', 2);
    socket.on('update', (data: any) => {
      console.log('RECEIVED FROM SOCKET', data);
    });
  }

  switchMode (mode: string) {
    this.props.setMode(mode);
    this.setState({
      filteredRates: [],
    });
    this.sortRates();
  }

  render () {
    let rates = this.state.rates;
    let best: BestCourses;
    let title = 'Розничные курсы';
    if (this.props.mode === 'wholesale') {
      title = 'Оптовые курсы';
    }

    if (this.state.filterQuery.length > 0) {
      rates = this.state.filteredRates;

      if (this.state.filteredRates.length < 1) {
        title = 'Ничего не найдено';
      }
    }

    const rows = rates.map(rate => {
      return <ExchangeRate rate={rate} currency={this.state.selectedCurrency} key={rate.id}
                           best={best}/>;
    });

    return (
      <table className={styles.Table}>
        <thead>
        <tr>
          <th colSpan={5}>
            <h4 className="text-xl font-normal">Курсы обмена валюты в г. Усть-Каменогорск</h4>
          </th>
        </tr>
        <tr>
          <th className="bg-red-500 cursor-pointer" onClick={this.switchMode.bind(this, 'retail')}>
            Розница
          </th>
          <th className="bg-green-500 cursor-pointer" onClick={this.switchMode.bind(this, 'wholesale')}>
            Опт
          </th>
          <th colSpan={3}>
            <div className="flex justify-around">
              <label className="block align-middle py-1">Поиск </label>
              <input
                type="text"
                className="border p-1 border-black inline w-32 h-6 py-1 block"
                onChange={this.filterRates}
              />
            </div>
          </th>
        </tr>
        <tr>
          <th
            rowSpan={2}
            colSpan={2}
            className={styles.PointColumn}
            onClick={this.sortRatesBy.bind(this, 'date_update')}
          >
            Обменный пункт
          </th>
          <th rowSpan={2} className={styles.PhonesColumn}>Телефоны</th>
          <th colSpan={2}>
            <img
              className="align-middle inline-block mr-2"
              src={this.currencies[this.state.selectedCurrency]}
              alt={this.state.selectedCurrency}/>
            <select name="currency" id="currency" value={this.state.selectedCurrency} onChange={this.changeCurrency}>
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
            onClick={this.sortRatesBy.bind(this, 'buy' + this.state.selectedCurrency)}
          >
            покуп
          </th>
          <th
            className={styles.CurrencyColumn}
            onClick={this.sortRatesBy.bind(this, 'sell' + this.state.selectedCurrency)}
          >
            прод
          </th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td colSpan={5} className={[styles.TitleRow, 'text-center'].join(' ')}>
            <h5 className="text-xl">{title}</h5>
          </td>
        </tr>
        {rows}
        </tbody>
      </table>
    );
  }
}

export default ExchangeTable;