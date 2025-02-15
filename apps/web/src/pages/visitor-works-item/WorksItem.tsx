import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Button, Avatar, Tabs, type TabsProps, Popconfirm, List, message } from 'antd';
import { useAccount } from '@ant-design/web3';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import markdownIt from 'markdown-it';

import type { ArticleListItem, WorkListItem, Buyer, WorkChapter } from '../../types';
import { resolvePrice } from '../../utils';
import { fetchList as fetchArticleList } from '../../services/article';
import { fetchOne, fetchChapters, fetchBuyerList, buyOne } from '../../services/works';
import { useIdentityContext } from '../../components/identity';

import ChapterCard from './ChapterCard';
import BuyerCard from './BuyerCard';
import style from './style.module.scss';

const md = markdownIt({ html: true });

function WorksItem() {
  const identity = useIdentityContext();
  const [record, setRecord] = useState<WorkListItem>();
  const [fetched, setFetched] = useState(false);
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const { account } = useAccount();
  const [chapters, setChapters] = useState<WorkChapter[]>([]);

  useEffect(() => {
    if (fetched) {
      return;
    }

    const workId = BigInt(id!);

    Promise.all([
      fetchOne(workId, account && account.address),
      fetchBuyerList(workId),
      fetchChapters(workId),
      fetchArticleList(),
    ])
      .then(results => {
        const articleMap = results[3].reduce((p, c) => ({ ...p, [c.id]: c }), {} as any);
        const resolved: WorkChapter[] = [];

        results[2].forEach(id => {
          const article = articleMap[Number(id)] as ArticleListItem | undefined;

          if (article) {
            resolved.push({
              title: article.title,
              description: article.description,
              subject: 'article',
              subjectId: BigInt(article.id),
            });
          }
        });

        setRecord(results[0]);
        setBuyers(results[1]);
        setChapters(resolved);
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
        if (record.bought) {
          btnText = 'Purchased';
        } else {
          buyable = true;
          btnText = `Pay ${resolvePrice(record.price)}`;
        }
      } else {
        btnText = 'Not listed for sales';
      }
    }

    tabItems = [
      {
        key: 'intro',
        label: 'Introduction',
        children: <div dangerouslySetInnerHTML={{ __html: md.render(record.content) }} />,
      },
      {
        key: 'content',
        label: 'Contents',
        children: (
          <List
            dataSource={chapters}
            grid={{ gutter: 16, column: 3 }}
            renderItem={(item, index) => (
              <List.Item>
                <ChapterCard serialNumber={index + 1} dataSource={item} />
              </List.Item>
            )}
          />
        ),
      },
      {
        key: 'buyer',
        label: buyers.length > 0 ? `Supporters (${buyers.length})` : 'Supporters',
        children: (
          <List
            dataSource={buyers.slice().reverse()}
            grid={{ gutter: 16, column: 4 }}
            renderItem={item => (
              <List.Item>
                <BuyerCard dataSource={item} />
              </List.Item>
            )}
          />
        ),
      },
    ];
  }

  const handleBuy = (item: WorkListItem) => buyOne(item.id, BigInt(item.price))
    .then(() => {
      messageApi.success('Thank you!');
      setFetched(false);
    })
    .catch(err => {
      messageApi.error(`Error occurred during buying ${item.title}.`);
      console.log('[ERROR]', err);
    });

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
                  <Popconfirm
                    title={`Buy ${record.title}`}
                    description={`Are you sure to buy ${record.title}? You will pay ${resolvePrice(record.price)} for it.`}
                    okText="Yes"
                    cancelText="No"
                    onConfirm={handleBuy.bind(null, record)}
                  >
                    <Button type="primary" size="large" disabled={!buyable}>{btnText}</Button>
                  </Popconfirm>
                )}
                {buyers.length > 0 && (
                  <div>
                    <Avatar.Group max={{ count: 10, style: { backgroundColor: '#f00' } }}>
                      {buyers.map(buyer => (
                        <Avatar
                          style={{ borderWidth: 0, backgroundColor: '#0871ab' }}
                          icon={<Jazzicon seed={jsNumberForAddress(buyer.buyer)} diameter={32} paperStyles={{ borderRadius: '50%' }} />}
                        />
                      ))}
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
