import { Card, Flex } from 'antd';
import { CryptoPrice } from '@ant-design/web3';
import { EthereumColorful } from '@ant-design/web3-icons';
import { parseEther } from 'viem';

import style from './style.module.scss';

function DonatorCard() {
  return (
    <Card className={style.DonatorCard} size="small" hoverable>
      <div className={style['DonatorCard-header']}>0xsss</div>
      <Flex className={style['DonatorCard-footer']} align="center" justify="space-between">
        <CryptoPrice icon={<EthereumColorful />} value={parseEther('1')} />
        <span>{Date.now()}</span>
      </Flex>
    </Card>
  );
}

export default DonatorCard;
