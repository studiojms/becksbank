import React from 'react';

import Card from '../Card';
import * as Font from '../Fonts';
import ListItemAction from '../ListItemAction';

import { Transaction } from 'repository/Statement';
import Utils from 'utils/Utils';

import * as s from './styles';

type ContactProps = {
  extracts: Transaction[];
};

const getTitleFormat = ({ valueTransaction, dateTime }: Transaction) => {
  const isDanger = parseInt(valueTransaction) < 0;
  const value = Utils.formatMoney(valueTransaction);
  console.log('isDanger', isDanger);
  return (
    <s.TitleWrapper>
      {isDanger ? (
        <s.TitleDangerValue>{value}</s.TitleDangerValue>
      ) : (
        <s.TitleValue>{value}</s.TitleValue>
      )}
      <s.TitleDate>{dateTime}</s.TitleDate>
    </s.TitleWrapper>
  );
};

const CardTransfer: React.FC<ContactProps> = ({ extracts }) => {
  return (
    <Card>
      <Font.Description>Extratos</Font.Description>
      {extracts.map(extract => {
        const title = getTitleFormat(extract);
        let description = extract.typeOperation;
        if (extract.paymentCategory) {
          description += ` - ${extract.paymentCategory}`;
        }
        return (
          <ListItemAction
            key={extract.id}
            title={title}
            description={description}
          />
        );
      })}
    </Card>
  );
};

export default CardTransfer;
