import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Card, Popconfirm, message } from 'antd';
import { useAccount } from '@ant-design/web3';

import type { ArticleListItem } from '../../types';
import { resolvePrice } from '../../utils';
import { fetchList } from '../../services/article';
import { useIdentityContext } from '../../components/identity';

import style from './style.module.scss';

function ArticleList() {
  const identity = useIdentityContext();
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [renderedAt, setRenderedAt] = useState(Date.now());
  const { account } = useAccount();

  useEffect(() => {
    fetchList().then(res => {
      console.log('res', res);
      setArticles((res as ArticleListItem[]));
    })
  }, [renderedAt])

  const handleStopPropagation = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleBuy = (item: ArticleListItem) => buyOne(item.id, BigInt(item.price))
    .then(() => {
      messageApi.success('Thank you!');
      setRenderedAt(Date.now());
    })
    .catch(err => {
      messageApi.error(`Error occurred during buying ${item.title}.`);
      console.log('[ERROR]', err);
    });

  return (
    <div className={style.ArticleList}>
      {contextHolder}
      {articles.length > 0 ? (
        <List
          dataSource={articles}
          grid={{ gutter: 16, column: 4 }}
          renderItem={item => (
            <List.Item>
              <Card
                cover={<img src={item.banner} />}
                // actions={identity.visitor ? [
                //   !item.bought ? (
                //     <div onClick={handleStopPropagation}>
                //       <Popconfirm
                //         title={`Buy ${item.title}`}
                //         description={`Are you sure to buy ${item.title}? You will pay ${resolvePrice(item.price)} for it.`}
                //         okText="Yes"
                //         cancelText="No"
                //         onConfirm={handleBuy.bind(null, item)}
                //       >
                //         <div>{item.price > 0 ? `Pay ${resolvePrice(item.price)}` : 'Free'}</div>
                //       </Popconfirm>
                //     </div>
                //   ) : 'Purchased'
                // ] : []}
                hoverable
                onClick={() => navigate(`/articles/${item.id}`)}
              >
                <Card.Meta title={item.title} description={item.description} />
              </Card>
            </List.Item>
          )}
        />
      ) : <div>暂无文章</div>}
    </div>
  );
}

export default ArticleList;
