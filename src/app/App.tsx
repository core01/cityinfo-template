import * as React from 'react';
import { Fragment } from 'react';
import axios from 'axios';
import * as socketIOClient from 'socket.io-client';
import TableWithMap from '@app/components/TableWithMap';
import { connect } from 'react-redux';
import { State as RatesState } from './store/rates/reducers';
import { State as ErrorsState } from './store/errors/reducers';
import {
  setRates,
  setBestRates,
  setSelectedPoint,
  updateRate,
  setMode,
} from './store/rates/actions';
import { setSocketError } from './store/errors/actions';
import { AppState } from './store';
import Spinner from './components/Spinner';
import Table from './components/Table';

interface State {
  loading: boolean;
  showFull: boolean;
}

interface Props {
  retailCityId: number;
  wholesaleCityId: number | null;
  mapCenter: number[];
  setRates: Function;
  setBestRates: Function;
  updateRate: Function;
  setSocketError: Function;
  setMode: Function;
  rates: RatesState;
  errors: ErrorsState;
}

class App extends React.PureComponent<Props, State> {
  state = {
    loading: true,
    showFull: true,
  };

  toggleShowFull = () => {
    this.setState({
      showFull: !this.state.showFull,
    });
  };
  getRates = (mode: string = 'retail') => {
    let cityId = this.props.retailCityId;
    if (mode === 'wholesale') {
      cityId = this.props.wholesaleCityId;
    }
    this.setState({ loading: true });
    axios
      .get(process.env.API_URL + '/courses/' + cityId)
      .then(response => {
        this.props.setRates(response.data.rates);
        this.props.setBestRates(response.data.best);
      })
      .catch(error => {
        console.log(error);
      })
      .then(() => {
        this.setState({ loading: false });
      });
  };

  updateRate(newRate: ExchangeRateUpdate) {
    let itemIndex = null;
    const { rates } = this.props.rates;

    rates.map((rate, index) => {
      if (rate.id === newRate.id) {
        itemIndex = index;
      }
    });
    // updateRate also updates Best
    this.props.updateRate(newRate, itemIndex);
  }

  socketInit() {
    const socket = socketIOClient(process.env.SOCKET_URL, {
      path: '/ws',
    });

    socket.on('reconnect', () => {
      this.props.setSocketError(false);
      this.getRates();
    });

    socket.on('connect_error', () => {
      if (!this.props.errors.socketError) {
        this.props.setSocketError(true);
      }
    });

    socket.on('connect', () => {
      socket.emit('join', this.props.retailCityId);
      if (this.props.wholesaleCityId) {
        socket.emit('join', this.props.wholesaleCityId);
      }
    });

    socket.on('update', (data: ExchangeRateUpdate) => {
      const { mode } = this.props.rates;
      let needUpdate = false;
      if (data.city_id === this.props.retailCityId && mode === 'retail') {
        needUpdate = true;
      } else if (
        data.city_id === this.props.wholesaleCityId &&
        mode === 'wholesale'
      ) {
        needUpdate = true;
      }

      if (needUpdate) {
        this.updateRate(data);
      }
    });
  }
  setMode = (mode: string) => {
    this.props.setMode(mode);
    this.getRates(mode);
  };
  componentDidMount() {
    this.getRates();
    this.socketInit();
  }

  render() {
    const { mode } = this.props.rates;

    const tabActiveClass =
      'inline-block py-2 px-4 text-white bg-pelorous-500 text-white font-semibold cursor-pointer';
    const tabInActiveClass =
      'inline-block py-2 px-4 text-blue-500 hover:underline font-semibold cursor-pointer';

    return (
      <Fragment>
        <div className="flex w-full justify-between mb-2">
          <ul className="flex list-none">
            <li className="mr-1">
              <a
                className={
                  mode === 'retail' ? tabActiveClass : tabInActiveClass
                }
                onClick={this.setMode.bind(this, 'retail')}
              >
                Розница
              </a>
            </li>
            <li>
              <a
                className={
                  mode === 'wholesale' ? tabActiveClass : tabInActiveClass
                }
                onClick={this.setMode.bind(this, 'wholesale')}
              >
                Опт
              </a>
            </li>
          </ul>
          <ul className="flex list-none">
            <li>
              <a
                className="inline-block py-2 px-4 text-white cursor-pointer bg-green-600"
                onClick={this.toggleShowFull}
              >
                Переключить режим отображения
              </a>
            </li>
          </ul>
        </div>

        {this.state.showFull ? (
          <Table />
        ) : (
          <TableWithMap
            mapCenter={this.props.mapCenter}
            getRates={this.getRates}
            loading={this.state.loading}
          />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  rates: state.rates,
  errors: state.errors,
});

const actionCreators = {
  setRates,
  setBestRates,
  setSelectedPoint,
  setMode,
  updateRate,
  setSocketError,
};

export default connect(
  mapStateToProps,
  actionCreators
)(App);
