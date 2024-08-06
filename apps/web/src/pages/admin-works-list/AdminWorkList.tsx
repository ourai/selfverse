import { type TableProps, Table, Space, Button } from 'antd';

import style from './style.module.scss';

function AdminWorksList() {
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
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
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

  const works = Array.from(new Array(8)).map((_, i) => ({
    id: i + 1,
    title: `作品 ${i + 1}`,
    description: `作品 ${i + 1} 的介绍介绍介绍介绍作品 ${i + 1} 的介绍介绍介绍介绍作品 ${i + 1} 的介绍介绍介绍介绍`,
    cover: '',
    price: i,
    listing: i % 2 === 0,
  }));

  return (
    <div className={style.AdminWorksList}>
      <div className={style['AdminWorksList-header']}>
        <span className={style['AdminWorksList-title']}>{works.length} works</span>
        <Space>
          <Button type="primary">Create</Button>
        </Space>
      </div>
      <div className={style['AdminWorksList-body']}>
        <Table columns={columns} dataSource={works} rowKey="id" pagination={false} />
      </div>
    </div>
  );
}

export default AdminWorksList;
