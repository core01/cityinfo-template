import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '@app/store';
import { State as ErrorsState } from '@app/store/errors/reducers';
import { State as RatesState } from '@app/store/rates/reducers';
import SingleCurrencyTable from '@app/components/Table/SingleCurrency';
import YMap from '@app/components/Map/YMap';
import SocketErrorSpinner from './SocketErrorSpinner';
import {
  setSortBy,
  setSelectedPoint,
  setMode,
  setRates,
} from '@app/store/rates/actions';
import { sortRates } from '@app/utils';

interface Props {
  errors: ErrorsState;
  rates: RatesState;
  mapCenter: number[];
  setSortBy: Function;
  setSelectedPoint: Function;
  setRates: Function;
  getRates: Function;
  loading: boolean;
}

interface State {}

class TableWithMap extends React.PureComponent<Props, State> {
  setSortBy = (sortBy: string) => {
    this.props.setSortBy(sortBy);

    const rates = sortRates(this.props.rates.rates, sortBy);
    this.props.setRates(rates);
  };

  selectPoint = (id: number) => {
    this.props.setSelectedPoint(id);
    setTimeout(() => {
      this.props.setSelectedPoint(0);
    }, 0);
  };

  render() {
    const { rates, best, mode, selected } = this.props.rates;

    return (
      <div className="flex justify-between flex-wrap">
        <div className="w-full lg:w-1/2 lg:h-full overflow-hidden relative mb-2 sm:mb-3 lg:mb-0">
          <SocketErrorSpinner
            show={this.props.errors.socketError}
            type="red"
            message="Потеряно соединение, восстанавливаем..."
          />
          <SingleCurrencyTable
            rates={rates}
            best={best}
            mode={mode}
            setSortBy={this.setSortBy}
            selectPoint={this.selectPoint}
          />
        </div>
        <div className="w-full lg:w-1/2 mt-2 md:mt-0 lg:pl-2">
          <YMap
            rates={rates}
            selectedPointId={selected}
            mode={mode}
            mapCenter={this.props.mapCenter}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  rates: state.rates,
  errors: state.errors,
});

const actionCreators = {
  setSortBy,
  setSelectedPoint,
  setRates,
};

export default connect(
  mapStateToProps,
  actionCreators
)(TableWithMap);
