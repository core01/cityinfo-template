import * as React from 'react';
import { currencies, currencyFlags } from '@app/constants';

interface Props {
  currency: string;
  onChangeCurrency: Function;
}
const CurrencySelect = (props: Props) => {
  const onChangeCurrency = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.onChangeCurrency(event.target.value);
  };

  const selectOptions = currencies.map((currency: string) => {
    return (
      <option value={currency} key={currency}>
        {currency}
      </option>
    );
  });

  const currency = props.currency;
  return (
    <React.Fragment>
      <img src={currencyFlags[currency]} alt={currency} />
      <select value={currency} onChange={onChangeCurrency}>
        {selectOptions}
      </select>
    </React.Fragment>
  );
};

export default CurrencySelect;
