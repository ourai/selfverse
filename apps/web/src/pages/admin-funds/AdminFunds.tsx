import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Space, Button, message } from 'antd';
import { formatEther } from 'viem';

import { updateAdmin, fetchBalance, fetchReceived } from '../../services/funds';
import AdminOnly from "../../components/admin-only";

import style from './style.module.scss';

function AdminFunds() {
  const [balance, setBalance] = useState('0');
  const [received, setReceived] = useState('0');
  const [records] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (fetched) {
      return;
    }

    Promise.all([
      fetchBalance() as Promise<bigint>,
      fetchReceived() as Promise<bigint>,
    ])
    .then(results => {
      setBalance(formatEther(results[0]));
      setReceived(formatEther(results[1]));
    })
    .catch(err => {
      messageApi.error('Error occurred during fetching funds.');
      console.log('[ERROR]', err);
    })
    .finally(() => setFetched(true));
  });

  const indexes = [
    { title: 'Received (ETH)', value: received },
    { title: 'Balance (ETH)', value: balance },
  ];

  return (
    <AdminOnly updateAdmin={updateAdmin} busy={false}>
      {contextHolder}
      <div className={style.AdminFunds}>
        <div className={style['AdminFunds-header']}>
          <Row className={style['AdminFunds-statistics']} gutter={16}>
            {indexes.map(({ title, value }) => (
              <Col key={title} span={24 / indexes.length}>
                <Card style={{ backgroundColor: '#fdfdfd' }}>
                  <Statistic title={title} value={value} />
                </Card>
              </Col>
            ))}
          </Row>
          <div className={style['AdminFunds-headerMeta']}>
            <span className={style['AdminFunds-title']}>Funds ({records.length})</span>
            <Space>
              <Button type="primary" onClick={() => messageApi.error('Not supported operation. Couldn\'t withdraw for now.')}>Withdraw</Button>
            </Space>
          </div>
        </div>
        <div className={style['AdminFunds-body']}>
          <Table columns={[]} dataSource={records} pagination={false} />
        </div>
      </div>
    </AdminOnly>
  );
}

export default AdminFunds;
