import { Card, Flex } from 'antd';
import { CryptoPrice } from '@ant-design/web3';
import { EthereumColorful } from '@ant-design/web3-icons';

import type { DonationRecord } from '../../types';
import { formatUnixDate } from '../../utils';
import style from './style.module.scss';

type DonationCardProps = { dataSource: DonationRecord };

function DonationCard({ dataSource }: DonationCardProps) {
  return (
    <Card className={style.DonationCard} size="small" hoverable>
      <div className={style['DonationCard-header']}>
        <CryptoPrice value={dataSource.amount} fixed={6} icon={<EthereumColorful />} />
      </div>
      <Flex className={style['DonationCard-footer']} align="center" justify="space-between">
        <span>{formatUnixDate(dataSource.donatedAt, 'YYYY-MM-DD HH:mm:ss')}</span>
      </Flex>
    </Card>
  );
}

export default DonationCard;
