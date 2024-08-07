import { Link, Outlet } from 'react-router-dom';
import { Layout, Flex, Space, Menu, type MenuProps } from 'antd';

import Container from '../../components/container';
import Passport from '../../components/passport';

import style from './style.module.scss';

function VisitorLayout() {
  const containerStyle = { maxWidth: 1280, margin: '0 auto' };
  const menuItems: MenuProps['items'] = [
    {
      label: <Link to="/works">Works</Link>,
      key: 'works',
    },
    {
      label: <Link to="/donation">Donation</Link>,
      key: 'donation',
    },
  ];

  return (
    <Container>
      <Layout className={style.VisitorLayout}>
        <Layout.Header className={style['VisitorLayout-header']}>
          <Flex align="center" justify="space-between" style={containerStyle}>
            <Space>
              <div style={{ fontSize: 24 }}>
                <Link to="/">Selfverse</Link>
              </div>
              <Menu items={menuItems} mode="horizontal" />
            </Space>
            <Space>
              <Passport />
            </Space>
          </Flex>
        </Layout.Header>
        <Layout.Content className={style['VisitorLayout-body']}>
          <div style={{ ...containerStyle, padding: 24 }}>
            <Outlet />
          </div>
        </Layout.Content>
      </Layout>
    </Container>
  )
}

export default VisitorLayout;
