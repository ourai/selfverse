import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip, List, Card, Tabs, type TabsProps, message } from 'antd';
import { HeartFilled } from '@ant-design/icons';
import { Address } from '@ant-design/web3';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

import type { AddressHash, BoughtWork, DonationRecord } from '../../types';
import { fetchBoughtList } from '../../services/works';
import { fetchList as fetchDonationList, hasBadge as hasDonatorBadge } from '../../services/donation';
import { useIdentityContext } from '../../components/identity';
import VisitorOnly from '../../components/visitor-only';

import DonationCard from './DonationCard';
import style from './style.module.scss';

function Profile() {
  const identity = useIdentityContext();
  const [works, setWorks] = useState<BoughtWork[]>([]);
  // const achievements: any[] = [];
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [donatorBadgeGot, setDonatorBadgeGot] = useState(false);
  const [fetched, setFetched] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (fetched) {
      return;
    }

    const user = identity.address as AddressHash;

    Promise.all([fetchBoughtList(user), fetchDonationList(user), hasDonatorBadge(user)])
      .then(results => {
        setWorks(results[0]);
        setDonations(results[1]);
        setDonatorBadgeGot(results[2]);
      })
      .catch(err => {
        messageApi.error(`Error occurred during fetching info of ${user}.`);
        console.log('[ERROR]', err);
      })
      .finally(() => setFetched(true));
  });

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
    <VisitorOnly>
      {contextHolder}
      <div className={style.Profile}>
        <header className={style['Profile-header']}>
          <div className={style['Profile-headerContent']}>
            <div className={style['Profile-user']}>
              <Jazzicon paperStyles={{ borderRadius: '50%' }} seed={jsNumberForAddress(identity.address)} diameter={150} />
              <div className={style['Profile-address']}><Address address={identity.address} ellipsis /></div>
              {donatorBadgeGot && (
                <div className={style['Profile-specialAchievements']}>
                  <Tooltip title="Donator badge got">
                    <HeartFilled style={{ fontSize: 18, color: 'red' }} />
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        </header>
        <article className={style['Profile-body']}>
          <Tabs items={tabItems} centered />
        </article>
      </div>
    </VisitorOnly>
  );
}

export default Profile;
