import { useState, useEffect } from 'react';
import { type TableProps, Table, Image, Space, Button, Modal, Form, Popconfirm, message } from 'antd';

import type { ArticleFormValue, ArticleListItem } from '../../types';
import { updateAdmin, fetchAll, insertOne, publish } from '../../services/article';
import AdminOnly from "../../components/admin-only";

import AdminArticleForm from './AdminArticleForm';
import style from './style.module.scss';

function getDefaultArticleFormValue(): ArticleFormValue {
  return {
    title: '',
    description: '',
    content: '',
    banner: '',
    published: false,
  };
}

function AdminArticleList() {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [chosenArticle, setChosenArticle] = useState<ArticleFormValue>(getDefaultArticleFormValue());
  const [form] = Form.useForm<ArticleFormValue>();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [renderedAt, setRenderedAt] = useState(Date.now());

  useEffect(() => {
    fetchAll()
      .then(res => setArticles(res))
      .catch(err => {
        messageApi.error('Error occurred during fetching articles.');
        console.log('[ERROR]', err);
      });
  }, [renderedAt]);

  useEffect(() => {
    if (!updating) {
      return;
    }

    if (chosenArticle.id) {
      messageApi.warning('暂不支持此功能');
      closeDialog();
      setUpdating(false);
    } else {
      insertOne(chosenArticle)
        .then(() => {
          messageApi.success(`${chosenArticle.title} has been successfully added.`);
          closeDialog();
          setRenderedAt(Date.now());
        })
        .catch(err => {
          messageApi.error(`Error occurred during inserting ${chosenArticle.title}.`);
          console.log('[ERROR]', err);
        })
        .finally(() => setUpdating(false));
    }
  }, [chosenArticle, updating]);

  const openDialog = (article: ArticleFormValue) => {
    form.setFieldsValue(article);
    setDialogVisible(true);
  };

  const closeDialog = () => {
    form.resetFields();
    setDialogVisible(false);

    if (updating) {
      setUpdating(false);
    }
  };

  const handleSubmit = (values: ArticleFormValue) => {
    setChosenArticle(values);
    setUpdating(true);
  }

  const handlePublish = (article: ArticleListItem) => {
    const toPublish = !article.published;

    let successText;
    let failedText;

    if (toPublish) {
      successText = `${article.title} has been published.`;
      failedText = `Error occurred during publishing ${article.title}.`;
    } else {
      successText = `${article.title} has been unpublished.`;
      failedText = `Error occurred during unpublishing ${article.title}.`;
    }

    publish(article.id, toPublish)
      .then(() => {
        messageApi.success(successText);
        setRenderedAt(Date.now());
      })
      .catch(err => {
        messageApi.error(failedText);
        console.log('[ERROR]', err);
      });
  }

  const columns: TableProps<ArticleListItem>['columns'] = [
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
      title: 'Banner',
      dataIndex: 'banner',
      key: 'banner',
      width: 150,
      ellipsis: true,
      render: val => <Image width={100} src={val} />,
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

        if (item.published) {
          hintTitle = 'Unpublish it';
          hintText = `Are you sure to unpublish ${item.title}?`;
          btnText = 'Unpublish';
        } else {
          hintTitle = 'Publish it';
          hintText = `Are you sure to publish ${item.title}?`;
          btnText = 'Publish';
        }

        return (
          <Space>
            <Popconfirm
              title={hintTitle}
              description={hintText}
              okText="Yes"
              cancelText="No"
              onConfirm={handlePublish.bind(null, item)}
            >
              <Button size="small">{btnText}</Button>
            </Popconfirm>
            <Button size="small" onClick={openDialog.bind(null, item)}>Edit</Button>
          </Space>
        )
      },
    },
  ];

  return (
    <AdminOnly updateAdmin={updateAdmin} busy={false}>
      {contextHolder}
      <div className={style.AdminArticleList}>
        <div className={style['AdminArticleList-header']}>
          <span className={style['AdminArticleList-title']}>Articles ({articles.length})</span>
          <Space>
            <Button type="primary" onClick={openDialog.bind(null, getDefaultArticleFormValue())}>Create</Button>
          </Space>
        </div>
        <div className={style['AdminArticleList-body']}>
          <Table columns={columns} dataSource={articles} rowKey="id" pagination={false} />
        </div>
      </div>
      <Modal
        title={`${form.getFieldValue('id') ? 'Edit' : 'Add'} article`}
        open={dialogVisible}
        confirmLoading={updating}
        closable={!updating}
        maskClosable={false}
        keyboard={false}
        onOk={() => form.submit()}
        onCancel={closeDialog}
      >
        <AdminArticleForm form={form} onSubmit={handleSubmit} />
      </Modal>
    </AdminOnly>
  );
}

export default AdminArticleList;
