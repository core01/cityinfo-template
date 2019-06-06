import * as React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import MapMarker from './MapMarker';
import PopupContent from './PopupContent';

interface Props {
  rates: exchangeRate[];
  selectedPointId: number;
}

class MapClass extends React.Component<Props> {
  render () {
    let bounds: [number, number][] = [];
    console.log('asd');
    const defaultPosition: [number, number] = [49.95, 82.61];
    const markers = this.props.rates.map(rate => {
      let position: [number, number] = defaultPosition;
      if (rate.longitude && rate.latitude) {
        position = [rate.latitude, rate.longitude];
        bounds.push(position);
      }

      return (
        <MapMarker
          position={position}
          key={rate.id}
          open={this.props.selectedPointId === rate.id}
        >
          <Popup>
            <PopupContent rate={rate} />
          </Popup>
        </MapMarker>
      );
    });
    console.log(bounds);
    return (
      <Map
        center={defaultPosition}
        zoom={14}
        bounds={bounds.length > 0 ? bounds : [defaultPosition]}
        maxZoom={17}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://osm.apihit.com/?z={z}&x={x}&y={y}"
        />
        {markers}
      </Map>
    );
  }
}

export default MapClass;
