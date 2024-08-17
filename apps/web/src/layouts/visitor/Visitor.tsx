import { useLocation, Link, Outlet } from 'react-router-dom';
import { Layout, Flex, Space, Menu, type MenuProps } from 'antd';

import Container from '../../components/container';
import Passport from '../../components/passport';

import style from './style.module.scss';

function VisitorLayout() {
  const { pathname } = useLocation();

  const containerStyle = { maxWidth: 1280, margin: '0 auto' };
  const menuItems: MenuProps['items'] = [
    {
      label: <Link to="/articles">Articles</Link>,
      key: 'articles',
    },
    {
      label: <Link to="/works">Works</Link>,
      key: 'works',
    },
    {
      label: <Link to="/donation">Donation</Link>,
      key: 'donation',
    },
  ];
  const currentMenu = menuItems.find(item => pathname.startsWith(`/${item!.key}`));

  return (
    <Container>
      <Layout className={style.VisitorLayout}>
        <Layout.Header className={style['VisitorLayout-header']}>
          <Flex align="center" justify="space-between" style={containerStyle}>
            <div className={style['VisitorLayout-headerMain']}>
              <div className={style['VisitorLayout-brand']}>
                <Link to="/">Selfverse</Link>
              </div>
              <Menu className={style['VisitorLayout-navs']} items={menuItems} selectedKeys={(currentMenu ? [currentMenu.key!] : []) as string[]} mode="horizontal" />
            </div>
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
