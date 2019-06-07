import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
// @ts-ignore
import DG from '2gis-maps';
import PopupContent from './PopupContent';

interface Props {
  rates: exchangeRate[];
  selectedPointId: number;
  resetSelected: Function;
}

class DGisMap extends React.Component<Props> {
  map: any = null;
  markers: any = null;

  addMarkers () {
    if (this.map) {
      const map = this.map;
      this.markers = DG.featureGroup();
      let markers = this.markers;
      this.props.rates.map(rate => {
        if (rate.latitude && rate.longitude) {
          const content = <PopupContent rate={rate} />;
          const popUp = DG.popup().setContent(renderToStaticMarkup(content));
          if (rate.id === this.props.selectedPointId) {
            popUp.setLatLng([rate.latitude, rate.longitude]).openOn(map);
          }
          DG.marker([rate.latitude, rate.longitude])
            .bindPopup(popUp)
            .addTo(markers);
        }
      });
      markers.addTo(map);

      map.fitBounds(markers.getBounds());
    }
  }

  componentDidMount () {
    this.map = DG.map('map', {
      center: [49.95, 82.61],
      zoom: 13,
      dragging: true,
      touchZoom: false,
      scrollWheelZoom: false,
      doubleClickZoom: true,
      boxZoom: false,
      geoclicker: false,
      zoomControl: true,
      fullscreenControl: false,
    }).on('click', () => {
      this.props.resetSelected();
    });

    this.addMarkers();
  }

  componentDidUpdate () {
    this.markers.removeFrom(this.map);
    this.addMarkers();
  }
  shouldComponentUpdate (nextProps: Props) {
    if (
      nextProps.selectedPointId === 0 &&
      nextProps.rates === this.props.rates
    ) {
      return true;
    }
    return true;
  }
  componentWillUnmount () {
      this.markers.removeFrom(this.map);
    // windowVar.markers.removeFrom(windowVar.map);
  }
  render () {
    return <div id="map" style={{ width: '100%', height: '100vh' }} />;
  }
}

export default DGisMap;
