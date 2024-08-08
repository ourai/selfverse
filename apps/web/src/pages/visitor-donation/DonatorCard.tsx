import { Card, Flex } from 'antd';
import { Address, CryptoPrice } from '@ant-design/web3';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { EthereumColorful } from '@ant-design/web3-icons';

import type { Donator } from '../../types';
import style from './style.module.scss';

type DonatorCardProps = { dataSource: Donator };

function DonatorCard({ dataSource }: DonatorCardProps) {
  return (
    <Card className={style.DonatorCard} size="small" hoverable>
      <div className={style['DonatorCard-header']}>
        <Address address={dataSource.donator} ellipsis={{ headClip: 14, tailClip: 12 }} />
      </div>
      <Flex className={style['DonatorCard-footer']} align="center" justify="space-between">
        <CryptoPrice value={dataSource.amount} fixed={6} icon={<EthereumColorful />} />
        {dataSource.tokenId !== 0n ? <HeartFilled /> : <HeartOutlined />}
      </Flex>
    </Card>
  );
}

export default DonatorCard;
