import * as React from 'react';
import * as dayjs from 'dayjs';
import PhoneNumber from 'awesome-phonenumber';
// @ts-ignore
import styles from './ExchangeRate.module.css';

interface Props {
  rate: exchangeRate,
  currency: string,
  best: {
    [key: string]: number
  },
  selectPoint: Function,
}

const ExchangeRate = (props: Props) => {

  let buyValue = props.rate['buy' + props.currency] === 0 ? '-' : props.rate['buy' + props.currency];
  let sellValue = props.rate['sell' + props.currency] === 0 ? '-' : props.rate['sell' + props.currency];

  let buyClassName = buyValue === props.best['buy' + props.currency] ? styles.BestBuy : null;
  let sellClassName = sellValue === props.best['sell' + props.currency] ? styles.BestSell : null;

  const dayjsDate = dayjs.unix(props.rate.date_update);
  const time = dayjsDate.format('HH:mm:ss ');
  const date = dayjsDate.format('DD.MM.YYYY');
  const phones = (props.rate.phones as string[]).map((phone, index) => {
    let pn = new PhoneNumber(phone, 'RU');
    let row = null;
    if (pn.isValid()) {
      row = (
        <a href={pn.getNumber('rfc3966')}
           className='block text-pelorous-700 underline mb-1'>{pn.getNumber('international')}</a>
      );
    } else {
      row = phone;
    }
    return (
      <React.Fragment key={index}>
        {row}
      </React.Fragment>
    );
  });
  return (
    <tr key={props.rate.id} className="hover:bg-green-200 cursor-pointer" onClick={props.selectPoint.bind(this, props.rate.id)}>
      <td className={styles.PointColumn} colSpan={2}>
        <p className={styles.Title}>
          {props.rate.name}
        </p>
        <p className={styles.Info}>{props.rate.info}</p>
        <p className={styles.Date}>
          <span>
            {time}
          </span>
          <span>
            {date}
        </span>
        </p>
      </td>
      <td className={styles.PhonesColumn}>
        {phones}
      </td>
      <td className={[buyClassName, styles.CurrencyCell, 'text-center'].join(' ')}>{buyValue}</td>
      <td className={[sellClassName,styles.CurrencyCell, 'text-center'].join(' ')}>{sellValue}</td>
    </tr>
  );
};

export default ExchangeRate;