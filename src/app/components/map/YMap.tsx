import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
// @ts-ignore
import { YMaps, Map, ZoomControl, Placemark } from 'react-yandex-maps';
import PopupContent from './PopupContent';

interface Props {
  rates: exchangeRate[];
  selectedPointId: number;
}
interface State {
  ymaps: any;
  bounds: number[][];
}

interface mapState {
  center: number[];
  zoom: number;
  behaviors: string[];
}
let mapState: mapState = {
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
  };
  handleBalloonOpen (e: any) {
    let placeMark = e.get('target');
    placeMark.options.set('preset', this.activePlacemarkPreset);
  }
  handleBalloonClose (e: any) {
    let placeMark = e.get('target');
    placeMark.options.set('preset', this.defaultPlacemarkPreset);
  }

  setYmaps = (ymaps: any) => {
    this.setState({ ymaps: ymaps });
  };
  setCenter = (ref: any) => {
    const { ymaps, bounds } = this.state;
    if (ymaps && bounds.length > 0) {
      ref.setBounds(ymaps.util.bounds.fromPoints(bounds));
    }
  };

  componentDidUpdate (prevProps: Props) {
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

  render () {
    const placeMarks = this.props.rates.map(rate => {
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
          modules={['geoObject.addon.balloon']}
          onBalloonClose={this.handleBalloonClose.bind(this)}
          onBalloonOpen={this.handleBalloonOpen.bind(this)}
          instanceRef={(ref: any) => {
            ref && rate.id === this.props.selectedPointId && ref.balloon.open();
          }}
        />
      );
    });

    return (
      <YMaps query={{ load: 'util.bounds' }}>
        <Map
          state={mapState}
          width="100%"
          height="100vh"
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
      </YMaps>
    );
  }
}

export default YMap;
