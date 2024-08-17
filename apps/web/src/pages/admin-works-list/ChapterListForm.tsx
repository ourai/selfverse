import { type FormProps as AntdFormProps, Button, Form, InputNumber, Input } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { ChapterFormValue } from '../../types';

type FormProps = Required<AntdFormProps<ChapterFormValue>>;

type ChapterListFormProps = {
  readonly form: FormProps['form'];
  readonly onSubmit: FormProps['onFinish'];
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

function ChapterListForm(props: ChapterListFormProps) {
  return (
    <Form
      form={props.form}
      {...formItemLayoutWithOutLabel}
      onFinish={props.onSubmit}
    >
      <Form.List
        name="chapters"
        rules={[
          {
            validator: async (_, chapters) => {
              if (!chapters || chapters.length < 2) {
                return Promise.reject(new Error('At least 2 chapters'));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                label={index === 0 ? 'Chapters' : ''}
                required={false}
                key={`parent-${field.key}`}
              >
                <Form.Item
                  name={field.name}
                  key={field.key}
                  fieldKey={field.fieldKey}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      // whitespace: true,
                      message: "Please input article's ID or delete this field.",
                    },
                  ]}
                  noStyle
                >
                  <InputNumber style={{ width: '60%' }} placeholder="Article ID" min={0} precision={0} />
                </Form.Item>
                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    onClick={() => remove(field.name)}
                  />
                ) : null}
              </Form.Item>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
                block
              >
                Add chapter
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item name="id" style={{ display: 'none' }}>
        <Input type="hidden" />
      </Form.Item>
    </Form>
  );
}

export default ChapterListForm;
