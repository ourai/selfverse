import { useState, useEffect } from 'react';
import { type TableProps, Table, Space, Button, Modal, Form, message } from 'antd';

import type { WorkFormValue, WorkListItem } from '../../types';
import { fetchOwner, fetchAdmin, updateAdmin, fetchList, insertOne } from '../../services/works';
import AdminOnly from '../../components/admin-only';

import AdminWorkForm from './AdminWorkForm';
import style from './style.module.scss';

const defaultWorkFormValue: WorkFormValue = {
  title: '',
  cover: '',
  price: 0,
  description: '',
};

function AdminWorksList() {
  const [works, setWorks] = useState<WorkListItem[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [chosenWork, setChosenWork] = useState<WorkFormValue>(defaultWorkFormValue);
  const [form] = Form.useForm<WorkFormValue>();
  const [messageApi, contextHolder] = message.useMessage();
  const [ updating, setUpdating ] = useState(false);

  useEffect(() => {
    fetchList()
      .then(res => {
        console.log('res in admin works', res);
        setWorks(res as WorkListItem[]);
      })
      .catch(err => {
        messageApi.error('Error occurred during fetching works.');
        console.log('[ERROR]', err);
      });
  }, []);

  useEffect(() => {
    if (!updating) {
      return;
    }

    if (chosenWork.id) {} else {
      insertOne(chosenWork)
        .then(res => {
          messageApi.success(`${chosenWork.title} has been successfully added.`);
          console.log(res);
        })
        .catch(err => {
          messageApi.error(`Error occurred during inserting ${chosenWork.title}`);
          console.log('[ERROR]', err);
        })
        .finally(() => setUpdating(false))
    }
  }, [chosenWork, updating]);

  const closeDialog = () => {
    form.resetFields();
    setDialogVisible(false);
  };

  const handleSubmit = (values: WorkFormValue) => {
    setChosenWork(values);
    setUpdating(true);
  }

  const columns: TableProps<WorkListItem>['columns'] = [
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
          <Button size="small" onClick={() => setChosenWork(item)}>Edit</Button>
          <Button size="small" danger>Remove</Button>
        </Space>
      ),
    },
  ];

  return (
    <AdminOnly busy={updating} fetchOwner={fetchOwner} fetchAdmin={fetchAdmin} updateAdmin={updateAdmin}>
      {contextHolder}
      <div className={style.AdminWorksList}>
        <div className={style['AdminWorksList-header']}>
          <span className={style['AdminWorksList-title']}>Works ({works.length})</span>
          <Space>
            <Button type="primary" onClick={() => setDialogVisible(true)}>Create</Button>
          </Space>
        </div>
        <div className={style['AdminWorksList-body']}>
          <Table columns={columns} dataSource={works} rowKey="id" pagination={false} />
        </div>
      </div>
      <Modal
        title={`${chosenWork.id ? 'Edit' : 'Add'} work`}
        confirmLoading={updating}
        open={dialogVisible}
        onOk={() => form.submit()} onCancel={closeDialog}
      >
        <AdminWorkForm form={form} initialValue={chosenWork} onSubmit={handleSubmit} />
      </Modal>
    </AdminOnly>
  );
}

export default AdminWorksList;
