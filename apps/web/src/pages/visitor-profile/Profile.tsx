import { useNavigate } from 'react-router-dom';
import { List, Card, Tabs, type TabsProps } from 'antd';
import { Address } from '@ant-design/web3';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

import type { WorkListItem, DonationRecord } from '../../types';
import { useIdentityContext } from '../../components/identity';

import DonationCard from './DonationCard';
import style from './style.module.scss';

function Profile() {
  const identity = useIdentityContext();
  const works: WorkListItem[] = [];
  // const achievements: any[] = [];
  const donations: DonationRecord[] = [];
  const navigate = useNavigate();

  if (!identity.address) {
    return (
      <div>Connect wallet first.</div>
    );
  }

  if (!identity.checked) {
    return (
      <div>Something wrong.</div>
    );
  }

  if (!identity.visitor) {
    return (
      <div>You shouldn't be here.</div>
    );
  }

  const tabItems: TabsProps['items'] = [
    {
      key: 'bought',
      label: works.length > 0 ? `Bought (${works.length})` : 'Bought',
      children: (
        <List
          dataSource={works}
          grid={{ gutter: 16, column: 4 }}
          renderItem={item => (
            <List.Item>
              <Card
                cover={<img src={item.cover} />}
                hoverable
                onClick={() => navigate(`/works/${item.id}`)}
              >
                <Card.Meta title={item.title} description={item.description} />
              </Card>
            </List.Item>
          )}
        />
      ),
    },
    // {
    //   key: 'achievement',
    //   label: achievements.length > 0 ? `Achievements (${achievements.length})` : 'Achievements',
    //   children: (
    //     <List
    //       dataSource={achievements}
    //       grid={{ gutter: 16, column: 4 }}
    //       renderItem={item => (
    //         <List.Item></List.Item>
    //       )}
    //     />
    //   ),
    // },
    {
      key: 'donation',
      label: donations.length > 0 ? `Donations (${donations.length})` : 'Donations',
      children: (
        <List
          dataSource={donations}
          grid={{ gutter: 16, column: 6 }}
          renderItem={item => (
            <List.Item>
              <DonationCard dataSource={item} />
            </List.Item>
          )}
        />
      ),
    },
  ];

  return (
    <div className={style.Profile}>
      <header className={style['Profile-header']}>
        <div className={style['Profile-headerContent']}>
          <div className={style['Profile-user']}>
            <Jazzicon paperStyles={{ borderRadius: '50%' }} seed={jsNumberForAddress(identity.address)} diameter={150} />
            <div className={style['Profile-address']}><Address address={identity.address} ellipsis /></div>
          </div>
        </div>
      </header>
      <article className={style['Profile-body']}>
        <Tabs items={tabItems} centered />
      </article>
    </div>
  );
}

export default Profile;
