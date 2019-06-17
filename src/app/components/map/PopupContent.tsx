import * as React from 'react';
// @ts-ignore
import styles from './PopupContent.module.css';
import { currencies, currencyFlags } from '../../constants';

interface Props {
  rate: ExchangeRate;
}
const PopupContent = (props: Props) => {
  const rate = props.rate;
  let link = null;
  if (rate.company_id) {
    link = (
      <p>
        <a
          href={'/company-card.html?id=' + rate.company_id}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.Link}
        >
          Перейти в карточку фирмы
        </a>
      </p>
    );
  }
  const phones = (rate.phones as string[]).map((phone, index) => {
    return <p key={index}>{phone}</p>;
  });

  const currencyRows = currencies.map(currency => {
    let buyKey = 'buy' + currency;
    let sellKey = 'sell' + currency;
    if (rate[buyKey] || rate[sellKey]) {
      return (
        <tr key={currency}>
          <td>
            <img src={currencyFlags[currency]} alt={currency} />
            {currency}
          </td>
          <td>{rate[buyKey]}</td>
          <td>{rate[sellKey]}</td>
        </tr>
      );
    }
  });

  return (
    <div className={styles.Wrapper}>
      <h4 className={styles.Title}>{rate.name}</h4>
      <br />
      <table className={styles.Table}>
        <thead>
          <tr>
            <th>Валюта</th>
            <th>Покупка</th>
            <th>Продажа</th>
          </tr>
        </thead>
        <tbody>{currencyRows}</tbody>
      </table>
      <div>
        <h4 className={styles.ContentTitle}>Адрес</h4>
        {rate.info}
        <h4 className={styles.ContentTitle}>Телефоны</h4>
        {phones}
        <p>{link}</p>
      </div>
    </div>
  );
};

export default PopupContent;
