import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Modal, Form, InputNumber, message } from 'antd';
import { CoffeeOutlined } from '@ant-design/icons';
import { EthereumColorful } from '@ant-design/web3-icons';
import { parseEther } from 'viem';
import markdownIt from 'markdown-it';

import type { ArticleListItem } from '../../types';
import { resolveRelativeTime } from '../../utils';
import { fetchOne, donate } from '../../services/article';

import style from './style.module.scss';

const md = markdownIt({ html: true });

function ArticleItem() {
  const [record, setRecord] = useState<ArticleListItem>();
  const [fetched, setFetched] = useState(false);
  const { id } = useParams();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [donatedAmount, setDonatedAmount] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (fetched) {
      return;
    }

    const articleId = BigInt(id!);

    fetchOne(articleId)
      .then(res => {
        setRecord(res);
        setFetched(true);
      })
      .catch(err => {
        messageApi.error('Error occurred during fetching article.');
        console.log('[ERROR]', err);
      });
  });

  useEffect(() => {
    if (!updating || donatedAmount <= 0) {
      return;
    }

    donate(BigInt(id!), parseEther(`${donatedAmount}`))
      .then(() => {
        messageApi.success('Thanks for your coffee! ;-D');
        closeDialog();
      })
      .catch(err => {
        messageApi.error(`Error occurred during donation.`);
        console.log('[ERROR]', err);
      })
      .finally(() => setUpdating(false))
  }, [donatedAmount, updating]);

  const closeDialog = () => {
    form.resetFields();
    setDialogVisible(false);
  };

  const handleSubmit = ({ amount }: { amount: number }) => {
    if (!amount && amount <= 0) {
      return messageApi.error('Donation amount must be greater than 0.');
    }

    setDonatedAmount(amount);
    setUpdating(true);
  }

  return (
    <>
      {contextHolder}
      {record ? (
        <div className={style.ArticleItem}>
          <header className={style['ArticleItem-header']} style={{ backgroundImage: `url('${record.banner}')` }}>
            <div className={style['ArticleItem-headerMain']}>
              <h1 className={style['ArticleItem-title']}>{record.title}</h1>
              <p>Posted {resolveRelativeTime(record.publishedAt)}</p>
            </div>
          </header>
          <article
            className={style['ArticleItem-body']}
            dangerouslySetInnerHTML={{ __html: md.render(record.content) }}
          />
          <div className={style['ArticleItem-footer']}>
            <Button
              className={style['ArticleItem-donation']}
              size="large"
              shape="circle"
              icon={<CoffeeOutlined />}
              onClick={() => setDialogVisible(true)}
            />
          </div>
          <Modal
            title="Donate a cup of coffee"
            open={dialogVisible}
            confirmLoading={updating}
            closable={!updating}
            maskClosable={false}
            keyboard={false}
            onOk={() => form.submit()}
            onCancel={closeDialog}
          >
            <Form
              form={form}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              initialValues={{ amount: 0 }}
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item
                label="Amount"
                name="amount"
                rules={[{ required: true, message: 'Please input amount!' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="How much do you want to donate?" min={0} addonBefore={<EthereumColorful />} addonAfter="ETH" />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      ) : <div>不存在</div>}
    </>
  )
}

export default ArticleItem;
