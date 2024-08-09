import { Card, Flex } from 'antd';
import { Address } from '@ant-design/web3';

import type { Buyer } from '../../types';
import { formatUnixDate } from '../../utils';

import style from './style.module.scss';

type BuyerCardProps = { dataSource: Buyer };

function BuyerCard({ dataSource }: BuyerCardProps) {
  return (
    <Card className={style.BuyerCard} size="small" hoverable>
      <div className={style['BuyerCard-header']}>
        <Address address={dataSource.buyer} ellipsis={{ headClip: 14, tailClip: 12 }} />
      </div>
      <Flex className={style['BuyerCard-footer']} align="center" justify="space-between">
        <span>{formatUnixDate(dataSource.soldAt, 'YYYY-MM-DD')}</span>
      </Flex>
    </Card>
  );
}

export default BuyerCard;
