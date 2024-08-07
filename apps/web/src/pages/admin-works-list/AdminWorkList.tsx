import { useState, useEffect } from 'react';
import { type TableProps, Table, Space, Button } from 'antd';

import { fetchOwner, fetchAdmin, updateAdmin, fetchList } from '../../services/works';
import AdminOnly from '../../components/admin-only';

import style from './style.module.scss';

function AdminWorksList() {
  const [works, setWorks] = useState([]);

  useEffect(() => {
    fetchList().then(res => {
      console.log('res in admin works', res);
    });
  }, []);

  const columns: TableProps<any>['columns'] = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      fixed: 'left',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Cover',
      dataIndex: 'cover',
      key: 'cover',
      ellipsis: true,
    },
    {
      title: 'Price (ETH)',
      dataIndex: 'price',
      key: 'price',
      width: 150,
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 220,
      fixed: 'right',
      render: (_, item) => (
        <Space>
          {item.listing ? (
            <Button size="small">Unlist</Button>
          ) : (
            <Button size="small">Sell</Button>
          )}
          <Button size="small">Edit</Button>
          <Button size="small" danger>Remove</Button>
        </Space>
      ),
    },
  ];

  return (
    <AdminOnly fetchOwner={fetchOwner} fetchAdmin={fetchAdmin} updateAdmin={updateAdmin}>
      <div className={style.AdminWorksList}>
        <div className={style['AdminWorksList-header']}>
          <span className={style['AdminWorksList-title']}>Works ({works.length})</span>
          <Space>
            <Button type="primary">Create</Button>
          </Space>
        </div>
        <div className={style['AdminWorksList-body']}>
          <Table columns={columns} dataSource={works} rowKey="id" pagination={false} />
        </div>
      </div>
    </AdminOnly>
  );
}

export default AdminWorksList;
