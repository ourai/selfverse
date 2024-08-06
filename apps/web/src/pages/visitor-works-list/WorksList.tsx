import { useState } from 'react';
import { Link } from 'react-router-dom';
import { List, Button } from 'antd';

import style from './style.module.scss';

function WorksList() {
  const [works] = useState(Array.from(new Array(8)).map((_, i) => ({
    id: i + 1,
    title: `作品 ${i + 1}`,
    description: `作品 ${i + 1} 的介绍介绍介绍介绍作品 ${i + 1} 的介绍介绍介绍介绍作品 ${i + 1} 的介绍介绍介绍介绍`,
    cover: '',
    price: i,
  })));

  const handleBuy = (e, item) => {
    if (confirm(`Are you sure to buy ${item.title}? You will pay ${item.price} ETH for it.`)) {
      alert('Thank you!');
    }

    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <>
      {works.length > 0 ? (
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={works}
          renderItem={item => (
            <List.Item>
              <Link to={`/works/${item.id}`} className={style.WorksItem}>
                <div className={style['WorksItem-header']}>
                  <img className={style['WorksItem-cover']} src={item.cover} />
                </div>
                <div className={style['WorksItem-body']}>
                  <div className={style['WorksItem-title']}>{item.title}</div>
                  <div className={style['WorksItem-description']}>{item.description}</div>
                </div>
                <div className={style['WorksItem-footer']}>
                  <span className={style['WorksItem-price']}>{item.price > 0 ? `${item.price} ETH` : 'Free'}</span>
                  <Button size="small" onClick={e => handleBuy(e, item)}>购买</Button>
                </div>
              </Link>
            </List.Item>
          )}
        />
      ) : <div>暂无作品</div>}
    </>
  );
}

export default WorksList;
