import { Link } from 'react-router-dom';
import { Layout, Flex, Space } from 'antd';

import Container from '../../components/container';
import Passport from '../../components/passport';

import LayoutBody from './LayoutBody';
import style from './style.module.scss';

function AdminLayout() {
  return (
    <Container>
      <Layout className={style.AdminLayout}>
        <Layout.Header className={style['AdminLayout-header']}>
          <Flex align="center" justify="space-between">
            <div style={{ fontSize: 24 }}>
              <Link to="/">Selfverse</Link>
            </div>
            <Space>
              <Passport />
            </Space>
          </Flex>
        </Layout.Header>
        <LayoutBody />
      </Layout>
    </Container>
  )
}

export default AdminLayout;
