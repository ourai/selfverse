import { useState, useEffect } from 'react';
import { Avatar, Button, Modal, Form, InputNumber, List, Tabs, type TabsProps, message } from 'antd';
import { HeartFilled } from '@ant-design/icons';
import { EthereumFilled, EthereumColorful } from '@ant-design/web3-icons';
import { parseEther } from 'viem';

import type { DonationRecord, Donator } from '../../types';
import { useIdentityContext } from '../../components/identity';
import { fetchList, fetchDonatorList, donate } from '../../services/donation';

import RecordCard from './RecordCard';
import DonatorCard from './DonatorCard';
import style from './style.module.scss';

function Donation() {
  const identity = useIdentityContext();
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [donators, setDonators] = useState<Donator[]>([]);
  const [renderedAt, setRenderedAt] = useState(Date.now());
  const [dialogVisible, setDialogVisible] = useState(false);
  const [donatedAmount, setDonatedAmount] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    Promise.all([fetchList() as Promise<DonationRecord[]>, fetchDonatorList() as Promise<Donator[]>])
      .then(results => {
        setDonations(results[0]);
        setDonators(results[1]);
      })
      .catch(err => {
        messageApi.error('Error occurred during fetching donations and donators.');
        console.log('[ERROR]', err);
      });
  }, [renderedAt]);

  useEffect(() => {
    if (!updating || donatedAmount <= 0) {
      return;
    }

    donate(parseEther(`${donatedAmount}`))
      .then(() => {
        messageApi.success('Thanks for your coffee! ;-D');
        closeDialog();
        setRenderedAt(Date.now());
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

  const tabItems: TabsProps['items'] = [
    {
      key: 'donator',
      label: `Donators (${donators.length})`,
      children: (
        <List
          dataSource={donators.slice().reverse()}
          grid={{ gutter: 16, column: 4 }}
          renderItem={item => (
            <List.Item>
              <DonatorCard dataSource={item} />
            </List.Item>
          )}
        />
      ),
    },
    {
      key: 'donation',
      label: `Donations (${donations.length})`,
      children: (
        <List
          dataSource={donations.slice().reverse()}
          grid={{ gutter: 16, column: 4 }}
          renderItem={item => (
            <List.Item>
              <RecordCard dataSource={item} />
            </List.Item>
          )}
        />
      ),
    },
  ];

  return (
    <div className={style.Donation}>
      {contextHolder}
      <header className={style['Donation-header']}>
        <div className={style['Donation-headerContent']}>
          <div className={style['Donation-donee']}>
            <Avatar src="/ourai.jpg" size={150} />
          </div>
          {identity.checked && identity.visitor && (
            <Button className={style['Donation-trigger']} type="primary" size="large" icon={<EthereumFilled />} iconPosition="end" onClick={() => setDialogVisible(true)}>Buy me a cup of coffee</Button>
          )}
        </div>
      </header>
      <article className={style['Donation-body']}>
        {donations.length > 0 ? (
          <>
            <p className={style['Donation-thanks']}>Thank you all for supporting my work. <HeartFilled style={{ color: '#f00' }} /></p>
            <Tabs items={tabItems} centered />
          </>
        ) : (
          <p className={style['Donation-thanks']}>There's no donations yet.</p>
        )}
      </article>
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
  );
}

export default Donation;
