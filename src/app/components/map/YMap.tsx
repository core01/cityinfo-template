import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
// @ts-ignore
import { YMaps, Map, ZoomControl, Placemark } from 'react-yandex-maps';
import PopupContent from './PopupContent';
import Spinner from '../Spinner';

interface Props {
  rates: ExchangeRate[];
  selectedPointId: number;
  resetSelectedPointId: Function;
  mode: string;
}
interface State {
  ymaps: any;
  bounds: number[][];
  loading: boolean;
}

interface MapState {
  center: number[];
  zoom: number;
  behaviors: string[];
}
let mapState: MapState = {
  center: [49.95, 82.61],
  zoom: 14,
  behaviors: ['default', 'scrollZoom'],
};

class YMap extends React.Component<Props, State> {
  activePlacemarkPreset = 'islands#nightCircleDotIcon';
  defaultPlacemarkPreset = 'islands#circleDotIcon';

  state: State = {
    ymaps: null,
    bounds: [],
    loading: true,
  };
  handleBalloonOpen(e: any) {
    e.get('target').options.set('preset', this.activePlacemarkPreset);
  }
  handleBalloonClose(e: any) {
    e.get('target').options.set('preset', this.defaultPlacemarkPreset);
  }

  setYmaps = (ymaps: any) => {
    this.setState({ ymaps: ymaps, loading: false });
  };
  setCenter = (ref: any) => {
    // Что бы не центрировать карту при выборе пункта
    if (!this.props.selectedPointId) {
      const { ymaps, bounds } = this.state;
      if (ymaps && bounds.length > 0) {
        ref.setBounds(ymaps.util.bounds.fromPoints(bounds));
      }
    }
  };

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    // @todo протестировать поведение на сравнение количества
    if (nextProps.rates.length !== this.props.rates.length) {
      return true;
    }
    if (nextProps.mode !== this.props.mode) {
      return true;
    }
    if (
      nextProps.selectedPointId &&
      nextProps.selectedPointId !== this.props.selectedPointId
    ) {
      return true;
    }

    if (nextState !== this.state) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.rates !== this.props.rates) {
      if (this.props.rates.length > 0) {
        const bounds: number[][] = [];
        this.props.rates.map(rate => {
          if (rate.latitude && rate.longitude) {
            bounds.push([rate.latitude, rate.longitude]);
          }
        });
        this.setState({ bounds: bounds });
      }
    }
  }

  render() {
    const placeMarks = this.props.rates.map(rate => {
      if (rate.latitude && rate.longitude) {
        const balloonContent = <PopupContent rate={rate} />;

        return (
          <Placemark
            key={rate.id}
            geometry={[rate.latitude, rate.longitude]}
            properties={{
              balloonContent: renderToStaticMarkup(balloonContent),
            }}
            options={{
              preset: this.defaultPlacemarkPreset,
              hideIconOnBalloonOpen: false,
              balloonOffset: [0, -10],
            }}
            onBalloonClose={this.handleBalloonClose.bind(this)}
            onBalloonOpen={this.handleBalloonOpen.bind(this)}
            instanceRef={(ref: any) => {
              ref &&
                rate.id === this.props.selectedPointId &&
                ref.balloon.open();
            }}
          />
        );
      }
    });

    return (
      <YMaps
        query={{
          load:
            'Map,Placemark,control.ZoomControl,util.bounds,geoObject.addon.balloon',
        }}
      >
        <Map
          state={mapState}
          width="100%"
          height="99vh"
          onLoad={(ymaps: any) => this.setYmaps(ymaps)}
          instanceRef={(ref: any) => ref && this.setCenter(ref)}
        >
          <ZoomControl
            options={{
              size: 'small',
            }}
          />
          {placeMarks}
        </Map>
        <Spinner show={this.state.loading} />
      </YMaps>
    );
  }
}

export default YMap;
