import { useLocation, Link, Outlet } from 'react-router-dom';
import { Layout, Menu, type MenuProps } from 'antd';
import { FileTextOutlined, BookOutlined, HeartOutlined } from '@ant-design/icons';
import { USDTFilled } from '@ant-design/web3-icons';

import { useIsAdmin } from '../../hooks';

import style from './style.module.scss';

const pathPrefix = '/cellar';

function LayoutBody() {
  const isAdmin = useIsAdmin();
  const { pathname } = useLocation();

  const menuItems: MenuProps['items'] = [
    {
      label: <Link to={`${pathPrefix}/articles`}>Articles</Link>,
      key: 'articles',
      icon: <FileTextOutlined />,
    },
    {
      label: <Link to={`${pathPrefix}/works`}>Works</Link>,
      key: 'works',
      icon: <BookOutlined />,
    },
    {
      label: <Link to={`${pathPrefix}/donation`}>Donation</Link>,
      key: 'donation',
      icon: <HeartOutlined />,
    },
    {
      label: <Link to={`${pathPrefix}/funds`}>Funds</Link>,
      key: 'funds',
      icon: <USDTFilled />,
    },
  ];
  const currentMenu = menuItems.find(item => `${pathPrefix}/${item!.key}` === pathname );

  return (
    <Layout className={style['AdminLayout-body']}>
      {isAdmin ? (
        <>
          <Layout.Sider className={style['AdminLayout-sidebar']} theme="light">
            <Menu items={menuItems} selectedKeys={(currentMenu ? [currentMenu.key!] : []) as string[]} />
          </Layout.Sider>
          <Layout.Content className={style['AdminLayout-main']}>
            <Outlet />
          </Layout.Content>
        </>
      ) : (
        <div className={style['AdminLayout-noAuth']}>Connect wallet first.</div>
      )}
    </Layout>
  );
}

export default LayoutBody;
