import { type PropsWithChildren, type ReactNode, useState, useEffect } from 'react';
import { Form, Input, Button, Spin, Modal, message } from 'antd';

import type { AddressHash } from '../../types';
import { useIdentityContext } from '../../components/identity';
import style from './style.module.scss';

type AdminOnlyProps = PropsWithChildren<{
  updateAdmin: (address: AddressHash) => Promise<any>;
  busy: boolean;
}>;

function AdminOnly(props: AdminOnlyProps) {
  const identity = useIdentityContext();
  const [messageApi, contextHolder] = message.useMessage();
  const [updating, setUpdating] = useState(false);
  const [newAdmin, setNewAdmin] = useState('');

  let resolvedChildren: ReactNode;

  useEffect(() => {
    if (!identity.owner || !updating || !newAdmin) {
      return;
    }

    props.updateAdmin(newAdmin as AddressHash)
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

    if (adminAddr === identity.adminAddress) {
      return messageApi.error('Address hasn\'t been changed.');
    }

    if (identity.adminAddress) {
      Modal.confirm({
        title: 'Update admin\'s address',
        content: 'Are you sure to update?',
        onOk: () => updateNewAdmin(adminAddr),
      });
    } else {
      updateNewAdmin(adminAddr);
    }
  }

  if (identity.owner) {
    resolvedChildren = (
      <div style={{ maxWidth: 600, margin: '0 auto', paddingTop: 100 }}>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={{ address: identity.adminAddress }}
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
          <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
            <Button type="primary" htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      </div>
    );
  } else if (identity.admin) {
    resolvedChildren = props.children;
  } else if (identity.checked) {
    resolvedChildren = <div>You shouldn't be here.</div>
  }

  return (
    <Spin wrapperClassName={style.AdminOnly} spinning={props.busy || updating || !identity.checked}>
      {contextHolder}
      {resolvedChildren}
    </Spin>
  );
}

export default AdminOnly;
