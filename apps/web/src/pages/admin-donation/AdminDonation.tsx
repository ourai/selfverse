import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, type TableProps, Table, Space, Button, message } from 'antd';
import { formatEther } from 'viem';

import type { DonationRecord, Donator } from '../../types';
import { formatUnixDate } from '../../utils';
import { updateAdmin, fetchList, fetchDonatorList, fetchReceived, fetchMinted } from '../../services/donation';
import AdminOnly from "../../components/admin-only";

import style from './style.module.scss';

function AdminDonation() {
  const [received, setReceived] = useState('0');
  const [donatorCount, setDonatorCount] = useState(0);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [minted, setMinted] = useState(0);
  const [fetched, setFetched] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (fetched) {
      return;
    }

    Promise.all([
      fetchList() as Promise<DonationRecord[]>,
      fetchDonatorList() as Promise<Donator[]>,
      fetchReceived() as Promise<bigint>,
      fetchMinted() as Promise<bigint>,
    ])
    .then(results => {
      setDonations(results[0]);
      setDonatorCount(results[1].length);
      setReceived(formatEther(results[2]));
      setMinted(Number(results[3]));
    })
    .catch(err => {
      messageApi.error('Error occurred during fetching donation.');
      console.log('[ERROR]', err);
    })
    .finally(() => setFetched(true));
  });

  const indexes = [
    { title: 'Received (ETH)', value: received },
    { title: 'Donators', value: donatorCount },
    { title: 'Badges', value: minted },
  ];

  const columns: TableProps<DonationRecord>['columns'] = [
    {
      title: 'Donator',
      dataIndex: 'donator',
      key: 'donator',
    },
    {
      title: 'Amount (ETH)',
      dataIndex: 'amount',
      key: 'amount',
      width: 200,
      render: val => <>{formatEther(val)}</>,
    },
    {
      title: 'Donated at',
      dataIndex: 'donatedAt',
      key: 'donatedAt',
      width: 250,
      render: val => <>{formatUnixDate(val)}</>,
    },
  ];

  return (
    <AdminOnly updateAdmin={updateAdmin} busy={false}>
      {contextHolder}
      <div className={style.AdminDonationList}>
        <div className={style['AdminDonationList-header']}>
          <Row className={style['AdminDonationList-statistics']} gutter={16}>
            {indexes.map(({ title, value }) => (
              <Col span={24 / indexes.length}>
                <Card style={{ backgroundColor: '#fdfdfd' }}>
                  <Statistic title={title} value={value} />
                </Card>
              </Col>
            ))}
          </Row>
          <div className={style['AdminDonationList-headerMeta']}>
            <span className={style['AdminDonationList-title']}>Donations ({donations.length})</span>
            <Space>
              <Button type="primary" disabled>Withdraw</Button>
            </Space>
          </div>
        </div>
        <div className={style['AdminDonationList-body']}>
          <Table columns={columns} dataSource={donations.slice().reverse()} rowKey="donatedAt" pagination={false} />
        </div>
      </div>
    </AdminOnly>
  );
}

export default AdminDonation;
