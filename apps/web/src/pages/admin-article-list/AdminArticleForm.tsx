import { type FormProps as AntdFormProps, Form, Input } from 'antd';

import type { ArticleFormValue } from '../../types';

type FormProps = Required<AntdFormProps<ArticleFormValue>>;

type AdminArticleFormProps = {
  readonly form: FormProps['form'];
  readonly onSubmit: FormProps['onFinish'];
};

function AdminArticleForm(props: AdminArticleFormProps) {
  return (
    <Form
      form={props.form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      onFinish={props.onSubmit}
      autoComplete="off"
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: 'Please input article\'s title!' }]}
      >
        <Input placeholder="What's the name of your article?" />
      </Form.Item>
      <Form.Item
        label="Banner"
        name="banner"
        rules={[{ required: true, message: 'Please input article\'s banner URL!' }]}
      >
        <Input placeholder="What's the banner URL of your article?" />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: 'Please input article\'s description!' }]}
      >
        <Input.TextArea placeholder="Introduce your article briefly." autoSize={{ minRows: 2, maxRows: 6 }} />
      </Form.Item>
      <Form.Item
        label="Content"
        name="content"
        rules={[{ required: true, message: 'Please input article\'s content!' }]}
      >
        <Input.TextArea placeholder="Write your article content." autoSize={{ minRows: 4, maxRows: 12 }} />
      </Form.Item>
      <Form.Item name="id" style={{ display: 'none' }}>
        <Input type="hidden" />
      </Form.Item>
    </Form>
  );
}

export default AdminArticleForm;
