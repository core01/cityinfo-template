import * as React from 'react';
import { Marker } from 'react-leaflet';

interface Props{
  position: [number, number];
  open?: boolean;
  key?: number;
  children?: any;
}

const MapMarker = (props: Props) => {
  const initMarker = (ref: any) => {
    if (ref && props.open) {
      ref.leafletElement.openPopup();
    }
  };

  return <Marker ref={initMarker} {...props} />;
};

export default MapMarker;
