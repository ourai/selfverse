import { Card, Flex } from 'antd';
import { Address, CryptoPrice } from '@ant-design/web3';
import { EthereumColorful } from '@ant-design/web3-icons';

import type { DonationRecord } from '../../types';
import { formatUnixDate } from '../../utils';
import style from './style.module.scss';

type RecordCardProps = { dataSource: DonationRecord };

function RecordCard({ dataSource }: RecordCardProps) {
  return (
    <Card className={style.RecordCard} size="small" hoverable>
      <div className={style['RecordCard-header']}>
        <Address address={dataSource.donator} ellipsis={{ headClip: 14, tailClip: 12 }} />
      </div>
      <Flex className={style['RecordCard-footer']} align="center" justify="space-between">
        <CryptoPrice value={dataSource.amount} fixed={6} icon={<EthereumColorful />} />
        <span>{formatUnixDate(dataSource.donatedAt, 'YYYY-MM-DD')}</span>
      </Flex>
    </Card>
  );
}

export default RecordCard;
