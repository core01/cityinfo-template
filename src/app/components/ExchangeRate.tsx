import * as React from 'react';
import * as dayjs from 'dayjs';
// @ts-ignore
import styles from './ExchangeRate.module.css';

interface Props {
  rate: exchangeRate,
  currencies: string[],
  best: {
    [key: string]: number
  },
}

const ExchangeRate = (props: Props) => {
  const rateCurrencies = props.currencies.map((currency, key) => {
    let buyValue = props.rate['buy' + currency] === 0 ? '-' : props.rate['buy' + currency];
    let sellValue = props.rate['sell' + currency] === 0 ? '-' : props.rate['sell' + currency];

    let buyClassName = buyValue === props.best['buy' + currency] ? styles.BestBuy : null;
    let sellClassName = sellValue === props.best['sell' + currency] ? styles.BestSell : null;
    return (
      <React.Fragment key={key}>
        <td className={[buyClassName, 'text-center'].join(' ')}>{buyValue}</td>
        <td className={[sellClassName, 'text-center'].join(' ')}>{sellValue}</td>
      </React.Fragment>
    );
  });
  const dayjsDate = dayjs.unix(props.rate.date_update);
  const time = dayjsDate.format('HH:mm:ss ');
  const date = dayjsDate.format('DD.MM.YYYY');

  return (
    <tr key={props.rate.id}>
      <td>
        <a href="" className={styles.Title}>
          {props.rate.name}
        </a>
        <p className={styles.Date}>
          <span>
            {time}
          </span>
          <span>
            {date}
        </span>
        </p>
        <span className={styles.Info}>{props.rate.info}</span>
      </td>
      {rateCurrencies}
    </tr>
  );
};

export default ExchangeRate;