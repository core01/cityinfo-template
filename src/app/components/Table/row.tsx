import * as React from 'react';
import { Fragment } from 'react';
import * as dayjs from 'dayjs';
import PhoneNumber from 'awesome-phonenumber';
import * as styles from './row.module.css';
import { currencies } from '@app/constants';
import { getBuy, getSell } from '@app/utils';

interface Props {
  rate: ExchangeRate;
  best: BestRates;
  selectPoint: Function;
}

const Row = (props: Props) => {
  const { rate, best } = props;
  const dayjsDate = dayjs.unix(rate.date_update);
  const time = dayjsDate.format('HH:mm:ss ');
  const date = dayjsDate.format('DD.MM.YYYY');
  const phones = (rate.phones as string[]).map((phone, index) => {
    let pn = new PhoneNumber(phone, 'RU');
    let row = null;
    if (pn.isValid()) {
      row = (
        <a
          href={pn.getNumber('rfc3966')}
          className="block text-pelorous-700 underline mb-1"
        >
          {pn.getNumber('international')}
        </a>
      );
    } else {
      row = phone;
    }
    return <React.Fragment key={index}>{row}</React.Fragment>;
  });

  const currenciesTds = currencies.map(currency => {
    const currencyBuy = getBuy(rate, currency, best);
    const currencySell = getSell(rate, currency, best);

    const buyClass = currencyBuy.best ? styles.BestBuy : null;
    const sellClass = currencySell.best ? styles.BestSell : null;
    return (
      <Fragment key={currency}>
        <td className={[buyClass, 'text-center'].join(' ')}>
          {currencyBuy.value}
        </td>
        <td className={[sellClass, 'text-center'].join(' ')}>
          {currencySell.value}
        </td>
      </Fragment>
    );
  });

  let title = props.rate.name;
  let link = null;
  if (props.rate.company_id) {
    link = (
      <a
        href={'/company-card.html?id=' + props.rate.company_id}
        target="_blank"
      >
        {props.rate.name}
      </a>
    );
  }

  return (
    <tr key={rate.id} onClick={props.selectPoint(props.rate.id)}>
      <td>
        <p className={styles.Title}>{link ? link : title}</p>
        <p className={styles.Info}>{props.rate.info}</p>
        <p className={styles.Date}>
          <span>{time}</span>
          <span>{date}</span>
        </p>
      </td>
      {currenciesTds}
      <td className={['text-center'].join(' ')}>{phones}</td>
    </tr>
  );
};

export default Row;
