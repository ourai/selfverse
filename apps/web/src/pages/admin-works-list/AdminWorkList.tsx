import { useState, useEffect } from 'react';
import { type TableProps, Table, Image, Space, Button, Modal, Form, Popconfirm, message } from 'antd';
import { isAddress, formatEther } from 'viem';

import type { WorkFormValue, WorkListItem, ChapterFormValue } from '../../types';
import { updateAdmin, fetchList, insertOne, listForSales, fetchChapters, updateChapters } from '../../services/works';
import AdminOnly from '../../components/admin-only';

import AdminWorkForm from './AdminWorkForm';
import ChapterListForm from './ChapterListForm';
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
  const [chapterDialogVisible, setChapterDialogVisible] = useState(false);
  const [chapterUpdating, setChapterUpdating] = useState(false);
  const [chapterForm] = Form.useForm<ChapterFormValue>();
  const [chosenWithChapters, setChosenWithChapters] = useState<ChapterFormValue>();
  const [chapters, setChapters] = useState<(number | bigint)[]>([]);

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
        .finally(() => setUpdating(false));
    }
  }, [chosenWork, updating]);

  useEffect(() => {
    if (!chapterUpdating) {
      return;
    }

    updateChapters(chosenWithChapters!.id, chosenWithChapters!.chapters)
      .then(() => {
        messageApi.success(`Chapters have been successfully updated.`);
        closeChapterDialog();
        setRenderedAt(Date.now());
      })
      .catch(err => {
        messageApi.error(`Error occurred during updating chapters.`);
        console.log('[ERROR]', err);
      })
      .finally(() => setChapterUpdating(false));
  }, [chosenWithChapters, chapterUpdating]);

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

  const openChapterDialog = async (work: WorkFormValue) => {
    const id = work.id!;
    const chapters = (await fetchChapters(id)) as (number | bigint)[];

    chapterForm.setFieldsValue({ id, chapters });
    setChapterDialogVisible(true);
  };

  const closeChapterDialog = () => {
    chapterForm.resetFields();
    setChapterDialogVisible(false);

    if (chapterUpdating) {
      setChapterUpdating(false);
    }
  };

  const handleChapterSubmit = (values: ChapterFormValue) => {
    const resolved: (number | bigint)[] = [];

    values.chapters.forEach(c => {
      if (c && !resolved.some(v => v === c)) {
        resolved.push(c);
      }
    });

    if (resolved.length < 2) {
      return messageApi.error('Count of chapters must be greater than 1.');
    }

    setChosenWithChapters({ id: values.id, chapters: resolved });
    setChapterUpdating(true);
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
      width: 300,
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
            <Button size="small" onClick={openChapterDialog.bind(null, item)}>Chapter</Button>
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
      <Modal
        title="Update chapters"
        open={chapterDialogVisible}
        confirmLoading={chapterUpdating}
        closable={!chapterUpdating}
        maskClosable={false}
        keyboard={false}
        onOk={() => chapterForm.submit()}
        onCancel={closeChapterDialog}
      >
        <ChapterListForm form={chapterForm} onSubmit={handleChapterSubmit} />
      </Modal>
    </AdminOnly>
  );
}

export default AdminWorksList;
