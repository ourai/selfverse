import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Button, Avatar, Tabs, type TabsProps, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import type { WorkListItem } from '../../types';
import { resolvePrice } from '../../utils';
import { fetchOne } from '../../services/works';
import { useIdentityContext } from '../../components/identity';

import style from './style.module.scss';

function WorksItem() {
  const identity = useIdentityContext();
  const [record, setRecord] = useState<WorkListItem>();
  const [fetched, setFetched] = useState(false);
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();

  const buyers = [];

  useEffect(() => {
    if (fetched) {
      return;
    }

    fetchOne(BigInt(id!))
      .then(res => {
        setRecord(res);
        setFetched(true);
      })
      .catch(err => {
        messageApi.error('Error occurred during fetching work.');
        console.log('[ERROR]', err);
      });
  });

  let buyable = false;
  let btnText = '';
  let tabItems: TabsProps['items'] = [];

  if (record) {
    if (identity.checked && identity.visitor) {
      if (record.listing) {
        buyable = true;
        btnText = `Pay ${resolvePrice(record.price)}`;
      } else {
        btnText = 'Not listed for sales';
      }
    }

    tabItems = [
      {
        key: 'intro',
        label: 'Introduction',
        children: record.content,
      },
      {
        key: 'content',
        label: 'Contents',
        children: '暂无',
      },
      {
        key: 'buyer',
        label: buyers.length > 0 ? `Supporters (${buyers.length})` : 'Supporters',
        children: '暂无',
      },
    ];
  }

  return (
    <>
      {contextHolder}
      {record ? (
        <div className={style.WorksItem}>
          <header className={style['WorksItem-header']}>
            <div className={style['WorksItem-cover']} style={{ backgroundImage: `url('${record.cover}')` }}>
              <img src={record.cover} />
            </div>
            <div className={style['WorksItem-headerContent']}>
              <div className={style['WorksItem-headerMain']}>
                <h1>{record.title}</h1>
                <p>{record.description}</p>
              </div>
              <Flex className={style['WorksItem-headerMeta']} align="center" justify="space-between">
                {identity.checked && identity.visitor && (
                  <Button type="primary" size="large" disabled={!buyable}>{btnText}</Button>
                )}
                {buyers.length > 0 && (
                  <div>
                    <Avatar.Group max={{ count: 10, style: { backgroundColor: '#f00' } }}>
                      {buyers.map(() => <Avatar style={{ backgroundColor: '#0871ab' }} icon={<UserOutlined />} />)}
                    </Avatar.Group>
                  </div>
                )}
              </Flex>
            </div>
          </header>
          <article className={style['WorksItem-body']}>
            <Tabs items={tabItems} />
          </article>
        </div>
      ) : <div>不存在</div>}
    </>
  )
}

export default WorksItem;
