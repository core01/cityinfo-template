import * as React from 'react';

interface Props {
  show: boolean;
}
const Spinner = (props: Props) => {
  let spinner = null;
  if (props.show) {
    spinner = (
      <div className="spinner-local-container">
        <div className="spinner">
          <div className="rect1" />
          <div className="rect2" />
          <div className="rect3" />
          <div className="rect4" />
          <div className="rect5" />
        </div>
      </div>
    );
  }
  return spinner;
};

export default Spinner;
