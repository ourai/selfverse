import { type FormProps as AntdFormProps, Button, Form, InputNumber, Input, Flex } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { ChapterFormValue } from '../../types';
import style from './style.module.scss';

type FormProps = Required<AntdFormProps<ChapterFormValue>>;

type ChapterListFormProps = {
  readonly form: FormProps['form'];
  readonly onSubmit: FormProps['onFinish'];
};

const formItemLayout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

function ChapterListForm(props: ChapterListFormProps) {
  return (
    <Form
      form={props.form}
      {...formItemLayout}
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
            {fields.map(field => (
              <Form.Item
                {...formItemLayout}
                label={false}
                required={false}
                key={`parent-${field.key}`}
              >
                <Flex align="center" justify="space-between">
                  <div className={style['ChapterListForm-chapterField']}>
                    <Form.Item
                      name={field.name}
                      key={field.key}
                      fieldKey={field.fieldKey}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[{ required: true, message: "Please input article's ID or delete this field." }]}
                      noStyle
                    >
                      <InputNumber placeholder="Article ID" min={0} precision={0} />
                    </Form.Item>
                  </div>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined className={style['ChapterListForm-removeTrigger']} onClick={() => remove(field.name)} />
                  ) : null}
                </Flex>
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
