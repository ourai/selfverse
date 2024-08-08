import { type FormProps as AntdFormProps, Form, Input, InputNumber } from 'antd';
import { EthereumColorful } from '@ant-design/web3-icons';

import type { WorkFormValue } from '../../types';

type FormProps = Required<AntdFormProps<WorkFormValue>>;

type AdminWorkFormProps = {
  readonly form: FormProps['form'];
  readonly initialValue: FormProps['initialValues'];
  readonly onSubmit: FormProps['onFinish'];
};

function AdminWorkForm(props: AdminWorkFormProps) {
  return (
    <Form
      form={props.form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      initialValues={props.initialValue}
      onFinish={props.onSubmit}
      autoComplete="off"
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: 'Please input work\'s title!' }]}
      >
        <Input placeholder="What's the name of your work?" />
      </Form.Item>
      <Form.Item
        label="Cover"
        name="cover"
        rules={[{ required: true, message: 'Please input work\'s cover URL!' }]}
      >
        <Input placeholder="What's the cover URL of your work?" />
      </Form.Item>
      <Form.Item
        label="Price"
        name="price"
        rules={[{ required: true, message: 'Please input work\'s price!' }]}
      >
        <InputNumber style={{ width: '100%' }} placeholder="How much do you want to sell?" min={0} addonBefore={<EthereumColorful />} addonAfter="ETH" />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: 'Please input work\'s description!' }]}
      >
        <Input.TextArea placeholder="Introduce your work briefly." autoSize={{ minRows: 2, maxRows: 6 }} />
      </Form.Item>
      <Form.Item label="Badge" name="badgeContract">
        <Input placeholder="Smart contract address for badge." />
      </Form.Item>
      <Form.Item label="Content" name="content">
        <Input.TextArea placeholder="Introduce your work patiently." autoSize={{ minRows: 4, maxRows: 12 }} />
      </Form.Item>
    </Form>
  );
}

export default AdminWorkForm;
