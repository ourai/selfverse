import { useParams } from 'react-router-dom';
import { Flex, Button, Avatar, Tabs, type TabsProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { works } from '../../constants';
import { resolvePrice } from '../../utils';

import style from './style.module.scss';

function WorksItem() {
  const { id } = useParams();
  const record = works.find(item => `${item.id}` === id);

  let buyable = false;
  let btnText = '';
  let tabItems: TabsProps['items'] = [];

  if (record) {
    if (record.listing) {
      buyable = true;
      btnText = `Pay ${resolvePrice(record.price)}`;
    } else {
      btnText = 'Not listed for sales';
    }

    tabItems = [
      {
        key: 'intro',
        label: 'Introduction',
        children: record.description,
      },
      {
        key: 'content',
        label: 'Contents',
        children: '暂无',
      },
      {
        key: 'buyer',
        label: 'Supporters (15)',
        children: '暂无',
      },
    ];
  }

  return (
    <>
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
                <Button type="primary" size="large" disabled={!buyable}>{btnText}</Button>
                <div>
                  <Avatar.Group max={{ count: 10, style: { backgroundColor: '#f00' } }}>
                    <Avatar style={{ backgroundColor: '#0871ab' }} icon={<UserOutlined />} />
                    <Avatar style={{ backgroundColor: '#0871ab' }} icon={<UserOutlined />} />
                    <Avatar style={{ backgroundColor: '#0871ab' }} icon={<UserOutlined />} />
                    <Avatar style={{ backgroundColor: '#0871ab' }} icon={<UserOutlined />} />
                    <Avatar style={{ backgroundColor: '#0871ab' }} icon={<UserOutlined />} />
                    <Avatar style={{ backgroundColor: '#0871ab' }} icon={<UserOutlined />} />
                    <Avatar style={{ backgroundColor: '#0871ab' }} icon={<UserOutlined />} />
                    <Avatar style={{ backgroundColor: '#0871ab' }} icon={<UserOutlined />} />
                    <Avatar style={{ backgroundColor: '#0871ab' }} icon={<UserOutlined />} />
                    <Avatar style={{ backgroundColor: '#0871ab' }} icon={<UserOutlined />} />
                    <Avatar style={{ backgroundColor: '#0871ab' }} icon={<UserOutlined />} />
                    <Avatar style={{ backgroundColor: '#0871ab' }} icon={<UserOutlined />} />
                    <Avatar style={{ backgroundColor: '#0871ab' }} icon={<UserOutlined />} />
                    <Avatar style={{ backgroundColor: '#0871ab' }} icon={<UserOutlined />} />
                    <Avatar style={{ backgroundColor: '#0871ab' }} icon={<UserOutlined />} />
                  </Avatar.Group>
                </div>
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
