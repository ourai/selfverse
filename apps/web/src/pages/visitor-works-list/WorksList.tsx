import { useNavigate } from 'react-router-dom';
import { List, Card, Popconfirm, message } from 'antd';

import { works as allWorks } from '../../constants';
import { resolvePrice } from '../../utils';

import style from './style.module.scss';

function WorksList() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const works = allWorks.filter(item => item.listing);

  const handleStopPropagation = e => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleConfirm = () => {
    messageApi.success('Thank you!');
  }

  return (
    <div className={style.WorksList}>
      {contextHolder}
      {works.length > 0 ? (
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={works}
          renderItem={item => (
            <List.Item>
              <Card
                cover={<img src={item.cover} />}
                actions={[
                  <div onClick={handleStopPropagation}>
                    <Popconfirm
                      title={`Buy ${item.title}`}
                      description={`Are you sure to buy ${item.title}? You will pay ${resolvePrice(item.price)} for it.`}
                      okText="Yes"
                      cancelText="No"
                      onConfirm={handleConfirm}
                    >
                      <div>{item.price > 0 ? `Pay ${resolvePrice(item.price)}` : 'Free'}</div>
                    </Popconfirm>
                  </div>
                ]}
                hoverable
                onClick={() => navigate(`/works/${item.id}`)}
              >
                <Card.Meta title={item.title} description={item.description} />
              </Card>
            </List.Item>
          )}
        />
      ) : <div>暂无作品</div>}
    </div>
  );
}

export default WorksList;
