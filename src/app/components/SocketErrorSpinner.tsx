import * as React from 'react';

interface Props {
  show: boolean;
  type?: string;
  message?: string;
}
// TODO rewrite with Spinner.tsx usage
const Spinner = (props: Props) => {
  let spinner = null;
  if (props.show) {
    let message = null;
    if (props.message) {
      message = <div className="spinner-message">{props.message}</div>;
    }
    spinner = (
      <div className="spinner-error-container">
        <div
          className={[
            'spinner',
            props.type === 'red' ? 'spinner--red' : 'spinner--pelorous',
          ].join(' ')}
        >
          <div className="rect1" />
          <div className="rect2" />
          <div className="rect3" />
          <div className="rect4" />
          <div className="rect5" />
        </div>
        {message}
      </div>
    );
  }
  return spinner;
};

export default Spinner;
