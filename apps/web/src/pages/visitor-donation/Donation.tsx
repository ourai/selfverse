import { Avatar, Button, List, Tabs, type TabsProps } from 'antd';
import { HeartFilled } from '@ant-design/icons';
import { EthereumFilled } from '@ant-design/web3-icons';

import DonatorCard from './DonatorCard';
import style from './style.module.scss';

function Donation() {
  const donators = Array.from(new Array(15)).map((_ , i) => ({
    address: `0x${i + 1}`,
    amount: Math.ceil(Math.random() * 1000),
    donatedAt: Date.now(),
  }));

  const donations = Array.from(new Array(30)).map((_ , i) => ({
    address: `0x${i + 1}`,
    amount: Math.ceil(Math.random() * 1000),
    donatedAt: Date.now(),
  }));

  const tabItems: TabsProps['items'] = [
    {
      key: 'donator',
      label: `Donators (${donators.length})`,
      children: (
        <List
          dataSource={donators}
          grid={{ gutter: 16, column: 4 }}
          renderItem={item => (
            <List.Item>
              <DonatorCard />
            </List.Item>
          )}
        />
      ),
    },
    {
      key: 'donation',
      label: `Donations (${donations.length})`,
      children: (
        <List
          dataSource={donations}
          grid={{ gutter: 16, column: 4 }}
          renderItem={item => (
            <List.Item>
              <DonatorCard />
            </List.Item>
          )}
        />
      ),
    },
  ];

  return (
    <div className={style.Donation}>
      <header className={style['Donation-header']}>
        <div className={style['Donation-headerContent']}>
          <div className={style['Donation-donee']}>
            <Avatar src="/ourai.jpg" size={150} />
          </div>
          <Button type="primary" size="large" icon={<EthereumFilled />} iconPosition="end">Buy me a cup of coffee</Button>
        </div>
      </header>
      <article className={style['Donation-body']}>
        <p className={style['Donation-thanks']}>Thank you all for supporting my work. <HeartFilled style={{ color: '#f00' }} /></p>
        <Tabs items={tabItems} centered />
      </article>
    </div>
  );
}

export default Donation;
