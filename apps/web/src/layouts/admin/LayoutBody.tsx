import { Outlet } from 'react-router-dom';
import { Layout, Menu, type MenuProps } from 'antd';
import { BookOutlined } from '@ant-design/icons';

import { useIsAdmin } from '../../hooks';

import style from './style.module.scss';

function LayoutBody() {
  const isAdmin = useIsAdmin();
  const menuItems: MenuProps['items'] = [
    {
      label: 'Works',
      key: 'works',
      icon: <BookOutlined />,
    },
  ];

  return (
    <Layout className={style['AdminLayout-body']}>
      {isAdmin ? (
        <>
          <Layout.Sider className={style['AdminLayout-sidebar']} theme="light">
            <Menu items={menuItems} defaultSelectedKeys={[menuItems[0]!.key as string]} />
          </Layout.Sider>
          <Layout.Content className={style['AdminLayout-main']}>
            <Outlet />
          </Layout.Content>
        </>
      ) : (
        <div className={style['AdminLayout-noAuth']}>Connect admin's wallet first.</div>
      )}
    </Layout>
  );
}

export default LayoutBody;
