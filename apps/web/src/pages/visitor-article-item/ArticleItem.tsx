import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { message } from 'antd';

import type { ArticleFormValue } from '../../types';
import { fetchOne } from '../../services/article';

import style from './style.module.scss';

function ArticleItem() {
  const [record, setRecord] = useState<ArticleFormValue>();
  const [fetched, setFetched] = useState(false);
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (fetched) {
      return;
    }

    const articleId = BigInt(id!);

    fetchOne(articleId)
      .then(res => {
        setRecord(res);
        setFetched(true);
      })
      .catch(err => {
        messageApi.error('Error occurred during fetching article.');
        console.log('[ERROR]', err);
      });
  });

  return (
    <>
      {contextHolder}
      {record ? (
        <div className={style.ArticleItem}>
          <header className={style['ArticleItem-header']}>
            <div className={style['ArticleItem-cover']} style={{ backgroundImage: `url('${record.banner}')` }}>
              <img src={record.banner} />
            </div>
            <div className={style['ArticleItem-headerContent']}>
              <div className={style['ArticleItem-headerMain']}>
                <h1>{record.title}</h1>
                <p>{record.description}</p>
              </div>
            </div>
          </header>
          <article className={style['ArticleItem-body']}>
            {record.content}
          </article>
        </div>
      ) : <div>不存在</div>}
    </>
  )
}

export default ArticleItem;
