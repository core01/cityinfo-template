import * as React from 'react';
// @ts-ignore
import styles from './PopupContent.module.css';

interface Props {
  rate: exchangeRate;
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
          className={styles.Link}
        >
          Перейти в карточку фирмы
        </a>
      </p>
    );
  }
  const phones = (rate.phones as string[]).map(phone => {
    return <p>{phone}</p>;
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
        <tbody>
          <tr>
            <td>USD</td>
            <td>{rate.buyUSD}</td>
            <td>{rate.sellUSD}</td>
          </tr>
          <tr>
            <td>EUR</td>
            <td>{rate.buyEUR}</td>
            <td>{rate.sellEUR}</td>
          </tr>
          <tr>
            <td>RUB</td>
            <td>{rate.buyRUB}</td>
            <td>{rate.sellRUB}</td>
          </tr>
          <tr>
            <td>CNY</td>
            <td>{rate.buyCNY}</td>
            <td>{rate.sellCNY}</td>
          </tr>
          <tr>
            <td>GBP</td>
            <td>{rate.buyGBP}</td>
            <td>{rate.sellGBP}</td>
          </tr>
        </tbody>
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
