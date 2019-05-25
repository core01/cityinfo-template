import * as React from 'react';
// @ts-ignore
import styles from './ExchangeTable.module.css';
import * as socketIOClient from 'socket.io-client';
import axios from 'axios';
import * as dayjs from 'dayjs';
import ExchangeRate from './ExchangeRate';

interface Props {
  retailCityId: number,
  wholesaleCityId: number,
}

interface State {
  selectedCurrencies: string[],
  sortBy: string,
  retailRates: exchangeRate[],
  wholesaleRates: exchangeRate[],
}

class ExchangeTable extends React.Component<Props, State> {
  currencies: {
    [key: string]: string
  } = {
    'USD': 'https://cityinfo.kz/assets/images/flags/flag_usa_1.png',
    'EUR': 'https://cityinfo.kz/assets/images/flags/European%20Union_1.png',
    'RUB': 'https://cityinfo.kz/assets/images/flags/flag_russia_1.png',
    'CNY': 'https://www.cityinfo.kz/assets/images/flags/flag_china_1.png',
    'GBP': 'https://www.cityinfo.kz/assets/images/flags/flag_gb_1.png',
  };

  state: State = {
    selectedCurrencies: [
      'USD', 'EUR', 'RUB',
    ],
    sortBy: 'date_update',
    retailRates: [],
    wholesaleRates: [],
  };

  static sortRates (sortBy: string) {
    console.log(sortBy);
  };

  componentWillMount (): void {
    axios.all([
      axios.get(process.env.API_URL + '/courses/' + this.props.retailCityId),
      axios.get(process.env.API_URL + '/courses/' + this.props.wholesaleCityId),
    ]).then(responses => {
      this.setState({
        retailRates: responses[0].data.rates,
        wholesaleRates: responses[0].data.rates,
      });
    });
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

  render () {
    const flags = this.state.selectedCurrencies.map((currency) => {
      return (
        <th colSpan={2} key={currency}>
          <img src={this.currencies[currency]} alt={currency}/> {currency}
        </th>
      );
    });

    const retailRows = this.state.retailRates.map(rate => {
      return <ExchangeRate rate={rate} currencies={this.state.selectedCurrencies} key={rate.id}/>;
    });

    const wholesaleRows = this.state.wholesaleRates.map(rate => {
      return <ExchangeRate rate={rate} currencies={this.state.selectedCurrencies} key={rate.id}/>;
    });

    let retailTitle = null;
    if (retailRows) {
      retailTitle = (<tr>
        <td colSpan={8} className='text-center'>
          <h5>Розничные курсы</h5>
        </td>
      </tr>);
    }
    let wholesaleTitle = null;
    if (wholesaleRows) {
      wholesaleTitle = (<tr>
        <td colSpan={8} className='text-center'>
          <h5>Оптовые курсы</h5>
        </td>
      </tr>);
    }
    return (
      <table className={styles.Table}>
        <thead>
        <tr>
          <th rowSpan={2}>Обменный пункт / Время обновления</th>
          <th rowSpan={2}>Время</th>
          {flags}
        </tr>
        <tr>
          <th>
            <button onClick={ExchangeTable.sortRates.bind(this, 'usdb')}>покуп</button>
          </th>
          <th>
            <button onClick={ExchangeTable.sortRates.bind(this, 'usds')}>прод</button>
          </th>
          <th>
            <button onClick={ExchangeTable.sortRates.bind(this, 'eurb')}>покуп</button>
          </th>
          <th>
            <button onClick={ExchangeTable.sortRates.bind(this, 'eurs')}>прод</button>
          </th>
          <th>
            <button onClick={ExchangeTable.sortRates.bind(this, 'rubb')}>покуп</button>
          </th>
          <th>
            <button onClick={ExchangeTable.sortRates.bind(this, 'rubs')}>прод</button>
          </th>
        </tr>
        </thead>
        <tbody>
        {retailTitle}
        {retailRows}
        {wholesaleTitle}
        {wholesaleRows}
        </tbody>
      </table>
    );
  }
}

export default ExchangeTable;