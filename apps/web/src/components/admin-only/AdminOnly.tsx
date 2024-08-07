import { type PropsWithChildren, type ReactNode, useState, useEffect } from 'react';
import { Form, Input, Button, Spin, Modal, message } from 'antd';
import { useAccount } from '@ant-design/web3';

import style from './style.module.scss';

type AdminOnlyProps = PropsWithChildren<{
  fetchOwner: () => Promise<string>;
  fetchAdmin: () => Promise<string>;
  updateAdmin: (address: `0x${string}`) => Promise<any>;
}>;

function AdminOnly({ fetchOwner, fetchAdmin, updateAdmin, children }: AdminOnlyProps) {
  const [owner, setOwner] = useState('');
  const [admin, setAdmin] = useState('');
  const [checked, setChecked] = useState(false);
  const { account: { address } } = useAccount();
  const [messageApi, contextHolder] = message.useMessage();
  const [updating, setUpdating] = useState(false);
  const [newAdmin, setNewAdmin] = useState('');
  const ownerSignedIn = address === owner;

  let resolvedChildren: ReactNode = children;

  useEffect(() => {
    Promise.all([fetchOwner(), fetchAdmin()]).then(results => {
      setOwner(results[0]);
      setAdmin(results[1]);
    }).finally(() => setChecked(true));
  });

  useEffect(() => {
    if (!ownerSignedIn || !updating || !newAdmin) {
      return;
    }

    updateAdmin(newAdmin as `0x${string}`)
      .then(() => messageApi.success(`Admin has updated to ${newAdmin}.`))
      .catch(err => {
        messageApi.error('Error occurred when update admin.');
        console.log('[ERROR]', err);
      })
      .finally(() => setUpdating(false));
  }, [updating, newAdmin]);

  const updateNewAdmin = (adminAddr: string) => {
    setUpdating(true);
    setNewAdmin(adminAddr);
  }

  const handleAdminFormSubmit = (values: { address: string }) => {
    const adminAddr = values.address;

    if (adminAddr.indexOf('0x') !== 0) {
      return messageApi.error('Address must start with 0x.');
    }

    if (adminAddr === admin) {
      return messageApi.error('Address hasn\'t been changed.');
    }

    if (admin) {
      Modal.confirm({
        title: 'Update admin\'s address',
        content: 'Are you sure to update?',
        onOk: () => updateNewAdmin(adminAddr),
      });
    } else {
      updateNewAdmin(adminAddr);
    }
  }

  if (ownerSignedIn) {
    resolvedChildren = (
      <div style={{ maxWidth: 600, margin: '0 auto', paddingTop: 100 }}>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ address: admin }}
          autoComplete="off"
          onFinish={handleAdminFormSubmit}
        >
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please input admin\'s address!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      </div>
    );
  } else if (address === admin) {
    resolvedChildren = children;
  } else if (checked) {
    resolvedChildren = <div>You shouldn't be here.</div>
  }

  return (
    <Spin wrapperClassName={style.AdminOnly} spinning={updating || !checked}>
      {contextHolder}
      {resolvedChildren}
    </Spin>
  );
}

export default AdminOnly;
