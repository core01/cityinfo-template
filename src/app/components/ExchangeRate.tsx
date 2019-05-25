import * as React from 'react';
import * as dayjs from 'dayjs';

interface Props {
  rate: exchangeRate,
  currencies: string[],
}

const ExchangeRate = (props: Props) => {
  const rateCurrencies = props.currencies.map((currency, key) => {
    let buyValue = props.rate['buy' + currency] === 0 ? '-' : props.rate['buy' + currency];
    let sellValue = props.rate['sell' + currency] === 0 ? '-' : props.rate['sell' + currency];

    return (
      <React.Fragment key={key}>
        <td className="text-center">{buyValue}</td>
        <td className="text-center">{sellValue}</td>
      </React.Fragment>
    );
  });

  const date = dayjs.unix(props.rate.date_update).format('HH:mm:ss DD.MM.YYYY');

  return (
    <tr key={props.rate.id}>
      <td>
        {props.rate.name}
      </td>
      <td className="text-center">
        {date}
      </td>
      {rateCurrencies}
    </tr>
  );
};

export default ExchangeRate;