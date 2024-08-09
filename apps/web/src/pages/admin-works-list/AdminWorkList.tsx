import { useState, useEffect } from 'react';
import { type TableProps, Table, Image, Space, Button, Modal, Form, Popconfirm, message } from 'antd';
import { isAddress, formatEther } from 'viem';

import type { WorkFormValue, WorkListItem } from '../../types';
import { updateAdmin, fetchList, insertOne, listForSales } from '../../services/works';
import AdminOnly from '../../components/admin-only';

import AdminWorkForm from './AdminWorkForm';
import style from './style.module.scss';

function getDefaultWorkFormValue(): WorkFormValue {
  return {
    title: '',
    cover: '',
    price: 0,
    description: '',
  };
}

function AdminWorksList() {
  const [works, setWorks] = useState<WorkListItem[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [chosenWork, setChosenWork] = useState<WorkFormValue>(getDefaultWorkFormValue());
  const [form] = Form.useForm<WorkFormValue>();
  const [messageApi, contextHolder] = message.useMessage();
  const [updating, setUpdating] = useState(false);
  const [renderedAt, setRenderedAt] = useState(Date.now());

  useEffect(() => {
    fetchList()
      .then(res => setWorks(res as WorkListItem[]))
      .catch(err => {
        messageApi.error('Error occurred during fetching works.');
        console.log('[ERROR]', err);
      });
  }, [renderedAt]);

  useEffect(() => {
    if (!updating) {
      return;
    }

    if (chosenWork.id) {
      messageApi.warning('暂不支持此功能');
      closeDialog();
      setUpdating(false);
    } else {
      insertOne(chosenWork)
        .then(() => {
          messageApi.success(`${chosenWork.title} has been successfully added.`);
          closeDialog();
          setRenderedAt(Date.now());
        })
        .catch(err => {
          messageApi.error(`Error occurred during inserting ${chosenWork.title}.`);
          console.log('[ERROR]', err);
        })
        .finally(() => setUpdating(false))
    }
  }, [chosenWork, updating]);

  const openDialog = (work: WorkFormValue) => {
    form.setFieldsValue(work);
    setDialogVisible(true);
  };

  const closeDialog = () => {
    form.resetFields();
    setDialogVisible(false);

    if (updating) {
      setUpdating(false);
    }
  };

  const handleSubmit = (values: WorkFormValue) => {
    if (values.badgeContract && !isAddress(values.badgeContract)) {
      return messageApi.error('The value of badge isn\'t a valid smart contract address.');
    }

    setChosenWork(values);
    setUpdating(true);
  }

  const handleSell = (work: WorkListItem) => {
    const toListForSales = !work.listing;

    let successText;
    let failedText;

    if (toListForSales) {
      successText = `${work.title} has been listed for sales.`;
      failedText = `Error occurred during listing ${work.title} for sales.`;
    } else {
      successText = `${work.title} has been unlisted.`;
      failedText = `Error occurred during unlisting ${work.title}.`;
    }

    listForSales(work.id, toListForSales)
      .then(() => {
        messageApi.success(successText);
        setRenderedAt(Date.now());
      })
      .catch(err => {
        messageApi.error(failedText);
        console.log('[ERROR]', err);
      });
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
      width: 150,
      ellipsis: true,
      render: val => <Image width={100} src={val} />,
    },
    {
      title: 'Price (ETH)',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      render: val => <>{formatEther(val)}</>,
    },
    {
      title: 'Operation',
      key: 'operation',
      width: 220,
      fixed: 'right',
      render: (_, item) => {
        let hintTitle;
        let hintText;
        let btnText;

        if (item.listing) {
          hintTitle = 'Unlist it';
          hintText = `Are you sure to unlist ${item.title}?`;
          btnText = 'Unlist';
        } else {
          hintTitle = 'Sell it';
          hintText = `Are you sure to list ${item.title} for sales?`;
          btnText = 'Sell';
        }

        return (
          <Space>
            <Popconfirm
              title={hintTitle}
              description={hintText}
              okText="Yes"
              cancelText="No"
              onConfirm={handleSell.bind(null, item)}
            >
              <Button size="small">{btnText}</Button>
            </Popconfirm>
            <Button size="small" onClick={openDialog.bind(null, item)}>Edit</Button>
            <Button size="small" danger onClick={() => messageApi.error('Not supported operation. Couldn\'t be removed for now.')}>Remove</Button>
          </Space>
        )
      },
    },
  ];

  return (
    <AdminOnly updateAdmin={updateAdmin} busy={updating}>
      {contextHolder}
      <div className={style.AdminWorksList}>
        <div className={style['AdminWorksList-header']}>
          <span className={style['AdminWorksList-title']}>Works ({works.length})</span>
          <Space>
            <Button type="primary" onClick={openDialog.bind(null, getDefaultWorkFormValue())}>Create</Button>
          </Space>
        </div>
        <div className={style['AdminWorksList-body']}>
          <Table columns={columns} dataSource={works} rowKey="id" pagination={false} />
        </div>
      </div>
      <Modal
        title={`${form.getFieldValue('id') ? 'Edit' : 'Add'} work`}
        open={dialogVisible}
        confirmLoading={updating}
        closable={!updating}
        maskClosable={false}
        keyboard={false}
        onOk={() => form.submit()}
        onCancel={closeDialog}
      >
        <AdminWorkForm form={form} onSubmit={handleSubmit} />
      </Modal>
    </AdminOnly>
  );
}

export default AdminWorksList;
